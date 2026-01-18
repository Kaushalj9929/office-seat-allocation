package handlers

import (
	"net/http"
	"office-seat-allocation/backend/internal/models"
	"office-seat-allocation/backend/internal/services"
	"office-seat-allocation/backend/internal/utils"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type EmployeeHandler struct {
	service *services.EmployeeService
}

func NewEmployeeHandler(service *services.EmployeeService) *EmployeeHandler {
	return &EmployeeHandler{
		service: service,
	}
}

type CreateEmployeeRequest struct {
	Email    string     `json:"email" binding:"required,email"`
	Name     string     `json:"name" binding:"required"`
	Password string     `json:"password" binding:"required,min=8"`
	TeamID   *uuid.UUID `json:"team_id"`
	Role     string     `json:"role"`
	Status   string     `json:"status"`
}

func (h *EmployeeHandler) Create(c *gin.Context) {
	var req CreateEmployeeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	employee := &models.Employee{
		Email:  req.Email,
		Name:   req.Name,
		TeamID: req.TeamID,
		Role:   utils.RoleEmployee,
		Status: utils.StatusActive,
	}

	if req.Role != "" {
		employee.Role = req.Role
	}
	if req.Status != "" {
		employee.Status = req.Status
	}

	if err := h.service.Create(employee, req.Password); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create employee"})
		return
	}

	c.JSON(http.StatusCreated, employee)
}

func (h *EmployeeHandler) GetAll(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	status := c.Query("status")

	var teamID *uuid.UUID
	if tid := c.Query("team_id"); tid != "" {
		id, _ := uuid.Parse(tid)
		teamID = &id
	}

	employees, total, err := h.service.GetAll(page, limit, teamID, status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch employees"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": employees,
		"pagination": gin.H{
			"page":  page,
			"limit": limit,
			"total": total,
		},
	})
}

func (h *EmployeeHandler) GetByID(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	employee, err := h.service.GetByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "employee not found"})
		return
	}

	c.JSON(http.StatusOK, employee)
}

func (h *EmployeeHandler) Update(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var updates map[string]interface{}
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.Update(id, updates); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update employee"})
		return
	}

	employee, _ := h.service.GetByID(id)
	c.JSON(http.StatusOK, employee)
}

func (h *EmployeeHandler) Delete(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	if err := h.service.Delete(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete employee"})
		return
	}

	c.Status(http.StatusNoContent)
}
