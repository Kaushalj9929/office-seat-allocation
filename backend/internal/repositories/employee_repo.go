package repositories

import (
	"office-seat-allocation/backend/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type EmployeeRepository struct{
	db *gorm.DB
}

func NewEmployeeRepository(db *gorm.DB) *EmployeeRepository {
	return &EmployeeRepository{db: db}
}

func (r *EmployeeRepository) Create(employee *models.Employee) error {
	return r.db.Create(employee).Error
}

func (r *EmployeeRepository) FindByID(id uuid.UUID) (*models.Employee, error) {
	var employee models.Employee
	err := r.db.Preload("Team").First(&employee, "id = ?", id).Error
	return &employee, err
}

func (r *EmployeeRepository) FindByEmail(email string) (*models.Employee, error) {
	var employee models.Employee
	err := r.db.First(&employee, "email = ?", email).Error
	return &employee, err
}

func (r *EmployeeRepository) FindAll(page, limit int, teamID *uuid.UUID, status string) ([]models.Employee, int64, error) {
	var employees []models.Employee
	var total int64

	query := r.db.Model(&models.Employee{}).Preload("Team")

	if teamID != nil {
		query = query.Where("team_id = ?", teamID)
	}
	if status != "" {
		query = query.Where("status = ?", status)
	}

	query.Count(&total)

	offset := (page - 1) * limit
	err := query.Offset(offset).Limit(limit).Find(&employees).Error

	return employees, total, err
}

func (r *EmployeeRepository) Update(employee *models.Employee) error {
	return r.db.Save(employee).Error
}

func (r *EmployeeRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&models.Employee{}, "id = ?", id).Error
}
