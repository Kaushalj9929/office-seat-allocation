package services

import (
	"encoding/json"
	"office-seat-allocation/backend/internal/models"
	"office-seat-allocation/backend/internal/repositories"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type CapacityManager struct {
	scheduleRepo  *repositories.ScheduleRepository
	capacityRepo  *repositories.OfficeCapacityRepository
	db            *gorm.DB
}

func NewCapacityManager(scheduleRepo *repositories.ScheduleRepository, capacityRepo *repositories.OfficeCapacityRepository, db *gorm.DB) *CapacityManager {
	return &CapacityManager{
		scheduleRepo:  scheduleRepo,
		capacityRepo:  capacityRepo,
		db:            db,
	}
}

func (cm *CapacityManager) DetectConflict(req *models.ChangeRequest, scheduleID uuid.UUID) (*models.CapacityConflict, error) {
	available, err := cm.GetAvailableSeats(scheduleID, req.RequestedDay)
	if err != nil {
		return nil, err
	}

	if available <= 0 {
		suggestions := cm.suggestAlternativeDays(req.EmployeeID, scheduleID)
		suggestionsJSON, _ := json.Marshal(suggestions)
		return &models.CapacityConflict{
			RequestID:      req.ID,
			EmployeeID:     req.EmployeeID,
			RequestedDay:   req.RequestedDay,
			AvailableSeats: available,
			ConflictType:   "capacity_exceeded",
			Suggestions:    suggestionsJSON,
		}, nil
	}

	if !cm.validateHybridConstraint(req.EmployeeID, scheduleID, req.CurrentDay, req.RequestedDay) {
		suggestions := cm.suggestAlternativeDays(req.EmployeeID, scheduleID)
		suggestionsJSON, _ := json.Marshal(suggestions)
		return &models.CapacityConflict{
			RequestID:      req.ID,
			EmployeeID:     req.EmployeeID,
			RequestedDay:   req.RequestedDay,
			ConflictType:   "hybrid_constraint_violated",
			Suggestions:    suggestionsJSON,
		}, nil
	}

	return nil, nil
}

func (cm *CapacityManager) GetAvailableSeats(scheduleID uuid.UUID, day int) (int, error) {
	capacity, err := cm.capacityRepo.FindByDayOfWeek(day, time.Now())
	if err != nil {
		return 0, err
	}

	var occupied int64
	cm.db.Model(&models.ScheduleEntry{}).
		Where("schedule_id = ? AND day_of_week = ? AND work_type = ?", scheduleID, day, "office").
		Count(&occupied)

	return capacity.TotalSeats - int(occupied), nil
}

func (cm *CapacityManager) validateHybridConstraint(empID, scheduleID uuid.UUID, currentDay, requestedDay int) bool {
	var entries []models.ScheduleEntry
	cm.db.Where("schedule_id = ? AND employee_id = ?", scheduleID, empID).Find(&entries)

	officeCount := 0
	for _, entry := range entries {
		if entry.DayOfWeek == currentDay {
			continue
		}
		if entry.DayOfWeek == requestedDay {
			continue
		}
		if entry.WorkType == "office" {
			officeCount++
		}
	}

	return officeCount < 3
}

func (cm *CapacityManager) suggestAlternativeDays(empID, scheduleID uuid.UUID) []int {
	suggestions := []int{}
	for day := 1; day <= 5; day++ {
		available, _ := cm.GetAvailableSeats(scheduleID, day)
		if available > 0 {
			suggestions = append(suggestions, day)
		}
	}
	return suggestions
}
