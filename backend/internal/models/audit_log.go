package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type AuditLog struct {
	ID          uuid.UUID  `gorm:"type:uuid;primaryKey" json:"id"`
	EntityType  string     `gorm:"not null" json:"entity_type"`
	EntityID    uuid.UUID  `gorm:"type:uuid;not null" json:"entity_id"`
	Action      string     `gorm:"not null" json:"action"`
	ChangedBy   *uuid.UUID `gorm:"type:uuid" json:"changed_by,omitempty"`
	ChangedUser *Employee  `gorm:"foreignKey:ChangedBy" json:"changed_user,omitempty"`
	ChangedDate time.Time  `gorm:"not null" json:"changed_date"`
	OldValue    string     `gorm:"type:jsonb" json:"old_value,omitempty"`
	NewValue    string     `gorm:"type:jsonb" json:"new_value,omitempty"`
	Reason      string     `json:"reason,omitempty"`
}

func (al *AuditLog) BeforeCreate(tx *gorm.DB) error {
	if al.ID == uuid.Nil {
		al.ID = uuid.New()
	}
	return nil
}
