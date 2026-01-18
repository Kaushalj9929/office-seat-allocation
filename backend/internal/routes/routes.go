package routes

import (
	"office-seat-allocation/backend/internal/handlers"
	"office-seat-allocation/backend/internal/middleware"

	"github.com/gin-gonic/gin"
)

func Setup() *gin.Engine {
	r := gin.Default()

	r.Use(middleware.CORS())
	r.Use(middleware.Logger())
	r.Use(middleware.ErrorHandler())

	healthHandler := handlers.NewHealthHandler()
	r.GET("/health", healthHandler.Health)

	api := r.Group("/api/v1")
	{
		_ = api
	}

	return r
}
