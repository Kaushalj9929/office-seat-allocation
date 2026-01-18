package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Employee struct {
	ID           uuid.UUID      `gorm:"type:uuid;primaryKey" json:"id"`
	Email        string         `gorm:"uniqueIndex;not null" json:"email"`
	Name         string         `gorm:"not null" json:"name"`
	PasswordHash string         `gorm:"not null" json:"-"`
	TeamID       *uuid.UUID     `gorm:"type:uuid" json:"team_id,omitempty"`
	Team         *Team          `gorm:"foreignKey:TeamID;constraint:OnDelete:SET NULL" json:"team,omitempty"`
	Role         string         `gorm:"not null;default:'employee'" json:"role"`
	Status       string         `gorm:"not null;default:'active'" json:"status"`
	Preferences  string         `gorm:"type:jsonb;default:'{}'" json:"preferences,omitempty"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`
}

func (e *Employee) BeforeCreate(tx *gorm.DB) error {
	if e.ID == uuid.Nil {
		e.ID = uuid.New()
	}
	return nil
}
