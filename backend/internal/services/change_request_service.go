package services

import (
	"errors"
	"office-seat-allocation/backend/internal/models"
	"office-seat-allocation/backend/internal/repositories"
	"time"

	"github.com/google/uuid"
)

type ChangeRequestService struct {
	changeRequestRepo *repositories.ChangeRequestRepository
	scheduleRepo      *repositories.ScheduleRepository
	capacityRepo      *repositories.OfficeCapacityRepository
}

func NewChangeRequestService(changeRequestRepo *repositories.ChangeRequestRepository, scheduleRepo *repositories.ScheduleRepository, capacityRepo *repositories.OfficeCapacityRepository) *ChangeRequestService {
	return &ChangeRequestService{
		changeRequestRepo: changeRequestRepo,
		scheduleRepo:      scheduleRepo,
		capacityRepo:      capacityRepo,
	}
}

func (s *ChangeRequestService) CreateChangeRequest(employeeID uuid.UUID, currentDay, requestedDay int, reason string, requestedDate time.Time) (*models.ChangeRequest, error) {
	// Validate days
	if currentDay < 1 || currentDay > 5 || requestedDay < 1 || requestedDay > 5 {
		return nil, errors.New("invalid day of week (must be 1-5)")
	}

	if currentDay == requestedDay {
		return nil, errors.New("current day and requested day cannot be the same")
	}

	// Create change request
	cr := &models.ChangeRequest{
		EmployeeID:    employeeID,
		CurrentDay:    currentDay,
		RequestedDay:  requestedDay,
		Reason:        reason,
		Status:        "pending",
		RequestedDate: requestedDate,
	}

	if err := s.changeRequestRepo.Create(cr); err != nil {
		return nil, err
	}

	return s.changeRequestRepo.FindByID(cr.ID)
}

func (s *ChangeRequestService) ApproveChangeRequest(id, approverID uuid.UUID, decisionReason string) (*models.ChangeRequest, error) {
	cr, err := s.changeRequestRepo.FindByID(id)
	if err != nil {
		return nil, err
	}

	if cr.Status != "pending" {
		return nil, errors.New("change request already processed")
	}

	// Validate capacity for requested day
	// This is simplified - in production, check specific schedule
	capacity, err := s.capacityRepo.FindByDayOfWeek(cr.RequestedDay, time.Now())
	if err != nil {
		return nil, errors.New("capacity not configured for requested day")
	}

	// Count current allocations (simplified check)
	// In production, check specific schedule and week
	if capacity.TotalSeats <= 0 {
		return nil, errors.New("no capacity available for requested day")
	}

	now := time.Now()
	cr.Status = "approved"
	cr.ApprovedBy = &approverID
	cr.DecisionDate = &now
	cr.DecisionReason = decisionReason
	cr.EffectiveFrom = &cr.RequestedDate

	if err := s.changeRequestRepo.Update(cr); err != nil {
		return nil, err
	}

	return s.changeRequestRepo.FindByID(cr.ID)
}

func (s *ChangeRequestService) RejectChangeRequest(id, approverID uuid.UUID, decisionReason string) (*models.ChangeRequest, error) {
	cr, err := s.changeRequestRepo.FindByID(id)
	if err != nil {
		return nil, err
	}

	if cr.Status != "pending" {
		return nil, errors.New("change request already processed")
	}

	now := time.Now()
	cr.Status = "rejected"
	cr.ApprovedBy = &approverID
	cr.DecisionDate = &now
	cr.DecisionReason = decisionReason

	if err := s.changeRequestRepo.Update(cr); err != nil {
		return nil, err
	}

	return s.changeRequestRepo.FindByID(cr.ID)
}

func (s *ChangeRequestService) GetChangeRequest(id uuid.UUID) (*models.ChangeRequest, error) {
	return s.changeRequestRepo.FindByID(id)
}

func (s *ChangeRequestService) GetAllChangeRequests(page, limit int, status string) ([]models.ChangeRequest, int64, error) {
	return s.changeRequestRepo.FindAll(page, limit, status)
}

func (s *ChangeRequestService) GetEmployeeChangeRequests(employeeID uuid.UUID, page, limit int) ([]models.ChangeRequest, int64, error) {
	return s.changeRequestRepo.FindByEmployeeID(employeeID, page, limit)
}

func (s *ChangeRequestService) DeleteChangeRequest(id uuid.UUID) error {
	cr, err := s.changeRequestRepo.FindByID(id)
	if err != nil {
		return err
	}

	if cr.Status != "pending" {
		return errors.New("cannot delete processed change request")
	}

	return s.changeRequestRepo.Delete(id)
}
