package handlers

import (
	"net/http"
	"office-seat-allocation/backend/internal/services"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type ChangeRequestHandler struct {
	changeRequestService *services.ChangeRequestService
}

func NewChangeRequestHandler(changeRequestService *services.ChangeRequestService) *ChangeRequestHandler {
	return &ChangeRequestHandler{changeRequestService: changeRequestService}
}

func (h *ChangeRequestHandler) CreateChangeRequest(c *gin.Context) {
	var req struct {
		CurrentDay    int    `json:"current_day" binding:"required"`
		RequestedDay  int    `json:"requested_day" binding:"required"`
		Reason        string `json:"reason"`
		RequestedDate string `json:"requested_date" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	requestedDate, err := time.Parse("2006-01-02", req.RequestedDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid requested_date format (use YYYY-MM-DD)"})
		return
	}

	employeeID := c.GetString("user_id")
	employeeUUID, _ := uuid.Parse(employeeID)

	cr, err := h.changeRequestService.CreateChangeRequest(employeeUUID, req.CurrentDay, req.RequestedDay, req.Reason, requestedDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"change_request": cr})
}

func (h *ChangeRequestHandler) GetChangeRequest(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid change request ID"})
		return
	}

	cr, err := h.changeRequestService.GetChangeRequest(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "change request not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"change_request": cr})
}

func (h *ChangeRequestHandler) GetAllChangeRequests(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	status := c.Query("status")

	requests, total, err := h.changeRequestService.GetAllChangeRequests(page, limit, status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"change_requests": requests,
		"total":           total,
		"page":            page,
		"limit":           limit,
	})
}

func (h *ChangeRequestHandler) GetMyChangeRequests(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	employeeID := c.GetString("user_id")
	employeeUUID, _ := uuid.Parse(employeeID)

	requests, total, err := h.changeRequestService.GetEmployeeChangeRequests(employeeUUID, page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"change_requests": requests,
		"total":           total,
		"page":            page,
		"limit":           limit,
	})
}

func (h *ChangeRequestHandler) ApproveChangeRequest(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid change request ID"})
		return
	}

	var req struct {
		DecisionReason string `json:"decision_reason"`
	}
	c.ShouldBindJSON(&req)

	approverID := c.GetString("user_id")
	approverUUID, _ := uuid.Parse(approverID)

	cr, err := h.changeRequestService.ApproveChangeRequest(id, approverUUID, req.DecisionReason)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"change_request": cr})
}

func (h *ChangeRequestHandler) RejectChangeRequest(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid change request ID"})
		return
	}

	var req struct {
		DecisionReason string `json:"decision_reason" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	approverID := c.GetString("user_id")
	approverUUID, _ := uuid.Parse(approverID)

	cr, err := h.changeRequestService.RejectChangeRequest(id, approverUUID, req.DecisionReason)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"change_request": cr})
}

func (h *ChangeRequestHandler) DeleteChangeRequest(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid change request ID"})
		return
	}

	if err := h.changeRequestService.DeleteChangeRequest(id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "change request deleted successfully"})
}
