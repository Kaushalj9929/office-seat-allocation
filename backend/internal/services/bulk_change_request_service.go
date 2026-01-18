package services

import (
	"office-seat-allocation/backend/internal/models"
	"office-seat-allocation/backend/internal/repositories"
	"time"

	"github.com/google/uuid"
)

type BulkChangeRequestService struct {
	bulkRepo          *BulkChangeRequestRepository
	changeRequestRepo *repositories.ChangeRequestRepository
	scheduleRepo      *repositories.ScheduleRepository
	capacityManager   *CapacityManager
}

func NewBulkChangeRequestService(
	bulkRepo *BulkChangeRequestRepository,
	changeRequestRepo *repositories.ChangeRequestRepository,
	scheduleRepo *repositories.ScheduleRepository,
	capacityManager *CapacityManager,
) *BulkChangeRequestService {
	return &BulkChangeRequestService{
		bulkRepo:          bulkRepo,
		changeRequestRepo: changeRequestRepo,
		scheduleRepo:      scheduleRepo,
		capacityManager:   capacityManager,
	}
}

type BulkChangeRequestInput struct {
	ScheduleID   uuid.UUID   `json:"schedule_id" binding:"required"`
	EmployeeIDs  []uuid.UUID `json:"employee_ids" binding:"required"`
	CurrentDay   int         `json:"current_day" binding:"required,min=1,max=5"`
	RequestedDay int         `json:"requested_day" binding:"required,min=1,max=5"`
	Reason       string      `json:"reason"`
}

func (s *BulkChangeRequestService) SubmitBulkRequest(input *BulkChangeRequestInput, createdBy uuid.UUID) (*models.BulkChangeRequest, error) {
	bulkReq := &models.BulkChangeRequest{
		ID:            uuid.New(),
		CreatedBy:     createdBy,
		Status:        "pending",
		TotalRequests: len(input.EmployeeIDs),
	}

	if err := s.bulkRepo.Create(bulkReq); err != nil {
		return nil, err
	}

	for _, empID := range input.EmployeeIDs {
		req := &models.ChangeRequest{
			ID:            uuid.New(),
			EmployeeID:    empID,
			CurrentDay:    input.CurrentDay,
			RequestedDay:  input.RequestedDay,
			Reason:        input.Reason,
			Status:        "pending",
			RequestedDate: time.Now(),
			BulkRequestID: &bulkReq.ID,
		}
		s.changeRequestRepo.Create(req)
	}

	return bulkReq, nil
}

func (s *BulkChangeRequestService) ApproveBulkRequest(bulkID, approvedBy uuid.UUID, notes string) error {
	bulkReq, err := s.bulkRepo.FindByID(bulkID)
	if err != nil {
		return err
	}

	bulkReq.Status = "processing"
	s.bulkRepo.Update(bulkReq)

	for _, req := range bulkReq.Requests {
		conflict, _ := s.capacityManager.DetectConflict(&req, req.EmployeeID)
		
		if conflict != nil {
			now := time.Now()
			req.Status = "rejected"
			req.ApprovedBy = &approvedBy
			req.DecisionDate = &now
			req.DecisionReason = "Capacity conflict: " + conflict.ConflictType
			s.changeRequestRepo.Update(&req)
			bulkReq.RejectedCount++
		} else {
			now := time.Now()
			req.Status = "approved"
			req.ApprovedBy = &approvedBy
			req.DecisionDate = &now
			req.DecisionReason = notes
			s.changeRequestRepo.Update(&req)
			bulkReq.ApprovedCount++
		}
	}

	bulkReq.Status = "completed"
	return s.bulkRepo.Update(bulkReq)
}

func (s *BulkChangeRequestService) RejectBulkRequest(bulkID, rejectedBy uuid.UUID, reason string) error {
	bulkReq, err := s.bulkRepo.FindByID(bulkID)
	if err != nil {
		return err
	}

	now := time.Now()
	for _, req := range bulkReq.Requests {
		req.Status = "rejected"
		req.ApprovedBy = &rejectedBy
		req.DecisionDate = &now
		req.DecisionReason = reason
		s.changeRequestRepo.Update(&req)
	}

	bulkReq.Status = "rejected"
	bulkReq.RejectedCount = bulkReq.TotalRequests
	return s.bulkRepo.Update(bulkReq)
}

func (s *BulkChangeRequestService) GetBulkRequest(id uuid.UUID) (*models.BulkChangeRequest, error) {
	return s.bulkRepo.FindByID(id)
}

func (s *BulkChangeRequestService) ListBulkRequests(page, limit int) ([]models.BulkChangeRequest, error) {
	offset := (page - 1) * limit
	return s.bulkRepo.FindAll(limit, offset)
}
