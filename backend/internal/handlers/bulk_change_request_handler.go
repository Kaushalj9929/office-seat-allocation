package handlers

import (
	"net/http"
	"office-seat-allocation/backend/internal/services"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type BulkChangeRequestHandler struct {
	service *services.BulkChangeRequestService
}

func NewBulkChangeRequestHandler(service *services.BulkChangeRequestService) *BulkChangeRequestHandler {
	return &BulkChangeRequestHandler{service: service}
}

func (h *BulkChangeRequestHandler) SubmitBulkRequest(c *gin.Context) {
	var input services.BulkChangeRequestInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, _ := c.Get("user_id")
	bulkReq, err := h.service.SubmitBulkRequest(&input, userID.(uuid.UUID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, bulkReq)
}

func (h *BulkChangeRequestHandler) GetBulkRequest(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	bulkReq, err := h.service.GetBulkRequest(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "bulk request not found"})
		return
	}

	c.JSON(http.StatusOK, bulkReq)
}

func (h *BulkChangeRequestHandler) ListBulkRequests(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))

	bulkReqs, err := h.service.ListBulkRequests(page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": bulkReqs, "page": page, "limit": limit})
}

func (h *BulkChangeRequestHandler) ApproveBulkRequest(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var input struct {
		Notes string `json:"notes"`
	}
	c.ShouldBindJSON(&input)

	userID, _ := c.Get("user_id")
	if err := h.service.ApproveBulkRequest(id, userID.(uuid.UUID), input.Notes); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "bulk request approved"})
}

func (h *BulkChangeRequestHandler) RejectBulkRequest(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var input struct {
		Reason string `json:"reason" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, _ := c.Get("user_id")
	if err := h.service.RejectBulkRequest(id, userID.(uuid.UUID), input.Reason); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "bulk request rejected"})
}
