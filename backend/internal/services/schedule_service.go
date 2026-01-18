package services

import (
	"errors"
	"fmt"
	"math/rand"
	"office-seat-allocation/backend/internal/models"
	"office-seat-allocation/backend/internal/repositories"
	"time"

	"github.com/google/uuid"
)

type ScheduleService struct {
	scheduleRepo  *repositories.ScheduleRepository
	employeeRepo  *repositories.EmployeeRepository
	capacityRepo  *repositories.OfficeCapacityRepository
}

func NewScheduleService(scheduleRepo *repositories.ScheduleRepository, employeeRepo *repositories.EmployeeRepository, capacityRepo *repositories.OfficeCapacityRepository) *ScheduleService {
	return &ScheduleService{
		scheduleRepo:  scheduleRepo,
		employeeRepo:  employeeRepo,
		capacityRepo:  capacityRepo,
	}
}

func (s *ScheduleService) GenerateSchedule(weekStartDate, weekEndDate time.Time, createdBy uuid.UUID) (*models.Schedule, error) {
	// Check if schedule already exists
	existing, _ := s.scheduleRepo.FindByWeekRange(weekStartDate.Format("2006-01-02"), weekEndDate.Format("2006-01-02"))
	if existing != nil && existing.ID != uuid.Nil {
		return nil, errors.New("schedule already exists for this week")
	}

	// Get all active employees
	employees, _, err := s.employeeRepo.FindAll(1, 1000, nil, "active")
	if err != nil {
		return nil, err
	}

	activeEmployees := []models.Employee{}
	for _, emp := range employees {
		if emp.Status == "active" {
			activeEmployees = append(activeEmployees, emp)
		}
	}

	if len(activeEmployees) == 0 {
		return nil, errors.New("no active employees found")
	}

	// Create schedule
	schedule := &models.Schedule{
		WeekStartDate: weekStartDate,
		WeekEndDate:   weekEndDate,
		Status:        "draft",
		CreatedBy:     createdBy,
		Version:       1,
	}

	if err := s.scheduleRepo.Create(schedule); err != nil {
		return nil, err
	}

	// Generate entries (3 office days, 2 WFH days per employee)
	entries := []models.ScheduleEntry{}
	for _, emp := range activeEmployees {
		officeDays := s.selectOfficeDays()
		for day := 1; day <= 5; day++ {
			workType := "wfh"
			if contains(officeDays, day) {
				workType = "office"
			}

			entry := models.ScheduleEntry{
				ScheduleID: schedule.ID,
				EmployeeID: emp.ID,
				DayOfWeek:  day,
				WorkType:   workType,
				Status:     "assigned",
			}
			entries = append(entries, entry)
		}
	}

	// Validate capacity
	if err := s.validateCapacity(schedule.ID, entries, weekStartDate); err != nil {
		s.scheduleRepo.Delete(schedule.ID)
		return nil, err
	}

	// Save entries
	if err := s.scheduleRepo.CreateEntries(entries); err != nil {
		s.scheduleRepo.Delete(schedule.ID)
		return nil, err
	}

	return s.scheduleRepo.FindByID(schedule.ID)
}

func (s *ScheduleService) selectOfficeDays() []int {
	days := []int{1, 2, 3, 4, 5}
	rand.Shuffle(len(days), func(i, j int) {
		days[i], days[j] = days[j], days[i]
	})
	return days[:3]
}

func (s *ScheduleService) validateCapacity(scheduleID uuid.UUID, entries []models.ScheduleEntry, weekStart time.Time) error {
	for day := 1; day <= 5; day++ {
		count := 0
		for _, entry := range entries {
			if entry.DayOfWeek == day && entry.WorkType == "office" {
				count++
			}
		}

		capacity, err := s.capacityRepo.FindByDayOfWeek(day, weekStart)
		if err != nil {
			return fmt.Errorf("capacity not configured for day %d", day)
		}

		if count > capacity.TotalSeats {
			return fmt.Errorf("capacity exceeded for day %d: %d employees, %d seats", day, count, capacity.TotalSeats)
		}
	}
	return nil
}

func (s *ScheduleService) PublishSchedule(id uuid.UUID) error {
	schedule, err := s.scheduleRepo.FindByID(id)
	if err != nil {
		return err
	}

	if schedule.Status == "published" {
		return errors.New("schedule already published")
	}

	now := time.Now()
	schedule.Status = "published"
	schedule.PublishedAt = &now

	return s.scheduleRepo.Update(schedule)
}

func (s *ScheduleService) GetSchedule(id uuid.UUID) (*models.Schedule, error) {
	return s.scheduleRepo.FindByID(id)
}

func (s *ScheduleService) GetAllSchedules(page, limit int) ([]models.Schedule, int64, error) {
	return s.scheduleRepo.FindAll(page, limit)
}

func (s *ScheduleService) DeleteSchedule(id uuid.UUID) error {
	schedule, err := s.scheduleRepo.FindByID(id)
	if err != nil {
		return err
	}

	if schedule.Status == "published" {
		return errors.New("cannot delete published schedule")
	}

	return s.scheduleRepo.Delete(id)
}

func contains(slice []int, val int) bool {
	for _, item := range slice {
		if item == val {
			return true
		}
	}
	return false
}
