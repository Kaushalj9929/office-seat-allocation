package routes

import (
	"log"
	"office-seat-allocation/backend/internal/database"
	"office-seat-allocation/backend/internal/handlers"
	"office-seat-allocation/backend/internal/middleware"
	"office-seat-allocation/backend/internal/repositories"
	"office-seat-allocation/backend/internal/services"
	"office-seat-allocation/backend/internal/utils"

	"github.com/gin-gonic/gin"
)

func Setup() *gin.Engine {
	r := gin.Default()

	r.Use(middleware.CORS())
	r.Use(middleware.Logger())
	r.Use(middleware.ErrorHandler())

	// Initialize repositories
	employeeRepo := repositories.NewEmployeeRepository(database.DB)
	teamRepo := repositories.NewTeamRepository(database.DB)
	scheduleRepo := repositories.NewScheduleRepository(database.DB)
	changeRequestRepo := repositories.NewChangeRequestRepository(database.DB)
	capacityRepo := repositories.NewOfficeCapacityRepository(database.DB)
	fairnessRepo := repositories.NewFairnessMetricRepository(database.DB)
	bulkChangeRequestRepo := services.NewBulkChangeRequestRepository(database.DB)

	// Initialize notification services
	emailService := services.NewEmailService()
	rabbitMQ, err := services.NewRabbitMQService()
	if err != nil {
		log.Printf("Warning: RabbitMQ not available: %v", err)
		rabbitMQ = nil
	} else {
		rabbitMQ.ConsumeNotifications(emailService)
	}

	// Initialize services
	authService := services.NewAuthService(employeeRepo)
	employeeService := services.NewEmployeeService(employeeRepo)
	teamService := services.NewTeamService(teamRepo)
	scheduleService := services.NewScheduleService(scheduleRepo, employeeRepo, capacityRepo, rabbitMQ)
	changeRequestService := services.NewChangeRequestService(changeRequestRepo, scheduleRepo, capacityRepo, employeeRepo, rabbitMQ)
	fairnessService := services.NewFairnessService(fairnessRepo, scheduleRepo, employeeRepo, teamRepo)
	capacityManager := services.NewCapacityManager(scheduleRepo, capacityRepo, database.DB)
	bulkChangeRequestService := services.NewBulkChangeRequestService(bulkChangeRequestRepo, changeRequestRepo, scheduleRepo, capacityManager)

	// Initialize handlers
	healthHandler := handlers.NewHealthHandler()
	authHandler := handlers.NewAuthHandler(authService)
	employeeHandler := handlers.NewEmployeeHandler(employeeService)
	teamHandler := handlers.NewTeamHandler(teamService)
	scheduleHandler := handlers.NewScheduleHandler(scheduleService)
	changeRequestHandler := handlers.NewChangeRequestHandler(changeRequestService)
	fairnessHandler := handlers.NewFairnessHandler(fairnessService)
	bulkChangeRequestHandler := handlers.NewBulkChangeRequestHandler(bulkChangeRequestService)
	conflictHandler := handlers.NewConflictHandler(capacityManager)

	r.GET("/health", healthHandler.Health)

	api := r.Group("/api/v1")
	{
		// Auth routes (public)
		auth := api.Group("/auth")
		{
			auth.POST("/login", authHandler.Login)
			auth.POST("/refresh", middleware.AuthMiddleware(), authHandler.Refresh)
			auth.POST("/logout", middleware.AuthMiddleware(), authHandler.Logout)
		}

		// Admin routes
		admin := api.Group("/admin")
		admin.Use(middleware.AuthMiddleware(), middleware.RequireRole(utils.RoleAdmin))
		{
			// Employee management
			admin.GET("/employees", employeeHandler.GetAll)
			admin.GET("/employees/:id", employeeHandler.GetByID)
			admin.POST("/employees", employeeHandler.Create)
			admin.PUT("/employees/:id", employeeHandler.Update)
			admin.DELETE("/employees/:id", employeeHandler.Delete)

			// Team management
			admin.GET("/teams", teamHandler.GetAll)
			admin.GET("/teams/:id", teamHandler.GetByID)
			admin.POST("/teams", teamHandler.Create)
			admin.PUT("/teams/:id", teamHandler.Update)
			admin.DELETE("/teams/:id", teamHandler.Delete)
			admin.GET("/teams/:id/members", teamHandler.GetMembers)

			// Schedule management
			admin.POST("/schedules/generate", scheduleHandler.GenerateSchedule)
			admin.POST("/schedules/generate-advanced", fairnessHandler.GenerateAdvancedSchedule)
			admin.GET("/schedules", scheduleHandler.GetAllSchedules)
			admin.GET("/schedules/:id", scheduleHandler.GetSchedule)
			admin.GET("/schedules/:id/fairness", fairnessHandler.GetFairnessMetrics)
			admin.GET("/schedules/:id/fairness-report", fairnessHandler.GetFairnessReport)
			admin.POST("/schedules/:id/publish", scheduleHandler.PublishSchedule)
			admin.DELETE("/schedules/:id", scheduleHandler.DeleteSchedule)

			// Change request management (admin)
			admin.GET("/change-requests", changeRequestHandler.GetAllChangeRequests)
			admin.GET("/change-requests/:id", changeRequestHandler.GetChangeRequest)
			admin.POST("/change-requests/:id/approve", changeRequestHandler.ApproveChangeRequest)
			admin.POST("/change-requests/:id/reject", changeRequestHandler.RejectChangeRequest)

			// Bulk change requests
			admin.POST("/bulk-change-requests", bulkChangeRequestHandler.SubmitBulkRequest)
			admin.GET("/bulk-change-requests", bulkChangeRequestHandler.ListBulkRequests)
			admin.GET("/bulk-change-requests/:id", bulkChangeRequestHandler.GetBulkRequest)
			admin.POST("/bulk-change-requests/:id/approve", bulkChangeRequestHandler.ApproveBulkRequest)
			admin.POST("/bulk-change-requests/:id/reject", bulkChangeRequestHandler.RejectBulkRequest)

			// Conflicts
			admin.GET("/conflicts", conflictHandler.GetConflicts)
		}

		// Employee routes
		employee := api.Group("/employee")
		employee.Use(middleware.AuthMiddleware())
		{
			employee.POST("/change-requests", changeRequestHandler.CreateChangeRequest)
			employee.GET("/change-requests", changeRequestHandler.GetMyChangeRequests)
			employee.GET("/change-requests/:id", changeRequestHandler.GetChangeRequest)
			employee.DELETE("/change-requests/:id", changeRequestHandler.DeleteChangeRequest)
		}
	}

	return r
}
