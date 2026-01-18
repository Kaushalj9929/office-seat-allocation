package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Team struct {
	ID          uuid.UUID      `gorm:"type:uuid;primaryKey" json:"id"`
	Name        string         `gorm:"not null" json:"name"`
	Description string         `json:"description,omitempty"`
	TeamLeadID  *uuid.UUID     `gorm:"type:uuid" json:"team_lead_id,omitempty"`
	TeamLead    *Employee      `gorm:"foreignKey:TeamLeadID" json:"team_lead,omitempty"`
	Preferences string         `gorm:"type:jsonb;default:'{}'" json:"preferences,omitempty"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

func (t *Team) BeforeCreate(tx *gorm.DB) error {
	if t.ID == uuid.Nil {
		t.ID = uuid.New()
	}
	return nil
}
