package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type FairnessMetric struct {
	ID                   uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	ScheduleID           uuid.UUID `gorm:"type:uuid;not null" json:"schedule_id"`
	EmployeeID           uuid.UUID `gorm:"type:uuid;not null" json:"employee_id"`
	Employee             *Employee `gorm:"foreignKey:EmployeeID" json:"employee,omitempty"`
	FairnessScore        float64   `json:"fairness_score"`
	HistoricalOfficeDays int       `json:"historical_office_days"`
	AssignedOfficeDays   int       `json:"assigned_office_days"`
	Variance             float64   `json:"variance"`
	CreatedAt            time.Time `json:"created_at"`
}

func (fm *FairnessMetric) BeforeCreate(tx *gorm.DB) error {
	if fm.ID == uuid.Nil {
		fm.ID = uuid.New()
	}
	return nil
}
