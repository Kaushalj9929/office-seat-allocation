package services

import (
	"office-seat-allocation/backend/internal/models"
	"office-seat-allocation/backend/internal/repositories"
	"office-seat-allocation/backend/internal/utils"

	"github.com/google/uuid"
)

type TeamService struct {
	repo *repositories.TeamRepository
}

func NewTeamService(repo *repositories.TeamRepository) *TeamService {
	return &TeamService{
		repo: repo,
	}
}

func (s *TeamService) Create(team *models.Team) error {
	return s.repo.Create(team)
}

func (s *TeamService) GetByID(id uuid.UUID) (*models.Team, error) {
	return s.repo.FindByID(id)
}

func (s *TeamService) GetAll(page, limit int) ([]models.Team, int64, error) {
	return s.repo.FindAll(page, limit)
}

func (s *TeamService) Update(id uuid.UUID, updates map[string]interface{}) error {
	team, err := s.repo.FindByID(id)
	if err != nil {
		return utils.ErrNotFound
	}

	if name, ok := updates["name"].(string); ok {
		team.Name = name
	}
	if desc, ok := updates["description"].(string); ok {
		team.Description = desc
	}
	if leadID, ok := updates["team_lead_id"].(string); ok && leadID != "" {
		lid, _ := uuid.Parse(leadID)
		team.TeamLeadID = &lid
	}

	return s.repo.Update(team)
}

func (s *TeamService) Delete(id uuid.UUID) error {
	return s.repo.Delete(id)
}

func (s *TeamService) GetMembers(teamID uuid.UUID) ([]models.Employee, error) {
	return s.repo.GetMembers(teamID)
}
