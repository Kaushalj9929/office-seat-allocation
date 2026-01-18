package handlers

import (
	"net/http"
	"office-seat-allocation/backend/internal/services"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type FairnessHandler struct {
	fairnessService *services.FairnessService
}

func NewFairnessHandler(fairnessService *services.FairnessService) *FairnessHandler {
	return &FairnessHandler{fairnessService: fairnessService}
}

func (h *FairnessHandler) GenerateAdvancedSchedule(c *gin.Context) {
	var req struct {
		WeekStartDate string `json:"week_start_date" binding:"required"`
		WeekEndDate   string `json:"week_end_date" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	startDate, err := time.Parse("2006-01-02", req.WeekStartDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid week_start_date format (use YYYY-MM-DD)"})
		return
	}

	endDate, err := time.Parse("2006-01-02", req.WeekEndDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid week_end_date format (use YYYY-MM-DD)"})
		return
	}

	createdBy := c.GetString("user_id")
	createdByUUID, _ := uuid.Parse(createdBy)

	schedule, err := h.fairnessService.GenerateAdvancedSchedule(startDate, endDate, createdByUUID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"schedule": schedule})
}

func (h *FairnessHandler) GetFairnessMetrics(c *gin.Context) {
	scheduleID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid schedule ID"})
		return
	}

	metrics, err := h.fairnessService.GetFairnessMetrics(scheduleID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"metrics": metrics})
}

func (h *FairnessHandler) GetFairnessReport(c *gin.Context) {
	scheduleID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid schedule ID"})
		return
	}

	report, err := h.fairnessService.GetFairnessReport(scheduleID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, report)
}
