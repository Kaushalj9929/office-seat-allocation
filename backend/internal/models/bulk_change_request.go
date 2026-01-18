package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type BulkChangeRequest struct {
	ID             uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	CreatedBy      uuid.UUID `gorm:"type:uuid;not null" json:"created_by"`
	Status         string    `gorm:"type:varchar(50);not null;default:'pending'" json:"status"`
	TotalRequests  int       `gorm:"not null" json:"total_requests"`
	ApprovedCount  int       `gorm:"default:0" json:"approved_count"`
	RejectedCount  int       `gorm:"default:0" json:"rejected_count"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
	
	CreatedByUser  *Employee        `gorm:"foreignKey:CreatedBy" json:"created_by_user,omitempty"`
	Requests       []ChangeRequest  `gorm:"foreignKey:BulkRequestID" json:"requests,omitempty"`
}

func (b *BulkChangeRequest) BeforeCreate(tx *gorm.DB) error {
	if b.ID == uuid.Nil {
		b.ID = uuid.New()
	}
	return nil
}
