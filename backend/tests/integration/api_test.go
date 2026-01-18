package integration

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"office-seat-allocation/backend/internal/database"
	"office-seat-allocation/backend/internal/routes"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

var router *gin.Engine
var adminToken string

func TestMain(m *testing.M) {
	// Setup test database
	database.Connect("postgres://postgres:postgres@localhost:5432/office_allocation_test")
	database.Migrate()
	
	router = routes.Setup()
	
	// Run tests
	code := m.Run()
	
	// Cleanup
	os.Exit(code)
}

func TestAuthFlow(t *testing.T) {
	t.Run("Login with valid credentials", func(t *testing.T) {
		body := map[string]string{
			"email":    "admin@example.com",
			"password": "admin123",
		}
		jsonBody, _ := json.Marshal(body)
		
		req, _ := http.NewRequest("POST", "/api/v1/auth/login", bytes.NewBuffer(jsonBody))
		req.Header.Set("Content-Type", "application/json")
		
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)
		
		assert.Equal(t, http.StatusOK, w.Code)
		
		var response map[string]interface{}
		json.Unmarshal(w.Body.Bytes(), &response)
		
		assert.NotEmpty(t, response["access_token"])
		assert.NotEmpty(t, response["refresh_token"])
		
		adminToken = response["access_token"].(string)
	})
	
	t.Run("Login with invalid credentials", func(t *testing.T) {
		body := map[string]string{
			"email":    "admin@example.com",
			"password": "wrongpassword",
		}
		jsonBody, _ := json.Marshal(body)
		
		req, _ := http.NewRequest("POST", "/api/v1/auth/login", bytes.NewBuffer(jsonBody))
		req.Header.Set("Content-Type", "application/json")
		
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)
		
		assert.Equal(t, http.StatusUnauthorized, w.Code)
	})
}

func TestEmployeeManagement(t *testing.T) {
	t.Run("Get all employees", func(t *testing.T) {
		req, _ := http.NewRequest("GET", "/api/v1/admin/employees", nil)
		req.Header.Set("Authorization", "Bearer "+adminToken)
		
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)
		
		assert.Equal(t, http.StatusOK, w.Code)
		
		var response map[string]interface{}
		json.Unmarshal(w.Body.Bytes(), &response)
		
		assert.NotNil(t, response["data"])
		assert.NotNil(t, response["pagination"])
	})
	
	t.Run("Create employee", func(t *testing.T) {
		body := map[string]interface{}{
			"email":    "test.employee@example.com",
			"name":     "Test Employee",
			"password": "password123",
			"role":     "employee",
			"status":   "active",
		}
		jsonBody, _ := json.Marshal(body)
		
		req, _ := http.NewRequest("POST", "/api/v1/admin/employees", bytes.NewBuffer(jsonBody))
		req.Header.Set("Authorization", "Bearer "+adminToken)
		req.Header.Set("Content-Type", "application/json")
		
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)
		
		assert.Equal(t, http.StatusCreated, w.Code)
	})
	
	t.Run("Get employee by ID", func(t *testing.T) {
		// First create an employee
		body := map[string]interface{}{
			"email":    "get.test@example.com",
			"name":     "Get Test",
			"password": "password123",
		}
		jsonBody, _ := json.Marshal(body)
		
		req, _ := http.NewRequest("POST", "/api/v1/admin/employees", bytes.NewBuffer(jsonBody))
		req.Header.Set("Authorization", "Bearer "+adminToken)
		req.Header.Set("Content-Type", "application/json")
		
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)
		
		var createResponse map[string]interface{}
		json.Unmarshal(w.Body.Bytes(), &createResponse)
		employeeID := createResponse["id"].(string)
		
		// Now get the employee
		req, _ = http.NewRequest("GET", "/api/v1/admin/employees/"+employeeID, nil)
		req.Header.Set("Authorization", "Bearer "+adminToken)
		
		w = httptest.NewRecorder()
		router.ServeHTTP(w, req)
		
		assert.Equal(t, http.StatusOK, w.Code)
	})
}

func TestTeamManagement(t *testing.T) {
	t.Run("Create team", func(t *testing.T) {
		body := map[string]interface{}{
			"name":        "Test Team",
			"description": "Test team description",
		}
		jsonBody, _ := json.Marshal(body)
		
		req, _ := http.NewRequest("POST", "/api/v1/admin/teams", bytes.NewBuffer(jsonBody))
		req.Header.Set("Authorization", "Bearer "+adminToken)
		req.Header.Set("Content-Type", "application/json")
		
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)
		
		assert.Equal(t, http.StatusCreated, w.Code)
	})
	
	t.Run("Get all teams", func(t *testing.T) {
		req, _ := http.NewRequest("GET", "/api/v1/admin/teams", nil)
		req.Header.Set("Authorization", "Bearer "+adminToken)
		
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)
		
		assert.Equal(t, http.StatusOK, w.Code)
	})
}

func TestScheduleGeneration(t *testing.T) {
	t.Run("Generate schedule", func(t *testing.T) {
		body := map[string]string{
			"week_start_date": "2026-02-02",
			"week_end_date":   "2026-02-06",
		}
		jsonBody, _ := json.Marshal(body)
		
		req, _ := http.NewRequest("POST", "/api/v1/admin/schedules/generate", bytes.NewBuffer(jsonBody))
		req.Header.Set("Authorization", "Bearer "+adminToken)
		req.Header.Set("Content-Type", "application/json")
		
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)
		
		assert.Equal(t, http.StatusCreated, w.Code)
		
		var response map[string]interface{}
		json.Unmarshal(w.Body.Bytes(), &response)
		
		schedule := response["schedule"].(map[string]interface{})
		assert.Equal(t, "draft", schedule["status"])
		assert.NotNil(t, schedule["entries"])
	})
	
	t.Run("Publish schedule", func(t *testing.T) {
		// First generate a schedule
		body := map[string]string{
			"week_start_date": "2026-02-09",
			"week_end_date":   "2026-02-13",
		}
		jsonBody, _ := json.Marshal(body)
		
		req, _ := http.NewRequest("POST", "/api/v1/admin/schedules/generate", bytes.NewBuffer(jsonBody))
		req.Header.Set("Authorization", "Bearer "+adminToken)
		req.Header.Set("Content-Type", "application/json")
		
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)
		
		var createResponse map[string]interface{}
		json.Unmarshal(w.Body.Bytes(), &createResponse)
		schedule := createResponse["schedule"].(map[string]interface{})
		scheduleID := schedule["id"].(string)
		
		// Now publish it
		req, _ = http.NewRequest("POST", "/api/v1/admin/schedules/"+scheduleID+"/publish", nil)
		req.Header.Set("Authorization", "Bearer "+adminToken)
		
		w = httptest.NewRecorder()
		router.ServeHTTP(w, req)
		
		assert.Equal(t, http.StatusOK, w.Code)
	})
}

func TestChangeRequestWorkflow(t *testing.T) {
	t.Run("Create change request", func(t *testing.T) {
		body := map[string]interface{}{
			"current_day":    1,
			"requested_day":  3,
			"reason":         "Test reason",
			"requested_date": "2026-02-10",
		}
		jsonBody, _ := json.Marshal(body)
		
		req, _ := http.NewRequest("POST", "/api/v1/employee/change-requests", bytes.NewBuffer(jsonBody))
		req.Header.Set("Authorization", "Bearer "+adminToken)
		req.Header.Set("Content-Type", "application/json")
		
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)
		
		assert.Equal(t, http.StatusCreated, w.Code)
		
		var response map[string]interface{}
		json.Unmarshal(w.Body.Bytes(), &response)
		
		changeRequest := response["change_request"].(map[string]interface{})
		assert.Equal(t, "pending", changeRequest["status"])
	})
	
	t.Run("Approve change request", func(t *testing.T) {
		// First create a change request
		body := map[string]interface{}{
			"current_day":    1,
			"requested_day":  4,
			"reason":         "Approval test",
			"requested_date": "2026-02-10",
		}
		jsonBody, _ := json.Marshal(body)
		
		req, _ := http.NewRequest("POST", "/api/v1/employee/change-requests", bytes.NewBuffer(jsonBody))
		req.Header.Set("Authorization", "Bearer "+adminToken)
		req.Header.Set("Content-Type", "application/json")
		
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)
		
		var createResponse map[string]interface{}
		json.Unmarshal(w.Body.Bytes(), &createResponse)
		changeRequest := createResponse["change_request"].(map[string]interface{})
		requestID := changeRequest["id"].(string)
		
		// Now approve it
		approveBody := map[string]string{
			"decision_reason": "Approved for testing",
		}
		jsonBody, _ = json.Marshal(approveBody)
		
		req, _ = http.NewRequest("POST", "/api/v1/admin/change-requests/"+requestID+"/approve", bytes.NewBuffer(jsonBody))
		req.Header.Set("Authorization", "Bearer "+adminToken)
		req.Header.Set("Content-Type", "application/json")
		
		w = httptest.NewRecorder()
		router.ServeHTTP(w, req)
		
		assert.Equal(t, http.StatusOK, w.Code)
	})
	
	t.Run("Reject change request", func(t *testing.T) {
		// First create a change request
		body := map[string]interface{}{
			"current_day":    2,
			"requested_day":  4,
			"reason":         "Rejection test",
			"requested_date": "2026-02-10",
		}
		jsonBody, _ := json.Marshal(body)
		
		req, _ := http.NewRequest("POST", "/api/v1/employee/change-requests", bytes.NewBuffer(jsonBody))
		req.Header.Set("Authorization", "Bearer "+adminToken)
		req.Header.Set("Content-Type", "application/json")
		
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)
		
		var createResponse map[string]interface{}
		json.Unmarshal(w.Body.Bytes(), &createResponse)
		changeRequest := createResponse["change_request"].(map[string]interface{})
		requestID := changeRequest["id"].(string)
		
		// Now reject it
		rejectBody := map[string]string{
			"decision_reason": "Rejected for testing",
		}
		jsonBody, _ = json.Marshal(rejectBody)
		
		req, _ = http.NewRequest("POST", "/api/v1/admin/change-requests/"+requestID+"/reject", bytes.NewBuffer(jsonBody))
		req.Header.Set("Authorization", "Bearer "+adminToken)
		req.Header.Set("Content-Type", "application/json")
		
		w = httptest.NewRecorder()
		router.ServeHTTP(w, req)
		
		assert.Equal(t, http.StatusOK, w.Code)
	})
}

func TestAuthorizationRBAC(t *testing.T) {
	t.Run("Admin can access admin endpoints", func(t *testing.T) {
		req, _ := http.NewRequest("GET", "/api/v1/admin/employees", nil)
		req.Header.Set("Authorization", "Bearer "+adminToken)
		
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)
		
		assert.Equal(t, http.StatusOK, w.Code)
	})
	
	t.Run("Unauthenticated user cannot access protected endpoints", func(t *testing.T) {
		req, _ := http.NewRequest("GET", "/api/v1/admin/employees", nil)
		
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)
		
		assert.Equal(t, http.StatusUnauthorized, w.Code)
	})
}
