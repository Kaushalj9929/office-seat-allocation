package repositories

import (
	"office-seat-allocation/backend/internal/models"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type FairnessMetricRepository struct {
	db *gorm.DB
}

func NewFairnessMetricRepository(db *gorm.DB) *FairnessMetricRepository {
	return &FairnessMetricRepository{db: db}
}

func (r *FairnessMetricRepository) Create(metric *models.FairnessMetric) error {
	return r.db.Create(metric).Error
}

func (r *FairnessMetricRepository) CreateBatch(metrics []models.FairnessMetric) error {
	return r.db.Create(&metrics).Error
}

func (r *FairnessMetricRepository) FindByScheduleID(scheduleID uuid.UUID) ([]models.FairnessMetric, error) {
	var metrics []models.FairnessMetric
	err := r.db.Preload("Employee").Where("schedule_id = ?", scheduleID).Find(&metrics).Error
	return metrics, err
}

func (r *FairnessMetricRepository) GetHistoricalOfficeDays(employeeID uuid.UUID, weeks int) (int, error) {
	var count int64
	cutoffDate := time.Now().AddDate(0, 0, -weeks*7)
	
	err := r.db.Model(&models.ScheduleEntry{}).
		Joins("JOIN schedules ON schedules.id = schedule_entries.schedule_id").
		Where("schedule_entries.employee_id = ? AND schedule_entries.work_type = ? AND schedules.week_start_date >= ?", 
			employeeID, "office", cutoffDate).
		Count(&count).Error
	
	return int(count), err
}

func (r *FairnessMetricRepository) GetAverageFairnessScore(scheduleID uuid.UUID) (float64, error) {
	var avg float64
	err := r.db.Model(&models.FairnessMetric{}).
		Where("schedule_id = ?", scheduleID).
		Select("AVG(fairness_score)").
		Scan(&avg).Error
	return avg, err
}
