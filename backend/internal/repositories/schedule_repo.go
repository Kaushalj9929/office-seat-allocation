package repositories

import (
	"office-seat-allocation/backend/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ScheduleRepository struct {
	db *gorm.DB
}

func NewScheduleRepository(db *gorm.DB) *ScheduleRepository {
	return &ScheduleRepository{db: db}
}

func (r *ScheduleRepository) Create(schedule *models.Schedule) error {
	return r.db.Create(schedule).Error
}

func (r *ScheduleRepository) FindByID(id uuid.UUID) (*models.Schedule, error) {
	var schedule models.Schedule
	err := r.db.Preload("Entries.Employee").Preload("CreatedByUser").First(&schedule, "id = ?", id).Error
	return &schedule, err
}

func (r *ScheduleRepository) FindAll(page, limit int) ([]models.Schedule, int64, error) {
	var schedules []models.Schedule
	var total int64

	offset := (page - 1) * limit
	err := r.db.Model(&models.Schedule{}).Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	err = r.db.Preload("CreatedByUser").Order("week_start_date DESC").Offset(offset).Limit(limit).Find(&schedules).Error
	return schedules, total, err
}

func (r *ScheduleRepository) Update(schedule *models.Schedule) error {
	return r.db.Save(schedule).Error
}

func (r *ScheduleRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&models.Schedule{}, "id = ?", id).Error
}

func (r *ScheduleRepository) CreateEntry(entry *models.ScheduleEntry) error {
	return r.db.Create(entry).Error
}

func (r *ScheduleRepository) CreateEntries(entries []models.ScheduleEntry) error {
	return r.db.Create(&entries).Error
}

func (r *ScheduleRepository) FindEntriesByScheduleID(scheduleID uuid.UUID) ([]models.ScheduleEntry, error) {
	var entries []models.ScheduleEntry
	err := r.db.Preload("Employee").Where("schedule_id = ?", scheduleID).Find(&entries).Error
	return entries, err
}

func (r *ScheduleRepository) CountEntriesByDayAndWorkType(scheduleID uuid.UUID, day int, workType string) (int64, error) {
	var count int64
	err := r.db.Model(&models.ScheduleEntry{}).Where("schedule_id = ? AND day_of_week = ? AND work_type = ?", scheduleID, day, workType).Count(&count).Error
	return count, err
}

func (r *ScheduleRepository) FindByWeekRange(startDate, endDate string) (*models.Schedule, error) {
	var schedule models.Schedule
	err := r.db.Where("week_start_date = ? AND week_end_date = ?", startDate, endDate).First(&schedule).Error
	return &schedule, err
}
