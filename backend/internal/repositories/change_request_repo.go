package repositories

import (
	"office-seat-allocation/backend/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ChangeRequestRepository struct {
	db *gorm.DB
}

func NewChangeRequestRepository(db *gorm.DB) *ChangeRequestRepository {
	return &ChangeRequestRepository{db: db}
}

func (r *ChangeRequestRepository) Create(cr *models.ChangeRequest) error {
	return r.db.Create(cr).Error
}

func (r *ChangeRequestRepository) FindByID(id uuid.UUID) (*models.ChangeRequest, error) {
	var cr models.ChangeRequest
	err := r.db.Preload("Employee").Preload("Approver").First(&cr, "id = ?", id).Error
	return &cr, err
}

func (r *ChangeRequestRepository) FindAll(page, limit int, status string) ([]models.ChangeRequest, int64, error) {
	var requests []models.ChangeRequest
	var total int64

	query := r.db.Model(&models.ChangeRequest{})
	if status != "" {
		query = query.Where("status = ?", status)
	}

	offset := (page - 1) * limit
	err := query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	err = query.Preload("Employee").Preload("Approver").Order("created_at DESC").Offset(offset).Limit(limit).Find(&requests).Error
	return requests, total, err
}

func (r *ChangeRequestRepository) FindByEmployeeID(employeeID uuid.UUID, page, limit int) ([]models.ChangeRequest, int64, error) {
	var requests []models.ChangeRequest
	var total int64

	offset := (page - 1) * limit
	err := r.db.Model(&models.ChangeRequest{}).Where("employee_id = ?", employeeID).Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	err = r.db.Preload("Employee").Preload("Approver").Where("employee_id = ?", employeeID).Order("created_at DESC").Offset(offset).Limit(limit).Find(&requests).Error
	return requests, total, err
}

func (r *ChangeRequestRepository) Update(cr *models.ChangeRequest) error {
	return r.db.Save(cr).Error
}

func (r *ChangeRequestRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&models.ChangeRequest{}, "id = ?", id).Error
}
