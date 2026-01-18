package database

import (
	"log"
	"office-seat-allocation/backend/internal/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func Connect(databaseURL string) error {
	var err error
	DB, err = gorm.Open(postgres.Open(databaseURL), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
		DisableForeignKeyConstraintWhenMigrating: true,
	})
	if err != nil {
		return err
	}

	log.Println("Database connected successfully")
	return nil
}

func Migrate() error {
	// Migrate tables in correct order to handle foreign keys
	if err := DB.AutoMigrate(&models.Team{}); err != nil {
		return err
	}
	if err := DB.AutoMigrate(&models.Employee{}); err != nil {
		return err
	}
	if err := DB.AutoMigrate(&models.OfficeCapacity{}); err != nil {
		return err
	}
	if err := DB.AutoMigrate(&models.Schedule{}); err != nil {
		return err
	}
	if err := DB.AutoMigrate(&models.ScheduleEntry{}); err != nil {
		return err
	}
	if err := DB.AutoMigrate(&models.ChangeRequest{}); err != nil {
		return err
	}
	if err := DB.AutoMigrate(&models.AuditLog{}); err != nil {
		return err
	}
	if err := DB.AutoMigrate(&models.FairnessMetric{}); err != nil {
		return err
	}
	return DB.AutoMigrate(&models.BulkChangeRequest{})
}
