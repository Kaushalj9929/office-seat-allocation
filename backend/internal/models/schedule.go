package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Schedule struct {
	ID            uuid.UUID        `gorm:"type:uuid;primaryKey" json:"id"`
	WeekStartDate time.Time        `gorm:"not null" json:"week_start_date"`
	WeekEndDate   time.Time        `gorm:"not null" json:"week_end_date"`
	Status        string           `gorm:"not null;default:'draft'" json:"status"`
	CreatedBy     uuid.UUID        `gorm:"type:uuid;not null" json:"created_by"`
	CreatedByUser *Employee        `gorm:"foreignKey:CreatedBy" json:"created_by_user,omitempty"`
	Entries       []ScheduleEntry  `gorm:"foreignKey:ScheduleID" json:"entries,omitempty"`
	CreatedAt     time.Time        `json:"created_at"`
	PublishedAt   *time.Time       `json:"published_at,omitempty"`
	Version       int              `gorm:"default:1" json:"version"`
}

func (s *Schedule) BeforeCreate(tx *gorm.DB) error {
	if s.ID == uuid.Nil {
		s.ID = uuid.New()
	}
	return nil
}

type ScheduleEntry struct {
	ID         uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	ScheduleID uuid.UUID `gorm:"type:uuid;not null" json:"schedule_id"`
	EmployeeID uuid.UUID `gorm:"type:uuid;not null" json:"employee_id"`
	Employee   *Employee `gorm:"foreignKey:EmployeeID" json:"employee,omitempty"`
	DayOfWeek  int       `gorm:"not null" json:"day_of_week"`
	WorkType   string    `gorm:"not null" json:"work_type"`
	SeatID     *uuid.UUID `gorm:"type:uuid" json:"seat_id,omitempty"`
	Status     string    `gorm:"not null;default:'assigned'" json:"status"`
	CreatedAt  time.Time `json:"created_at"`
}

func (se *ScheduleEntry) BeforeCreate(tx *gorm.DB) error {
	if se.ID == uuid.Nil {
		se.ID = uuid.New()
	}
	return nil
}
