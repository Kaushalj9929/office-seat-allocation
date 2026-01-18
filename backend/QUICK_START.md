# Quick Start Guide - Backend

## Prerequisites
- Go 1.21+
- PostgreSQL 15+ (running)
- Docker (optional)

## Option 1: Local Development (Without Docker)

### 1. Setup Database
```bash
# Create database
createdb office_allocation

# Or using psql
psql -U postgres -c "CREATE DATABASE office_allocation;"
```

### 2. Configure Environment
```bash
cd backend
cp .env.example .env

# Edit .env and update DATABASE_URL:
# DATABASE_URL=postgres://postgres:postgres@localhost:5432/office_allocation?sslmode=disable
```

### 3. Run Application
```bash
# Install dependencies
go mod download

# Run server
go run cmd/main.go
```

### 4. Test Health Endpoint
```bash
curl http://localhost:8080/health
```

Expected response:
```json
{
  "status": "healthy",
  "database": "connected"
}
```

## Option 2: With Docker Compose (Recommended)

### Backend Only (Development)
```bash
cd backend

# Start dependencies only (postgres, redis, rabbitmq)
docker-compose -f docker-compose.dev.yml up -d

# Run backend locally
make run

# Test health
curl http://localhost:8080/health
```

### Full Stack (Backend + Dependencies)
```bash
# From project root
docker-compose up -d

# Check logs
docker-compose logs -f backend

# Test health
curl http://localhost:8080/health

# Stop services
docker-compose down
```

## Running Tests

```bash
cd backend

# Run all tests
go test ./...

# Run with verbose output
go test -v ./...

# Run specific package
go test ./internal/handlers/...

# Run with coverage
go test -cover ./...
```

## Development Workflow

### 1. Make Changes
Edit files in `internal/` directory

### 2. Run Tests
```bash
go test ./...
```

### 3. Build
```bash
make build
# or
go build -o bin/server ./cmd/main.go
```

### 4. Run
```bash
make run
# or
go run cmd/main.go
```

## Troubleshooting

### Database Connection Error
```
Failed to connect to database: dial tcp [::1]:5432: connect: connection refused
```

**Solution**: Ensure PostgreSQL is running
```bash
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql

# Check status
psql -U postgres -c "SELECT version();"
```

### Port Already in Use
```
bind: address already in use
```

**Solution**: Change port in .env or kill process
```bash
# Find process
lsof -i :8080

# Kill process
kill -9 <PID>
```

### Module Errors
```
go: updates to go.mod needed
```

**Solution**: Run go mod tidy
```bash
go mod tidy
```

## Next Steps

Once Sub-Phase 1.1 is verified working:
1. Proceed to Sub-Phase 1.2 (Authentication & CRUD APIs)
2. Implement JWT authentication
3. Add Employee and Team CRUD endpoints
4. Add role-based access control

## Useful Commands (Makefile)

```bash
# Show all available commands
make help

# Build application
make build

# Run application
make run

# Run tests
make test

# Run tests with coverage
make test-coverage

# Format and vet code
make lint

# Clean build artifacts
make clean

# Download dependencies
make deps

# Build Docker image
make docker-build

# Run Docker container
make docker-run
```

## Manual Commands

```bash
# Format code
go fmt ./...

# Vet code
go vet ./...

# Build for production
CGO_ENABLED=0 GOOS=linux go build -o bin/server ./cmd/main.go
```

## API Endpoints (Current)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /health  | Health check with DB status |

## What's Working

✅ Server starts on port 8080  
✅ Database connection established  
✅ Auto-migration runs on startup  
✅ Health endpoint responds  
✅ CORS enabled  
✅ Request logging active  
✅ Error handling middleware  

## What's Next (Sub-Phase 1.2)

🔜 POST /api/v1/auth/login  
🔜 POST /api/v1/auth/refresh  
🔜 GET /api/v1/admin/employees  
🔜 POST /api/v1/admin/employees  
🔜 PUT /api/v1/admin/employees/:id  
🔜 DELETE /api/v1/admin/employees/:id  
🔜 GET /api/v1/admin/teams  
🔜 POST /api/v1/admin/teams  
