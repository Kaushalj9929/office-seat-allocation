package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ChangeRequest struct {
	ID             uuid.UUID  `gorm:"type:uuid;primaryKey" json:"id"`
	EmployeeID     uuid.UUID  `gorm:"type:uuid;not null" json:"employee_id"`
	Employee       *Employee  `gorm:"foreignKey:EmployeeID" json:"employee,omitempty"`
	CurrentDay     int        `gorm:"not null" json:"current_day"`
	RequestedDay   int        `gorm:"not null" json:"requested_day"`
	Reason         string     `json:"reason,omitempty"`
	Status         string     `gorm:"not null;default:'pending'" json:"status"`
	RequestedDate  time.Time  `gorm:"not null" json:"requested_date"`
	ApprovedBy     *uuid.UUID `gorm:"type:uuid" json:"approved_by,omitempty"`
	Approver       *Employee  `gorm:"foreignKey:ApprovedBy" json:"approver,omitempty"`
	DecisionDate   *time.Time `json:"decision_date,omitempty"`
	DecisionReason string     `json:"decision_reason,omitempty"`
	EffectiveFrom  *time.Time `json:"effective_from,omitempty"`
	CreatedAt      time.Time  `json:"created_at"`
}

func (cr *ChangeRequest) BeforeCreate(tx *gorm.DB) error {
	if cr.ID == uuid.Nil {
		cr.ID = uuid.New()
	}
	return nil
}
