package main

import (
	"log"
	"office-seat-allocation/backend/internal/config"
	"office-seat-allocation/backend/internal/database"
	"office-seat-allocation/backend/internal/routes"
)

func main() {
	config.Load()

	if err := database.Connect(config.AppConfig.DatabaseURL); err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	if err := database.Migrate(); err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	r := routes.Setup()

	log.Printf("Server starting on port %s", config.AppConfig.Port)
	if err := r.Run(":" + config.AppConfig.Port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
