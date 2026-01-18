# Backend Phase 1 Detailed Implementation Plan
## Office Workspace Seat Allocation System

---

## 1. Overview

This document provides detailed specifications for backend implementation in Phase 1. It covers project structure, database schema, API specifications, and implementation guidelines.

---

## 2. Project Structure

```
backend/
├── cmd/
│   └── main.go                          # Application entry point
├── internal/
│   ├── config/
│   │   └── config.go                    # Configuration management
│   ├── models/
│   │   ├── employee.go
│   │   ├── team.go
│   │   ├── schedule.go
│   │   ├── change_request.go
│   │   ├── audit_log.go
│   │   └── office_capacity.go
│   ├── handlers/
│   │   ├── auth_handler.go
│   │   ├── employee_handler.go
│   │   ├── team_handler.go
│   │   ├── schedule_handler.go
│   │   ├── change_request_handler.go
│   │   └── health_handler.go
│   ├── services/
│   │   ├── auth_service.go
│   │   ├── employee_service.go
│   │   ├── team_service.go
│   │   ├── schedule_service.go
│   │   ├── change_request_service.go
│   │   ├── capacity_manager.go
│   │   └── notification_service.go
│   ├── repositories/
│   │   ├── employee_repo.go
│   │   ├── team_repo.go
│   │   ├── schedule_repo.go
│   │   ├── change_request_repo.go
│   │   ├── audit_log_repo.go
│   │   └── office_capacity_repo.go
│   ├── middleware/
│   │   ├── auth_middleware.go
│   │   ├── error_handler.go
│   │   ├── logging_middleware.go
│   │   └── cors_middleware.go
│   ├── utils/
│   │   ├── validators.go
│   │   ├── helpers.go
│   │   ├── constants.go
│   │   └── errors.go
│   ├── database/
│   │   ├── db.go
│   │   └── migrations/
│   │       ├── 001_initial_schema.sql
│   │       └── 002_add_indexes.sql
│   └── routes/
│       └── routes.go
├── tests/
│   ├── unit/
│   ├── integration/
│   └── fixtures/
├── go.mod
├── go.sum
├── Dockerfile
├── .env.example
└── README.md
```

---

## 3. Database Schema

### 3.1 Employees Table

```sql
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'employee',
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_employees_team_id ON employees(team_id);
CREATE INDEX idx_employees_status ON employees(status);
```

**Fields**:
- `id`: Unique identifier (UUID)
- `email`: Email address (unique)
- `name`: Employee name
- `password_hash`: Hashed password (bcrypt)
- `team_id`: Reference to team
- `role`: 'employee', 'team_lead', 'manager', 'admin'
- `status`: 'active', 'inactive', 'on_leave'
- `preferences`: JSON object for office day preferences
- `created_at`, `updated_at`, `deleted_at`: Timestamps

---

### 3.2 Teams Table

```sql
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    team_lead_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_teams_team_lead_id ON teams(team_lead_id);
```

**Fields**:
- `id`: Unique identifier (UUID)
- `name`: Team name
- `description`: Team description
- `team_lead_id`: Reference to team lead employee
- `preferences`: JSON object for team preferences (e.g., preferred office days)
- `created_at`, `updated_at`, `deleted_at`: Timestamps

---

### 3.3 Schedules Table

```sql
CREATE TABLE schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    week_start_date DATE NOT NULL,
    week_end_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'draft',
    created_by UUID REFERENCES employees(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP,
    version INT DEFAULT 1
);

CREATE INDEX idx_schedules_status ON schedules(status);
CREATE INDEX idx_schedules_week_start ON schedules(week_start_date);
```

**Fields**:
- `id`: Unique identifier (UUID)
- `week_start_date`: Start date of the week
- `week_end_date`: End date of the week
- `status`: 'draft', 'published', 'archived'
- `created_by`: Admin who created the schedule
- `created_at`: Creation timestamp
- `published_at`: Publication timestamp
- `version`: Version number for tracking changes

---

### 3.4 Schedule Entries Table

```sql
CREATE TABLE schedule_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    schedule_id UUID REFERENCES schedules(id) ON DELETE CASCADE,
    employee_id UUID REFERENCES employees(id),
    day_of_week INT NOT NULL,
    work_type VARCHAR(50) NOT NULL,
    seat_id UUID,
    status VARCHAR(50) NOT NULL DEFAULT 'assigned',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(schedule_id, employee_id, day_of_week)
);

CREATE INDEX idx_schedule_entries_schedule_id ON schedule_entries(schedule_id);
CREATE INDEX idx_schedule_entries_employee_id ON schedule_entries(employee_id);
```

**Fields**:
- `id`: Unique identifier (UUID)
- `schedule_id`: Reference to schedule
- `employee_id`: Reference to employee
- `day_of_week`: 0=Monday, 1=Tuesday, ..., 4=Friday
- `work_type`: 'office' or 'wfh'
- `seat_id`: Optional seat assignment
- `status`: 'assigned', 'cancelled', 'swapped'
- `created_at`: Creation timestamp

---

### 3.5 Change Requests Table

```sql
CREATE TABLE change_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES employees(id),
    current_day INT NOT NULL,
    requested_day INT NOT NULL,
    reason TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    requested_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_by UUID REFERENCES employees(id),
    decision_date TIMESTAMP,
    decision_reason TEXT,
    effective_from DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_change_requests_employee_id ON change_requests(employee_id);
CREATE INDEX idx_change_requests_status ON change_requests(status);
CREATE INDEX idx_change_requests_requested_date ON change_requests(requested_date);
```

**Fields**:
- `id`: Unique identifier (UUID)
- `employee_id`: Reference to employee
- `current_day`: Current assigned day (0-4)
- `requested_day`: Requested day (0-4)
- `reason`: Reason for change
- `status`: 'pending', 'approved', 'rejected', 'cancelled'
- `requested_date`: When request was made
- `approved_by`: Admin who approved/rejected
- `decision_date`: When decision was made
- `decision_reason`: Reason for approval/rejection
- `effective_from`: When change takes effect
- `created_at`: Creation timestamp

---

### 3.6 Audit Logs Table

```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL,
    changed_by UUID REFERENCES employees(id),
    changed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    old_value JSONB,
    new_value JSONB,
    reason TEXT
);

CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_changed_date ON audit_logs(changed_date);
```

**Fields**:
- `id`: Unique identifier (UUID)
- `entity_type`: Type of entity (Employee, Team, Schedule, etc.)
- `entity_id`: ID of the entity
- `action`: 'create', 'update', 'delete', 'approve', 'reject'
- `changed_by`: User who made the change
- `changed_date`: When change was made
- `old_value`: Previous value (JSON)
- `new_value`: New value (JSON)
- `reason`: Reason for change

---

### 3.7 Office Capacity Table

```sql
CREATE TABLE office_capacity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    day_of_week INT NOT NULL,
    total_seats INT NOT NULL,
    reserved_seats INT DEFAULT 0,
    effective_from DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(day_of_week, effective_from)
);

CREATE INDEX idx_office_capacity_day ON office_capacity(day_of_week);
```

**Fields**:
- `id`: Unique identifier (UUID)
- `day_of_week`: 0=Monday, 1=Tuesday, ..., 4=Friday
- `total_seats`: Total available seats
- `reserved_seats`: Reserved seats
- `effective_from`: Date when this capacity becomes effective
- `created_at`: Creation timestamp

---

## 4. Models (Go Structs)

### 4.1 Employee Model

```go
type Employee struct {
    ID           uuid.UUID `gorm:"primaryKey"`
    Email        string    `gorm:"uniqueIndex"`
    Name         string
    PasswordHash string
    TeamID       *uuid.UUID
    Team         *Team
    Role         string // 'employee', 'team_lead', 'manager', 'admin'
    Status       string // 'active', 'inactive', 'on_leave'
    Preferences  datatypes.JSONType
    CreatedAt    time.Time
    UpdatedAt    time.Time
    DeletedAt    gorm.DeletedAt `gorm:"index"`
}
```

### 4.2 Team Model

```go
type Team struct {
    ID         uuid.UUID `gorm:"primaryKey"`
    Name       string
    Description string
    TeamLeadID *uuid.UUID
    TeamLead   *Employee
    Preferences datatypes.JSONType
    CreatedAt  time.Time
    UpdatedAt  time.Time
    DeletedAt  gorm.DeletedAt `gorm:"index"`
}
```

### 4.3 Schedule Model

```go
type Schedule struct {
    ID            uuid.UUID `gorm:"primaryKey"`
    WeekStartDate time.Time
    WeekEndDate   time.Time
    Status        string // 'draft', 'published', 'archived'
    CreatedBy     uuid.UUID
    CreatedByUser *Employee
    Entries       []ScheduleEntry
    CreatedAt     time.Time
    PublishedAt   *time.Time
    Version       int
}
```

### 4.4 Schedule Entry Model

```go
type ScheduleEntry struct {
    ID         uuid.UUID `gorm:"primaryKey"`
    ScheduleID uuid.UUID
    EmployeeID uuid.UUID
    DayOfWeek  int    // 0-4
    WorkType   string // 'office', 'wfh'
    SeatID     *uuid.UUID
    Status     string // 'assigned', 'cancelled', 'swapped'
    CreatedAt  time.Time
}
```

### 4.5 Change Request Model

```go
type ChangeRequest struct {
    ID             uuid.UUID `gorm:"primaryKey"`
    EmployeeID     uuid.UUID
    CurrentDay     int
    RequestedDay   int
    Reason         string
    Status         string // 'pending', 'approved', 'rejected', 'cancelled'
    RequestedDate  time.Time
    ApprovedBy     *uuid.UUID
    DecisionDate   *time.Time
    DecisionReason string
    EffectiveFrom  *time.Time
    CreatedAt      time.Time
}
```

---

## 5. API Specifications

### 5.1 Authentication Endpoints

#### POST /api/v1/auth/login

**Request**:
```json
{
    "email": "user@example.com",
    "password": "password123"
}
```

**Response** (200):
```json
{
    "access_token": "eyJhbGc...",
    "refresh_token": "eyJhbGc...",
    "expires_in": 3600,
    "user": {
        "id": "uuid",
        "email": "user@example.com",
        "name": "John Doe",
        "role": "admin"
    }
}
```

---

#### POST /api/v1/auth/refresh

**Request**:
```json
{
    "refresh_token": "eyJhbGc..."
}
```

**Response** (200):
```json
{
    "access_token": "eyJhbGc...",
    "expires_in": 3600
}
```

---

### 5.2 Employee Endpoints

#### GET /api/v1/admin/employees

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `team_id`: Filter by team
- `status`: Filter by status

**Response** (200):
```json
{
    "data": [
        {
            "id": "uuid",
            "email": "user@example.com",
            "name": "John Doe",
            "team_id": "uuid",
            "role": "employee",
            "status": "active"
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 20,
        "total": 100
    }
}
```

---

#### POST /api/v1/admin/employees

**Request**:
```json
{
    "email": "user@example.com",
    "name": "John Doe",
    "password": "password123",
    "team_id": "uuid",
    "role": "employee",
    "status": "active"
}
```

**Response** (201):
```json
{
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "team_id": "uuid",
    "role": "employee",
    "status": "active"
}
```

---

#### PUT /api/v1/admin/employees/{id}

**Request**:
```json
{
    "name": "John Doe Updated",
    "team_id": "uuid",
    "status": "active"
}
```

**Response** (200):
```json
{
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe Updated",
    "team_id": "uuid",
    "role": "employee",
    "status": "active"
}
```

---

#### DELETE /api/v1/admin/employees/{id}

**Response** (204): No content

---

### 5.3 Schedule Endpoints

#### POST /api/v1/admin/schedules/generate

**Request**:
```json
{
    "week_start_date": "2024-01-08",
    "week_end_date": "2024-01-12"
}
```

**Response** (201):
```json
{
    "id": "uuid",
    "week_start_date": "2024-01-08",
    "week_end_date": "2024-01-12",
    "status": "draft",
    "entries": [
        {
            "id": "uuid",
            "employee_id": "uuid",
            "day_of_week": 0,
            "work_type": "office"
        }
    ]
}
```

---

#### POST /api/v1/admin/schedules/{id}/publish

**Response** (200):
```json
{
    "id": "uuid",
    "status": "published",
    "published_at": "2024-01-05T10:00:00Z"
}
```

---

### 5.4 Change Request Endpoints

#### POST /api/v1/employee/change-requests

**Request**:
```json
{
    "current_day": 0,
    "requested_day": 2,
    "reason": "Need to attend meeting"
}
```

**Response** (201):
```json
{
    "id": "uuid",
    "employee_id": "uuid",
    "current_day": 0,
    "requested_day": 2,
    "reason": "Need to attend meeting",
    "status": "pending",
    "requested_date": "2024-01-05T10:00:00Z"
}
```

---

#### PUT /api/v1/manager/change-requests/{id}/approve

**Request**:
```json
{
    "decision_reason": "Approved"
}
```

**Response** (200):
```json
{
    "id": "uuid",
    "status": "approved",
    "decision_date": "2024-01-05T10:00:00Z"
}
```

---

## 6. Service Layer Implementation

### 6.1 Schedule Service

```go
type ScheduleService interface {
    GenerateSchedule(ctx context.Context, weekStart, weekEnd time.Time) (*Schedule, error)
    PublishSchedule(ctx context.Context, scheduleID uuid.UUID) error
    GetSchedule(ctx context.Context, scheduleID uuid.UUID) (*Schedule, error)
    UpdateScheduleEntry(ctx context.Context, entryID uuid.UUID, workType string) error
}
```

**Key Methods**:
- `GenerateSchedule`: Create schedule with fair distribution
- `PublishSchedule`: Publish and send notifications
- `GetSchedule`: Retrieve schedule with entries
- `UpdateScheduleEntry`: Modify individual entry

---

### 6.2 Change Request Service

```go
type ChangeRequestService interface {
    SubmitRequest(ctx context.Context, req *ChangeRequestInput) (*ChangeRequest, error)
    ApproveRequest(ctx context.Context, requestID uuid.UUID, reason string) error
    RejectRequest(ctx context.Context, requestID uuid.UUID, reason string) error
    GetEmployeeRequests(ctx context.Context, employeeID uuid.UUID) ([]ChangeRequest, error)
}
```

**Key Methods**:
- `SubmitRequest`: Validate and create request
- `ApproveRequest`: Approve and update schedule
- `RejectRequest`: Reject with reason
- `GetEmployeeRequests`: Get employee's requests

---

### 6.3 Capacity Manager

```go
type CapacityManager interface {
    ValidateCapacity(ctx context.Context, schedule *Schedule) error
    GetAvailableSeats(ctx context.Context, dayOfWeek int) (int, error)
    CanAccommodateChange(ctx context.Context, employeeID uuid.UUID, day int) (bool, error)
}
```

**Key Methods**:
- `ValidateCapacity`: Check if schedule exceeds capacity
- `GetAvailableSeats`: Get available seats for a day
- `CanAccommodateChange`: Check if change request can be approved

---

## 7. Validation Rules

### 7.1 Employee Validation
- Email must be unique
- Email must be valid format
- Name must not be empty
- Password must be at least 8 characters
- Role must be one of: employee, team_lead, manager, admin
- Status must be one of: active, inactive, on_leave

### 7.2 Schedule Validation
- Week start date must be Monday
- Week end date must be Friday
- Week end date must be after week start date
- Each employee must have exactly 3 office days and 2 WFH days
- Total office employees per day must not exceed capacity

### 7.3 Change Request Validation
- Current day must be 0-4
- Requested day must be 0-4
- Current day must not equal requested day
- Request must be made at least 2 days before requested day
- Requested day must have available capacity
- Change must maintain hybrid work constraint (3 office, 2 WFH)

---

## 8. Error Handling

### Standard Error Response

```json
{
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Invalid input",
        "details": [
            {
                "field": "email",
                "message": "Email is required"
            }
        ]
    }
}
```

### Error Codes
- `VALIDATION_ERROR`: Input validation failed
- `UNAUTHORIZED`: Authentication failed
- `FORBIDDEN`: Authorization failed
- `NOT_FOUND`: Resource not found
- `CONFLICT`: Resource already exists
- `INTERNAL_ERROR`: Server error

---

## 9. Testing Strategy

### 9.1 Unit Tests
- Test each service method
- Test validation logic
- Test error handling
- Target: 70%+ coverage

### 9.2 Integration Tests
- Test API endpoints
- Test database operations
- Test authentication flow
- Test schedule generation

### 9.3 Test Fixtures
- Sample employees
- Sample teams
- Sample schedules
- Sample change requests

---

## 10. Dependencies (go.mod)

```
github.com/gin-gonic/gin v1.9.1
gorm.io/gorm v1.25.0
gorm.io/driver/postgres v1.5.0
github.com/golang-jwt/jwt/v5 v5.0.0
golang.org/x/crypto v0.14.0
github.com/google/uuid v1.3.0
go.uber.org/zap v1.26.0
github.com/joho/godotenv v1.5.1
github.com/rabbitmq/amqp091-go v1.9.0
github.com/redis/go-redis/v9 v9.0.0
```

---

## 11. Configuration

### Environment Variables

```env
# Server
GO_ENV=development
PORT=8080

# Database
DATABASE_URL=postgres://postgres:postgres@postgres:5432/office_allocation

# Redis
REDIS_URL=redis://redis:6379

# RabbitMQ
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672/

# JWT
JWT_SECRET=dev-secret-key
JWT_EXPIRY=3600
REFRESH_TOKEN_EXPIRY=604800

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-password
```

---

## 12. Deployment Checklist

- [ ] All tests passing
- [ ] Code coverage > 70%
- [ ] API documentation complete
- [ ] Database migrations tested
- [ ] Docker image builds
- [ ] Environment variables configured
- [ ] Error handling comprehensive
- [ ] Logging configured
- [ ] Security review completed

---

**Document Version**: 1.0  
**Created**: [Current Date]  
**Status**: Phase 1 Backend Implementation
