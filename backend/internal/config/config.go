package config

import (
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	Env                 string
	Port                string
	DatabaseURL         string
	RedisURL            string
	RabbitMQURL         string
	JWTSecret           string
	JWTExpiry           int
	RefreshTokenExpiry  int
	SMTPHost            string
	SMTPPort            string
	SMTPUser            string
	SMTPPassword        string
}

var AppConfig *Config

func Load() {
	godotenv.Load()

	jwtExpiry, _ := strconv.Atoi(getEnv("JWT_EXPIRY", "3600"))
	refreshExpiry, _ := strconv.Atoi(getEnv("REFRESH_TOKEN_EXPIRY", "604800"))

	AppConfig = &Config{
		Env:                getEnv("GO_ENV", "development"),
		Port:               getEnv("PORT", "8080"),
		DatabaseURL:        getEnv("DATABASE_URL", ""),
		RedisURL:           getEnv("REDIS_URL", ""),
		RabbitMQURL:        getEnv("RABBITMQ_URL", ""),
		JWTSecret:          getEnv("JWT_SECRET", ""),
		JWTExpiry:          jwtExpiry,
		RefreshTokenExpiry: refreshExpiry,
		SMTPHost:           getEnv("SMTP_HOST", ""),
		SMTPPort:           getEnv("SMTP_PORT", "587"),
		SMTPUser:           getEnv("SMTP_USER", ""),
		SMTPPassword:       getEnv("SMTP_PASSWORD", ""),
	}

	if AppConfig.DatabaseURL == "" {
		log.Fatal("DATABASE_URL is required")
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
