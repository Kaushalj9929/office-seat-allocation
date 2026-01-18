package services

import (
	"fmt"
	"math"
	"math/rand"
	"office-seat-allocation/backend/internal/models"
	"office-seat-allocation/backend/internal/repositories"
	"sort"
	"time"

	"github.com/google/uuid"
)

type FairnessService struct {
	fairnessRepo *repositories.FairnessMetricRepository
	scheduleRepo *repositories.ScheduleRepository
	employeeRepo *repositories.EmployeeRepository
	teamRepo     *repositories.TeamRepository
}

func NewFairnessService(fairnessRepo *repositories.FairnessMetricRepository, scheduleRepo *repositories.ScheduleRepository, employeeRepo *repositories.EmployeeRepository, teamRepo *repositories.TeamRepository) *FairnessService {
	return &FairnessService{
		fairnessRepo: fairnessRepo,
		scheduleRepo: scheduleRepo,
		employeeRepo: employeeRepo,
		teamRepo:     teamRepo,
	}
}

type EmployeeScore struct {
	Employee             models.Employee
	HistoricalOfficeDays int
	FairnessScore        float64
	TeamPreferredDays    []int
}

func (fs *FairnessService) GenerateAdvancedSchedule(weekStartDate, weekEndDate time.Time, createdBy uuid.UUID) (*models.Schedule, error) {
	// Get all active employees
	employees, _, err := fs.employeeRepo.FindAll(1, 1000, nil, "active")
	if err != nil {
		return nil, err
	}

	if len(employees) == 0 {
		return nil, fmt.Errorf("no active employees found")
	}

	// Calculate fairness scores
	employeeScores := make([]EmployeeScore, 0)
	for _, emp := range employees {
		historical, _ := fs.fairnessRepo.GetHistoricalOfficeDays(emp.ID, 12)
		
		// Get team preferences
		teamPrefs := fs.getTeamPreferences(emp.TeamID)
		
		employeeScores = append(employeeScores, EmployeeScore{
			Employee:             emp,
			HistoricalOfficeDays: historical,
			FairnessScore:        float64(historical),
			TeamPreferredDays:    teamPrefs,
		})
	}

	// Sort by fairness score (lower historical days = higher priority)
	sort.Slice(employeeScores, func(i, j int) bool {
		return employeeScores[i].FairnessScore < employeeScores[j].FairnessScore
	})

	// Create schedule
	schedule := &models.Schedule{
		WeekStartDate: weekStartDate,
		WeekEndDate:   weekEndDate,
		Status:        "draft",
		CreatedBy:     createdBy,
		Version:       1,
	}

	if err := fs.scheduleRepo.Create(schedule); err != nil {
		return nil, err
	}

	// Generate entries with fairness
	entries, fairnessMetrics := fs.generateFairEntries(schedule.ID, employeeScores)

	// Save entries
	if err := fs.scheduleRepo.CreateEntries(entries); err != nil {
		fs.scheduleRepo.Delete(schedule.ID)
		return nil, err
	}

	// Save fairness metrics
	if err := fs.fairnessRepo.CreateBatch(fairnessMetrics); err != nil {
		// Non-critical, just log
		fmt.Printf("Warning: Failed to save fairness metrics: %v\n", err)
	}

	return fs.scheduleRepo.FindByID(schedule.ID)
}

func (fs *FairnessService) generateFairEntries(scheduleID uuid.UUID, employeeScores []EmployeeScore) ([]models.ScheduleEntry, []models.FairnessMetric) {
	entries := make([]models.ScheduleEntry, 0)
	metrics := make([]models.FairnessMetric, 0)
	dayCapacity := make(map[int]int)

	for _, empScore := range employeeScores {
		officeDays := fs.selectOfficeDaysWithPreference(empScore.TeamPreferredDays, dayCapacity)
		assignedOffice := 0

		for day := 1; day <= 5; day++ {
			workType := "wfh"
			if contains(officeDays, day) {
				workType = "office"
				dayCapacity[day]++
				assignedOffice++
			}

			entries = append(entries, models.ScheduleEntry{
				ScheduleID: scheduleID,
				EmployeeID: empScore.Employee.ID,
				DayOfWeek:  day,
				WorkType:   workType,
				Status:     "assigned",
			})
		}

		// Calculate fairness metric
		variance := float64(assignedOffice - empScore.HistoricalOfficeDays)
		fairnessScore := 100.0 - math.Abs(variance)*10 // Scale variance

		metrics = append(metrics, models.FairnessMetric{
			ScheduleID:           scheduleID,
			EmployeeID:           empScore.Employee.ID,
			FairnessScore:        math.Max(0, fairnessScore),
			HistoricalOfficeDays: empScore.HistoricalOfficeDays,
			AssignedOfficeDays:   assignedOffice,
			Variance:             variance,
		})
	}

	return entries, metrics
}

func (fs *FairnessService) selectOfficeDaysWithPreference(preferredDays []int, dayCapacity map[int]int) []int {
	selected := make([]int, 0, 3)
	allDays := []int{1, 2, 3, 4, 5}

	// First, try to assign preferred days
	for _, day := range preferredDays {
		if len(selected) >= 3 {
			break
		}
		if dayCapacity[day] < 40 { // Capacity check
			selected = append(selected, day)
		}
	}

	// Fill remaining with random days
	rand.Shuffle(len(allDays), func(i, j int) {
		allDays[i], allDays[j] = allDays[j], allDays[i]
	})

	for _, day := range allDays {
		if len(selected) >= 3 {
			break
		}
		if !contains(selected, day) && dayCapacity[day] < 40 {
			selected = append(selected, day)
		}
	}

	return selected
}

func (fs *FairnessService) getTeamPreferences(teamID *uuid.UUID) []int {
	if teamID == nil {
		return []int{}
	}

	team, err := fs.teamRepo.FindByID(*teamID)
	if err != nil {
		return []int{}
	}

	// Parse preferences from team.Preferences JSON
	// For now, return default preferences
	// In production, parse from team.Preferences field
	
	// Example: Engineering team prefers Mon, Wed, Fri
	if team.Name == "Engineering" {
		return []int{1, 3, 5}
	}
	// Product team prefers Tue, Thu
	if team.Name == "Product" {
		return []int{2, 4}
	}

	return []int{}
}

func (fs *FairnessService) GetFairnessMetrics(scheduleID uuid.UUID) ([]models.FairnessMetric, error) {
	return fs.fairnessRepo.FindByScheduleID(scheduleID)
}

func (fs *FairnessService) GetFairnessReport(scheduleID uuid.UUID) (map[string]interface{}, error) {
	metrics, err := fs.fairnessRepo.FindByScheduleID(scheduleID)
	if err != nil {
		return nil, err
	}

	if len(metrics) == 0 {
		return map[string]interface{}{
			"message": "No fairness metrics available",
		}, nil
	}

	// Calculate statistics
	var totalScore, minScore, maxScore float64
	minScore = 100.0
	maxScore = 0.0

	for _, m := range metrics {
		totalScore += m.FairnessScore
		if m.FairnessScore < minScore {
			minScore = m.FairnessScore
		}
		if m.FairnessScore > maxScore {
			maxScore = m.FairnessScore
		}
	}

	avgScore := totalScore / float64(len(metrics))

	return map[string]interface{}{
		"schedule_id":          scheduleID,
		"total_employees":      len(metrics),
		"average_fairness":     avgScore,
		"min_fairness":         minScore,
		"max_fairness":         maxScore,
		"metrics":              metrics,
	}, nil
}
