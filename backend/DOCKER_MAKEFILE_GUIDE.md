# Docker & Makefile Setup

## Files Created

1. **Makefile** - Development task automation
2. **docker-compose.dev.yml** - Backend development (dependencies only)
3. **docker-compose.yml** - Full stack (project root)

---

## Makefile Commands

### Development
```bash
make help           # Show all commands
make build          # Build binary to bin/server
make run            # Run application
make test           # Run all tests
make test-coverage  # Run tests with coverage
make clean          # Remove bin/ directory
make deps           # Download and tidy dependencies
make fmt            # Format code
make vet            # Run go vet
make lint           # Format + vet
```

### Docker
```bash
make docker-build   # Build Docker image
make docker-run     # Run Docker container
```

---

## Docker Compose Options

### Option 1: Backend Development (Recommended for Development)

**File**: `backend/docker-compose.dev.yml`

Starts only dependencies (PostgreSQL, Redis, RabbitMQ), run backend locally:

```bash
cd backend

# Start dependencies
docker-compose -f docker-compose.dev.yml up -d

# Run backend locally
make run

# Stop dependencies
docker-compose -f docker-compose.dev.yml down
```

**Services**:
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`
- RabbitMQ: `localhost:5672` (Management UI: `localhost:15672`)

### Option 2: Full Stack

**File**: `docker-compose.yml` (project root)

Starts everything including backend container:

```bash
# From project root
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop all
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

**Services**:
- Backend: `localhost:8080`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`
- RabbitMQ: `localhost:5672` (Management UI: `localhost:15672`)

---

## Quick Start Workflows

### Workflow 1: Local Development (Fastest)
```bash
cd backend

# Start dependencies
docker-compose -f docker-compose.dev.yml up -d

# Run backend
make run

# In another terminal - run tests
make test

# Stop when done
docker-compose -f docker-compose.dev.yml down
```

### Workflow 2: Full Docker
```bash
# From project root
docker-compose up -d

# Check health
curl http://localhost:8080/health

# View logs
docker-compose logs -f backend

# Stop
docker-compose down
```

### Workflow 3: Build and Test
```bash
cd backend

# Download dependencies
make deps

# Format and vet
make lint

# Run tests
make test

# Build
make build

# Run binary
./bin/server
```

---

## Environment Variables

Backend uses these environment variables (from `.env` or docker-compose):

```env
GO_ENV=development
PORT=8080
DATABASE_URL=postgres://postgres:postgres@postgres:5432/office_allocation?sslmode=disable
REDIS_URL=redis://redis:6379
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672/
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRY=3600
REFRESH_TOKEN_EXPIRY=604800
```

---

## Troubleshooting

### Port Conflicts
```bash
# Check what's using port 5432
lsof -i :5432

# Stop conflicting service
brew services stop postgresql  # macOS
sudo systemctl stop postgresql # Linux
```

### Docker Issues
```bash
# Remove all containers and volumes
docker-compose down -v

# Rebuild without cache
docker-compose build --no-cache

# View container logs
docker-compose logs -f backend
```

### Makefile Issues
```bash
# Ensure you're in backend directory
cd backend

# Check if make is installed
make --version

# Run commands directly if make fails
go build -o bin/server ./cmd/main.go
```

---

## Production Build

```bash
cd backend

# Build optimized binary
CGO_ENABLED=0 GOOS=linux make build

# Build Docker image
make docker-build

# Tag for registry
docker tag office-seat-backend:latest your-registry/office-seat-backend:v1.0.0

# Push to registry
docker push your-registry/office-seat-backend:v1.0.0
```

---

## Health Checks

All services have health checks in docker-compose.yml:

- **PostgreSQL**: `pg_isready -U postgres`
- **Redis**: `redis-cli ping`
- **RabbitMQ**: `rabbitmq-diagnostics ping`

Backend waits for all dependencies to be healthy before starting.

---

## Useful Docker Commands

```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs -f [service]

# Restart service
docker-compose restart backend

# Execute command in container
docker-compose exec backend sh

# View resource usage
docker stats

# Clean up everything
docker system prune -a --volumes
```
