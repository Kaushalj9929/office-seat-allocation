package models

import (
	"github.com/google/uuid"
)

type CapacityConflict struct {
	RequestID      uuid.UUID `json:"request_id"`
	EmployeeID     uuid.UUID `json:"employee_id"`
	RequestedDay   int       `json:"requested_day"`
	AvailableSeats int       `json:"available_seats"`
	ConflictType   string    `json:"conflict_type"` // 'capacity_exceeded', 'hybrid_constraint_violated'
	Suggestions    []byte    `json:"suggestions"`   // Alternative days as JSON
}
