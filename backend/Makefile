.PHONY: help build run test clean docker-build docker-run deps fmt vet dc-up dc-down dc-logs dc-ps dc-restart dc-dev-up dc-dev-down seed

help:
	@echo "Available commands:"
	@echo "  make build          - Build the application"
	@echo "  make run            - Run the application"
	@echo "  make test           - Run tests"
	@echo "  make clean          - Clean build artifacts"
	@echo "  make docker-build   - Build Docker image"
	@echo "  make docker-run     - Run Docker container"
	@echo "  make deps           - Download dependencies"
	@echo "  make fmt            - Format code"
	@echo "  make vet            - Run go vet"
	@echo "  make seed           - Seed database with test data"
	@echo ""
	@echo "Docker Compose (Development):"
	@echo "  make dc-dev-up      - Start dependencies (postgres, redis, rabbitmq)"
	@echo "  make dc-dev-down    - Stop dependencies"
	@echo ""
	@echo "Docker Compose (Full Stack - from project root):"
	@echo "  make dc-up          - Start all services"
	@echo "  make dc-down        - Stop all services"
	@echo "  make dc-logs        - View logs"
	@echo "  make dc-ps          - List containers"
	@echo "  make dc-restart     - Restart services"

build:
	@echo "Building..."
	@go build -o bin/server ./cmd/main.go

run:
	@echo "Running..."
	@go run cmd/main.go

test:
	@echo "Running tests..."
	@go test -v ./...

test-coverage:
	@echo "Running tests with coverage..."
	@go test -cover ./...

clean:
	@echo "Cleaning..."
	@rm -rf bin/

docker-build:
	@echo "Building Docker image..."
	@docker build -t office-seat-backend .

docker-run:
	@echo "Running Docker container..."
	@echo "Note: Use 'docker-compose up' for full stack with database"
	@if [ ! -f .env ]; then cp .env.example .env; fi
	@docker run -p 8080:8080 \
		-e DATABASE_URL=postgres://postgres:postgres@host.docker.internal:5432/office_allocation?sslmode=disable \
		-e REDIS_URL=redis://host.docker.internal:6379 \
		-e RABBITMQ_URL=amqp://guest:guest@host.docker.internal:5672/ \
		-e JWT_SECRET=dev-secret-key \
		office-seat-backend

deps:
	@echo "Downloading dependencies..."
	@go mod download
	@go mod tidy

fmt:
	@echo "Formatting code..."
	@go fmt ./...

vet:
	@echo "Running go vet..."
	@go vet ./...

lint: fmt vet
	@echo "Linting complete"

seed:
	@echo "Seeding database..."
	@go run cmd/seed/main.go

# Docker Compose - Development (dependencies only)
dc-dev-up:
	@echo "Starting development dependencies..."
	@docker-compose -f docker-compose.dev.yml up -d
	@echo "✅ PostgreSQL, Redis, RabbitMQ started"

dc-dev-down:
	@echo "Stopping development dependencies..."
	@docker-compose -f docker-compose.dev.yml down

dc-dev-logs:
	@docker-compose -f docker-compose.dev.yml logs -f

# Docker Compose - Full Stack (from project root)
dc-up:
	@echo "Starting full stack..."
	@cd .. && docker-compose up -d
	@echo "✅ All services started"

dc-down:
	@echo "Stopping all services..."
	@cd .. && docker-compose down

dc-down-v:
	@echo "Stopping all services and removing volumes..."
	@cd .. && docker-compose down -v

dc-logs:
	@cd .. && docker-compose logs -f backend

dc-logs-all:
	@cd .. && docker-compose logs -f

dc-ps:
	@cd .. && docker-compose ps

dc-restart:
	@echo "Restarting backend..."
	@cd .. && docker-compose restart backend

dc-build:
	@echo "Building services..."
	@cd .. && docker-compose build --no-cache
