package services

import (
	"office-seat-allocation/backend/internal/models"
	"office-seat-allocation/backend/internal/repositories"
	"office-seat-allocation/backend/internal/utils"

	"github.com/google/uuid"
)

type EmployeeService struct {
	repo *repositories.EmployeeRepository
}

func NewEmployeeService(repo *repositories.EmployeeRepository) *EmployeeService {
	return &EmployeeService{
		repo: repo,
	}
}

func (s *EmployeeService) Create(employee *models.Employee, password string) error {
	hash, err := utils.HashPassword(password)
	if err != nil {
		return err
	}
	employee.PasswordHash = hash
	return s.repo.Create(employee)
}

func (s *EmployeeService) GetByID(id uuid.UUID) (*models.Employee, error) {
	return s.repo.FindByID(id)
}

func (s *EmployeeService) GetAll(page, limit int, teamID *uuid.UUID, status string) ([]models.Employee, int64, error) {
	return s.repo.FindAll(page, limit, teamID, status)
}

func (s *EmployeeService) Update(id uuid.UUID, updates map[string]interface{}) error {
	employee, err := s.repo.FindByID(id)
	if err != nil {
		return utils.ErrNotFound
	}

	if name, ok := updates["name"].(string); ok {
		employee.Name = name
	}
	if teamID, ok := updates["team_id"].(string); ok && teamID != "" {
		tid, _ := uuid.Parse(teamID)
		employee.TeamID = &tid
	}
	if status, ok := updates["status"].(string); ok {
		employee.Status = status
	}
	if role, ok := updates["role"].(string); ok {
		employee.Role = role
	}

	return s.repo.Update(employee)
}

func (s *EmployeeService) Delete(id uuid.UUID) error {
	return s.repo.Delete(id)
}
