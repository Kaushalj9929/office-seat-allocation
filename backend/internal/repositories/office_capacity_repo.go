package repositories

import (
	"office-seat-allocation/backend/internal/models"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type OfficeCapacityRepository struct {
	db *gorm.DB
}

func NewOfficeCapacityRepository(db *gorm.DB) *OfficeCapacityRepository {
	return &OfficeCapacityRepository{db: db}
}

func (r *OfficeCapacityRepository) Create(capacity *models.OfficeCapacity) error {
	return r.db.Create(capacity).Error
}

func (r *OfficeCapacityRepository) FindByID(id uuid.UUID) (*models.OfficeCapacity, error) {
	var capacity models.OfficeCapacity
	err := r.db.First(&capacity, "id = ?", id).Error
	return &capacity, err
}

func (r *OfficeCapacityRepository) FindByDayOfWeek(dayOfWeek int, effectiveDate time.Time) (*models.OfficeCapacity, error) {
	var capacity models.OfficeCapacity
	err := r.db.Where("day_of_week = ? AND effective_from <= ?", dayOfWeek, effectiveDate).
		Order("effective_from DESC").
		First(&capacity).Error
	return &capacity, err
}

func (r *OfficeCapacityRepository) FindAll() ([]models.OfficeCapacity, error) {
	var capacities []models.OfficeCapacity
	err := r.db.Order("day_of_week ASC").Find(&capacities).Error
	return capacities, err
}

func (r *OfficeCapacityRepository) Update(capacity *models.OfficeCapacity) error {
	return r.db.Save(capacity).Error
}

func (r *OfficeCapacityRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&models.OfficeCapacity{}, "id = ?", id).Error
}
