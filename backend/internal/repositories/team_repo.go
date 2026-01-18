package repositories

import (
	"office-seat-allocation/backend/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type TeamRepository struct{
	db *gorm.DB
}

func NewTeamRepository(db *gorm.DB) *TeamRepository {
	return &TeamRepository{db: db}
}

func (r *TeamRepository) Create(team *models.Team) error {
	return r.db.Create(team).Error
}

func (r *TeamRepository) FindByID(id uuid.UUID) (*models.Team, error) {
	var team models.Team
	err := r.db.Preload("TeamLead").First(&team, "id = ?", id).Error
	return &team, err
}

func (r *TeamRepository) FindAll(page, limit int) ([]models.Team, int64, error) {
	var teams []models.Team
	var total int64

	r.db.Model(&models.Team{}).Count(&total)

	offset := (page - 1) * limit
	err := r.db.Preload("TeamLead").Offset(offset).Limit(limit).Find(&teams).Error

	return teams, total, err
}

func (r *TeamRepository) Update(team *models.Team) error {
	return r.db.Save(team).Error
}

func (r *TeamRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&models.Team{}, "id = ?", id).Error
}

func (r *TeamRepository) GetMembers(teamID uuid.UUID) ([]models.Employee, error) {
	var employees []models.Employee
	err := r.db.Where("team_id = ?", teamID).Find(&employees).Error
	return employees, err
}
