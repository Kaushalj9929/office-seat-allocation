package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type OfficeCapacity struct {
	ID            uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	DayOfWeek     int       `gorm:"not null" json:"day_of_week"`
	TotalSeats    int       `gorm:"not null" json:"total_seats"`
	ReservedSeats int       `gorm:"default:0" json:"reserved_seats"`
	EffectiveFrom time.Time `gorm:"not null" json:"effective_from"`
	CreatedAt     time.Time `json:"created_at"`
}

func (oc *OfficeCapacity) BeforeCreate(tx *gorm.DB) error {
	if oc.ID == uuid.Nil {
		oc.ID = uuid.New()
	}
	return nil
}
