# Technical Implementation Document (Simplified)
## Office Workspace Seat Allocation System - Local Docker Development

---

## 1. Overview

This document outlines the technical architecture and local development setup for the Office Workspace Seat Allocation System. The system is designed as a monolithic application running entirely on Docker for local development.

---

## 2. Technology Stack

### Backend
- **Language**: Go (Golang)
- **Framework**: Gin Web Framework
- **Database**: PostgreSQL
- **Cache**: Redis
- **Message Queue**: RabbitMQ
- **ORM**: GORM
- **Authentication**: JWT
- **Logging**: Zap

### Frontend
- **Framework**: React 18+
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **UI Library**: Material-UI (MUI)
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Styling**: Tailwind CSS

### Local Development
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Version Control**: Git

---

## 3. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                          │
│  - Admin Portal (Employee/Team Management)                  │
│  - Employee Portal (Schedule View & Change Requests)        │
│  - Manager Dashboard (Team Schedule Management)             │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP
┌────────────────────▼────────────────────────────────────────┐
│         Go Monolithic Application (Gin)                      │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ HTTP Handlers / Middleware                           │  │
│  │ - Authentication & Authorization                     │  │
│  │ - Request Validation                                 │  │
│  │ - Error Handling                                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Business Logic Layer                                 │  │
│  │ - ScheduleService                                    │  │
│  │ - ChangeRequestService                               │  │
│  │ - CapacityManager                                    │  │
│  │ - EmployeeService                                    │  │
│  │ - TeamService                                        │  │
│  │ - NotificationService                                │  │
│  │ - ReportingService                                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Data Access Layer (GORM)                             │  │
│  │ - Repository Pattern                                 │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
┌───────▼──┐  ┌──────▼──┐  ┌─────▼──────┐
│PostgreSQL│  │  Redis  │  │ RabbitMQ   │
│          │  │         │  │            │
└──────────┘  └─────────┘  └────────────┘
```

---

## 4. Project Structure

```
office-seat-allocation/
├── backend/
│   ├── cmd/
│   │   └── main.go
│   ├── internal/
│   │   ├── config/
│   │   ├── models/
│   │   ├── handlers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── database/
│   │       └── migrations/
│   ├── go.mod
│   ├── go.sum
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   ├── hooks/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── .env.example
├── docs/
│   ├── OFFICE_SEAT_ALLOCATION_PRD.md
│   └── TECHNICAL_IMPLEMENTATION_DOCUMENT.md
├── docker-compose.yml
└── README.md
```

---

## 5. Implementation Phases

### Phase 1: MVP (Weeks 1-4)

**Backend Tasks**:
1. Setup Go project and dependencies
2. Database schema and migrations
3. Authentication (JWT)
4. Employee & Team CRUD APIs
5. Basic schedule generation
6. Change request workflow
7. Email notifications
8. Admin APIs

**Frontend Tasks**:
1. Setup React + TypeScript
2. Login UI
3. Admin portal (Employee/Team management, Schedule generation)
4. Employee portal (View schedule, Submit change requests)
5. Basic styling

**Deliverables**:
- Functional monolithic application
- Docker containers
- Database migrations
- API documentation

**Timeline**: 4 weeks

---

### Phase 2: Enhancement (Weeks 5-8)

**Backend Tasks**:
1. Advanced scheduling algorithm
2. Bulk change requests
3. Capacity conflict resolution
4. Reporting APIs
5. Performance optimization

**Frontend Tasks**:
1. Manager dashboard
2. Bulk request UI
3. Reporting dashboard
4. Mobile-responsive design
5. Real-time notifications

**Deliverables**:
- Enhanced features
- Performance improvements
- User documentation

**Timeline**: 4 weeks

---

## 6. Database Schema (PostgreSQL)

```sql
-- Employees
CREATE TABLE employees (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    team_id UUID REFERENCES teams(id),
    role VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    preferences JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Teams
CREATE TABLE teams (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    team_lead_id UUID REFERENCES employees(id),
    preferences JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Schedules
CREATE TABLE schedules (
    id UUID PRIMARY KEY,
    week_start_date DATE NOT NULL,
    week_end_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_by UUID REFERENCES employees(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP,
    version INT DEFAULT 1
);

-- Schedule Entries
CREATE TABLE schedule_entries (
    id UUID PRIMARY KEY,
    schedule_id UUID REFERENCES schedules(id) ON DELETE CASCADE,
    employee_id UUID REFERENCES employees(id),
    day_of_week INT NOT NULL,
    work_type VARCHAR(50) NOT NULL,
    seat_id UUID,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(schedule_id, employee_id, day_of_week)
);

-- Change Requests
CREATE TABLE change_requests (
    id UUID PRIMARY KEY,
    employee_id UUID REFERENCES employees(id),
    current_day INT NOT NULL,
    requested_day INT NOT NULL,
    reason TEXT,
    status VARCHAR(50) NOT NULL,
    requested_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_by UUID REFERENCES employees(id),
    decision_date TIMESTAMP,
    decision_reason TEXT,
    effective_from DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL,
    changed_by UUID REFERENCES employees(id),
    changed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    old_value JSONB,
    new_value JSONB,
    reason TEXT
);

-- Office Capacity
CREATE TABLE office_capacity (
    id UUID PRIMARY KEY,
    day_of_week INT NOT NULL,
    total_seats INT NOT NULL,
    reserved_seats INT DEFAULT 0,
    effective_from DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_employees_team_id ON employees(team_id);
CREATE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_schedule_entries_schedule_id ON schedule_entries(schedule_id);
CREATE INDEX idx_schedule_entries_employee_id ON schedule_entries(employee_id);
CREATE INDEX idx_change_requests_employee_id ON change_requests(employee_id);
CREATE INDEX idx_change_requests_status ON change_requests(status);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
```

---

## 7. API Endpoints (REST)

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh` - Refresh JWT token

### Employees (Admin)
- `GET /api/v1/admin/employees` - List all employees
- `POST /api/v1/admin/employees` - Create employee
- `PUT /api/v1/admin/employees/{id}` - Update employee
- `DELETE /api/v1/admin/employees/{id}` - Delete employee
- `POST /api/v1/admin/employees/bulk-import` - Bulk import

### Teams (Admin)
- `GET /api/v1/admin/teams` - List all teams
- `POST /api/v1/admin/teams` - Create team
- `PUT /api/v1/admin/teams/{id}` - Update team
- `GET /api/v1/admin/teams/{id}/members` - Get team members

### Schedules (Admin)
- `POST /api/v1/admin/schedules/generate` - Generate schedule
- `GET /api/v1/admin/schedules/{id}` - Get schedule
- `PUT /api/v1/admin/schedules/{id}` - Update schedule
- `POST /api/v1/admin/schedules/{id}/publish` - Publish schedule
- `GET /api/v1/admin/schedules/{id}/entries` - Get entries

### Change Requests (Employee)
- `GET /api/v1/employee/schedule` - Get personal schedule
- `POST /api/v1/employee/change-requests` - Submit request
- `GET /api/v1/employee/change-requests` - Get requests
- `DELETE /api/v1/employee/change-requests/{id}` - Cancel request

### Change Requests (Manager/Admin)
- `GET /api/v1/manager/change-requests` - Get team requests
- `PUT /api/v1/manager/change-requests/{id}/approve` - Approve
- `PUT /api/v1/manager/change-requests/{id}/reject` - Reject

### Reports (Admin)
- `GET /api/v1/admin/reports/capacity-utilization` - Capacity report
- `GET /api/v1/admin/reports/fairness-analysis` - Fairness report
- `GET /api/v1/admin/reports/change-requests-stats` - Stats report

---

## 8. Local Development Setup

### Prerequisites
- Docker Desktop installed
- Docker Compose installed
- Git installed

### Quick Start

```bash
# Clone repository
git clone <repo-url>
cd office-seat-allocation

# Start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop services
docker-compose down

# Clean up volumes (reset database)
docker-compose down -v
```

### Docker Compose Services

| Service | Port | Purpose |
|---------|------|---------|
| PostgreSQL | 5432 | Database |
| Redis | 6379 | Cache |
| RabbitMQ | 5672 | Message queue |
| RabbitMQ UI | 15672 | Management UI |
| Backend | 8080 | Go API server |
| Frontend | 3000 | React dev server |

### Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api/v1
- **API Docs**: http://localhost:8080/swagger
- **RabbitMQ UI**: http://localhost:15672 (guest/guest)
- **Database**: localhost:5432 (postgres/postgres)

### Environment Configuration

Create `.env` file in project root:

```env
# Backend
GO_ENV=development
DATABASE_URL=postgres://postgres:postgres@postgres:5432/office_allocation
REDIS_URL=redis://redis:6379
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672/
JWT_SECRET=dev-secret-key-change-in-production

# Frontend
REACT_APP_API_URL=http://localhost:8080/api/v1
```

### Database Initialization

Migrations run automatically on backend startup. To manually run:

```bash
docker-compose exec backend go run cmd/main.go migrate
```

---

## 9. Development Workflow

### Backend Development (Inside Docker)

```bash
# Run backend shell
docker-compose exec backend bash

# Run tests
go test ./...

# Run linting
golangci-lint run

# Rebuild backend container
docker-compose build backend
docker-compose up -d backend
```

### Frontend Development (Inside Docker)

```bash
# Run frontend shell
docker-compose exec frontend bash

# Run tests
npm run test

# Build
npm run build

# Lint
npm run lint
```

### Local File Changes

- Backend code changes: Auto-reload via Go hot-reload
- Frontend code changes: Auto-reload via Vite dev server
- Database changes: Migrations run on backend startup

---

## 10. Local Monitoring & Debugging

### Logging

```bash
# Backend logs
docker-compose logs -f backend

# Frontend logs
docker-compose logs -f frontend

# Database logs
docker-compose logs -f postgres

# All logs
docker-compose logs -f
```

### Database Inspection

```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U postgres -d office_allocation

# Common queries
\dt                    # List tables
\d employees           # Describe table
SELECT * FROM employees;  # Query data
```

### Redis Inspection

```bash
# Connect to Redis
docker-compose exec redis redis-cli

# Common commands
KEYS *                 # List all keys
GET key_name           # Get value
FLUSHALL              # Clear all data
```

### RabbitMQ Management

- UI: http://localhost:15672
- Username: guest
- Password: guest
- View queues, messages, and connections

---

## 11. Testing

### Backend Testing

```bash
# Run all tests
docker-compose exec backend go test ./...

# Run with coverage
docker-compose exec backend go test -cover ./...

# Run specific test
docker-compose exec backend go test -run TestScheduleGeneration ./...
```

### Frontend Testing

```bash
# Run tests
docker-compose exec frontend npm run test

# Run with coverage
docker-compose exec frontend npm run test -- --coverage
```

### Manual Testing

- Frontend: http://localhost:3000
- API: http://localhost:8080/api/v1
- Swagger docs: http://localhost:8080/swagger

---

## 12. Local Data Management

### Backup Database

```bash
# Export database
docker-compose exec postgres pg_dump -U postgres office_allocation > backup.sql

# Import database
docker-compose exec -T postgres psql -U postgres office_allocation < backup.sql
```

### Reset Database

```bash
# Remove all data and restart
docker-compose down -v
docker-compose up -d
```

### Seed Sample Data

```bash
# Run seed script (if available)
docker-compose exec backend go run cmd/seed/main.go
```

---

## 13. Docker Compose Configuration

### docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: office_allocation
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backend/internal/database/migrations:/docker-entrypoint-initdb.d

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  rabbitmq:
    image: rabbitmq:3.12-management-alpine
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      RABBITMQ_DEFAULT_USER: guest
      RABBITMQ_DEFAULT_PASS: guest
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
    environment:
      - GO_ENV=development
      - DATABASE_URL=postgres://postgres:postgres@postgres:5432/office_allocation
      - REDIS_URL=redis://redis:6379
      - RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672/
    depends_on:
      - postgres
      - redis
      - rabbitmq
    volumes:
      - ./backend:/app
    command: go run cmd/main.go

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:8080/api/v1
    depends_on:
      - backend
    volumes:
      - ./frontend/src:/app/src
    command: npm run dev

volumes:
  postgres_data:
  redis_data:
  rabbitmq_data:
```

---

## 14. Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :8080

# Kill process
kill -9 <PID>

# Or change port in docker-compose.yml
```

### Database Connection Error

```bash
# Ensure postgres is running
docker-compose ps postgres

# Check logs
docker-compose logs postgres

# Restart postgres
docker-compose restart postgres
```

### Frontend Not Updating

```bash
# Clear node_modules and reinstall
docker-compose exec frontend rm -rf node_modules
docker-compose exec frontend npm install

# Restart frontend
docker-compose restart frontend
```

### Backend Not Starting

```bash
# Check logs
docker-compose logs backend

# Rebuild container
docker-compose build --no-cache backend
docker-compose up -d backend
```

### Services Not Communicating

```bash
# Check network
docker network ls

# Inspect network
docker network inspect office-seat-allocation_default

# Restart all services
docker-compose restart
```

---

## 15. Key Algorithms

### Schedule Generation Algorithm

```go
// Pseudocode for fair schedule generation
func GenerateSchedule(employees []Employee, capacity map[int]int) Schedule {
    // 1. Initialize: 3 office days, 2 WFH days per employee
    // 2. Sort employees by historical office day count (fairness)
    // 3. For each day (Mon-Fri):
    //    - Calculate available seats
    //    - Assign employees respecting team preferences
    //    - Ensure no employee exceeds 3 office days
    // 4. Validate capacity constraints
    // 5. Return schedule or error if impossible
}
```

### Capacity Validation

```go
func ValidateCapacity(schedule Schedule, capacity map[int]int) bool {
    for day := 0; day < 5; day++ {
        officeCount := CountOfficeEmployees(schedule, day)
        if officeCount > capacity[day] {
            return false
        }
    }
    return true
}
```

### Hybrid Work Constraint Validation

```go
func ValidateHybridConstraint(employee Employee, schedule Schedule) bool {
    officeCount := CountOfficeDay(employee, schedule)
    wfhCount := CountWFHDay(employee, schedule)
    return officeCount == 3 && wfhCount == 2
}
```

---

## 16. Performance Targets

- Schedule generation: < 30 seconds for 500 employees
- Change request processing: < 5 seconds
- API response time: < 2 seconds (p95)
- Page load time: < 2 seconds
- Real-time updates: < 5 seconds

---

## 17. Security Considerations

### Local Development
- JWT tokens with 1-hour expiry
- Refresh tokens with 7-day expiry
- Role-based access control (RBAC)
- Input validation and sanitization
- SQL injection prevention (parameterized queries)

### Credentials
- Default credentials for local development only
- Change JWT_SECRET before production
- Use strong passwords in production

---

**Document Version**: 1.0  
**Scope**: Local Docker development only  
**Last Updated**: [Current Date]
