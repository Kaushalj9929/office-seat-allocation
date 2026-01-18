package handlers

import (
	"net/http"
	"office-seat-allocation/backend/internal/services"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type ConflictHandler struct {
	capacityManager *services.CapacityManager
}

func NewConflictHandler(capacityManager *services.CapacityManager) *ConflictHandler {
	return &ConflictHandler{capacityManager: capacityManager}
}

func (h *ConflictHandler) GetConflicts(c *gin.Context) {
	scheduleID, err := uuid.Parse(c.Query("schedule_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid schedule_id"})
		return
	}

	conflicts := []gin.H{}
	
	for day := 1; day <= 5; day++ {
		available, _ := h.capacityManager.GetAvailableSeats(scheduleID, day)
		if available < 0 {
			conflicts = append(conflicts, gin.H{
				"day":             day,
				"available_seats": available,
				"conflict_type":   "capacity_exceeded",
			})
		}
	}

	c.JSON(http.StatusOK, gin.H{"conflicts": conflicts, "total": len(conflicts)})
}
