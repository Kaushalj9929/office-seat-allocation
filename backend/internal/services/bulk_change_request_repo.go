package services

import (
	"office-seat-allocation/backend/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type BulkChangeRequestRepository struct {
	db *gorm.DB
}

func NewBulkChangeRequestRepository(db *gorm.DB) *BulkChangeRequestRepository {
	return &BulkChangeRequestRepository{db: db}
}

func (r *BulkChangeRequestRepository) Create(bulk *models.BulkChangeRequest) error {
	return r.db.Create(bulk).Error
}

func (r *BulkChangeRequestRepository) FindByID(id uuid.UUID) (*models.BulkChangeRequest, error) {
	var bulk models.BulkChangeRequest
	err := r.db.Preload("Requests").Preload("Requests.Employee").Preload("CreatedByUser").First(&bulk, "id = ?", id).Error
	return &bulk, err
}

func (r *BulkChangeRequestRepository) FindAll(limit, offset int) ([]models.BulkChangeRequest, error) {
	var bulks []models.BulkChangeRequest
	err := r.db.Preload("CreatedByUser").Order("created_at DESC").Limit(limit).Offset(offset).Find(&bulks).Error
	return bulks, err
}

func (r *BulkChangeRequestRepository) Update(bulk *models.BulkChangeRequest) error {
	return r.db.Save(bulk).Error
}
