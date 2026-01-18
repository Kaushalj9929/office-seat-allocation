package services

import (
	"office-seat-allocation/backend/internal/config"
	"office-seat-allocation/backend/internal/models"
	"office-seat-allocation/backend/internal/repositories"
	"office-seat-allocation/backend/internal/utils"

	"github.com/google/uuid"
)

type AuthService struct {
	employeeRepo *repositories.EmployeeRepository
}

func NewAuthService(employeeRepo *repositories.EmployeeRepository) *AuthService {
	return &AuthService{
		employeeRepo: employeeRepo,
	}
}

func (s *AuthService) Login(email, password string) (string, string, *models.Employee, error) {
	employee, err := s.employeeRepo.FindByEmail(email)
	if err != nil {
		return "", "", nil, utils.ErrUnauthorized
	}

	if !utils.CheckPassword(password, employee.PasswordHash) {
		return "", "", nil, utils.ErrUnauthorized
	}

	if employee.Status != utils.StatusActive {
		return "", "", nil, utils.ErrForbidden
	}

	accessToken, err := utils.GenerateToken(employee.ID, employee.Email, employee.Role, config.AppConfig.JWTSecret, config.AppConfig.JWTExpiry)
	if err != nil {
		return "", "", nil, err
	}

	refreshToken, err := utils.GenerateToken(employee.ID, employee.Email, employee.Role, config.AppConfig.JWTSecret, config.AppConfig.RefreshTokenExpiry)
	if err != nil {
		return "", "", nil, err
	}

	return accessToken, refreshToken, employee, nil
}

func (s *AuthService) RefreshToken(userID uuid.UUID, email, role string) (string, error) {
	return utils.GenerateToken(userID, email, role, config.AppConfig.JWTSecret, config.AppConfig.JWTExpiry)
}
