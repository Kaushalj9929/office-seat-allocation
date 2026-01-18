# Technical Implementation Document
## Office Workspace Seat Allocation System

---

## 1. Overview

This document outlines the technical architecture, implementation strategy, and scalability approach for the Office Workspace Seat Allocation System. The system is designed as a monolithic application for initial deployment with a clear migration path to microservices as the system scales.

---

## 2. Technology Stack

### Backend
- **Language**: Go (Golang)
- **Framework**: Gin Web Framework
- **Database**: PostgreSQL (primary), Redis (caching)
- **ORM**: GORM
- **Authentication**: JWT with OAuth 2.0 support
- **Message Queue**: RabbitMQ (for async notifications)
- **Logging**: Zap (structured logging)
- **Testing**: Go testing package + Testify

### Frontend
- **Framework**: React 18+
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **UI Library**: Material-UI (MUI)
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Testing**: Vitest + React Testing Library
- **Styling**: Tailwind CSS

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Docker Compose (MVP), Kubernetes (Phase 2+)
- **CI/CD**: GitHub Actions
- **Hosting**: AWS (EC2, RDS, ElastiCache, SQS)
- **Monitoring**: CloudWatch + Prometheus
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)

### Development Tools
- **Version Control**: Git
- **API Documentation**: Swagger/OpenAPI
- **Database Migration**: Flyway
- **Code Quality**: SonarQube, golangci-lint

---

## 3. Architecture Overview

### 3.1 Monolithic Architecture (MVP & Phase 1)

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                          │
│  - Admin Portal (Employee/Team Management)                  │
│  - Employee Portal (Schedule View & Change Requests)        │
│  - Manager Dashboard (Team Schedule Management)             │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTPS
┌────────────────────▼────────────────────────────────────────┐
│              API Gateway / Load Balancer                     │
│  (Nginx / AWS ALB)                                          │
└────────────────────┬────────────────────────────────────────┘
                     │
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
│  │ - ScheduleService (generation, publishing)           │  │
│  │ - ChangeRequestService (validation, approval)        │  │
│  │ - CapacityManager (constraint checking)              │  │
│  │ - EmployeeService (CRUD operations)                  │  │
│  │ - TeamService (team management)                      │  │
│  │ - NotificationService (email, in-app)                │  │
│  │ - ReportingService (analytics, exports)              │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Data Access Layer (GORM)                             │  │
│  │ - Repository Pattern Implementation                  │  │
│  │ - Query Optimization                                 │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
┌───────▼──┐  ┌──────▼──┐  ┌─────▼──────┐
│PostgreSQL│  │  Redis  │  │ RabbitMQ   │
│ (Primary)│  │ (Cache) │  │(Async Jobs)│
└──────────┘  └─────────┘  └────────────┘
```

### 3.2 Microservices Architecture (Phase 3+)

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                          │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│              API Gateway (Kong / AWS API Gateway)            │
│  - Request Routing                                          │
│  - Rate Limiting                                            │
│  - Authentication                                           │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┬────────────┐
        │            │            │            │
┌───────▼──────┐ ┌──▼────────┐ ┌─▼──────────┐ ┌─▼──────────┐
│ Schedule     │ │ Employee  │ │ Change     │ │ Notification
│ Service      │ │ Service   │ │ Request    │ │ Service
│              │ │           │ │ Service    │ │
│ - Generate   │ │ - CRUD    │ │ - Validate │ │ - Email
│ - Publish    │ │ - Prefs   │ │ - Approve  │ │ - In-app
│ - Archive    │ │ - Teams   │ │ - Track    │ │ - SMS
└──────────────┘ └───────────┘ └────────────┘ └────────────┘
        │            │            │            │
        └────────────┼────────────┴────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
┌───────▼──┐  ┌──────▼──┐  ┌─────▼──────┐
│PostgreSQL│  │  Redis  │  │ RabbitMQ   │
│ (Shared) │  │ (Cache) │  │(Event Bus) │
└──────────┘  └─────────┘  └────────────┘
```

---

## 4. Project Structure (Monolithic)

```
office-seat-allocation/
├── backend/
│   ├── cmd/
│   │   └── main.go                 # Application entry point
│   ├── internal/
│   │   ├── config/
│   │   │   └── config.go           # Configuration management
│   │   ├── models/
│   │   │   ├── employee.go
│   │   │   ├── team.go
│   │   │   ├── schedule.go
│   │   │   ├── change_request.go
│   │   │   └── audit_log.go
│   │   ├── handlers/
│   │   │   ├── auth_handler.go
│   │   │   ├── employee_handler.go
│   │   │   ├── team_handler.go
│   │   │   ├── schedule_handler.go
│   │   │   ├── change_request_handler.go
│   │   │   └── report_handler.go
│   │   ├── services/
│   │   │   ├── schedule_service.go
│   │   │   ├── change_request_service.go
│   │   │   ├── capacity_manager.go
│   │   │   ├── employee_service.go
│   │   │   ├── team_service.go
│   │   │   ├── notification_service.go
│   │   │   └── reporting_service.go
│   │   ├── repositories/
│   │   │   ├── employee_repo.go
│   │   │   ├── team_repo.go
│   │   │   ├── schedule_repo.go
│   │   │   ├── change_request_repo.go
│   │   │   └── audit_log_repo.go
│   │   ├── middleware/
│   │   │   ├── auth_middleware.go
│   │   │   ├── error_handler.go
│   │   │   └── logging_middleware.go
│   │   ├── utils/
│   │   │   ├── validators.go
│   │   │   ├── helpers.go
│   │   │   └── constants.go
│   │   └── database/
│   │       ├── migrations/
│   │       │   ├── 001_initial_schema.sql
│   │       │   ├── 002_add_team_preferences.sql
│   │       │   └── 003_add_audit_logs.sql
│   │       └── db.go
│   ├── go.mod
│   ├── go.sum
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Admin/
│   │   │   │   ├── EmployeeManagement.tsx
│   │   │   │   ├── TeamManagement.tsx
│   │   │   │   └── ScheduleGenerator.tsx
│   │   │   ├── Employee/
│   │   │   │   ├── ScheduleView.tsx
│   │   │   │   ├── ChangeRequestForm.tsx
│   │   │   │   └── RequestHistory.tsx
│   │   │   ├── Manager/
│   │   │   │   ├── TeamSchedule.tsx
│   │   │   │   └── BulkRequestForm.tsx
│   │   │   └── Common/
│   │   │       ├── Header.tsx
│   │   │       ├── Sidebar.tsx
│   │   │       └── NotificationCenter.tsx
│   │   ├── pages/
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── EmployeeDashboard.tsx
│   │   │   ├── ManagerDashboard.tsx
│   │   │   └── Login.tsx
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── authService.ts
│   │   │   ├── scheduleService.ts
│   │   │   ├── changeRequestService.ts
│   │   │   └── employeeService.ts
│   │   ├── store/
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.ts
│   │   │   │   ├── scheduleSlice.ts
│   │   │   │   └── changeRequestSlice.ts
│   │   │   └── store.ts
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── useSchedule.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── .env.example
├── docker-compose.yml
├── .github/
│   └── workflows/
│       ├── backend-ci.yml
│       └── frontend-ci.yml
└── README.md
```

---

## 5. Implementation Phases

### Phase 1: MVP (Weeks 1-4)

**Objectives**: Core functionality with monolithic architecture

**Backend Tasks**:
1. Setup Go project structure and dependencies
2. Database schema and migrations
3. Authentication & Authorization (JWT)
4. Employee & Team CRUD APIs
5. Basic schedule generation algorithm
6. Change request validation and approval workflow
7. Email notification service
8. Admin portal APIs

**Frontend Tasks**:
1. Setup React + TypeScript project
2. Authentication UI (Login)
3. Admin portal:
   - Employee management (add, edit, list)
   - Team management (create, assign members)
   - Schedule generation & publishing
4. Employee portal:
   - View personal schedule
   - Submit change requests
5. Basic styling with MUI

**Deliverables**:
- Functional monolithic application
- Docker containers for backend and frontend
- Basic API documentation
- Database migrations

**Timeline**: 4 weeks

---

### Phase 2: Enhancement & Optimization (Weeks 5-8)

**Objectives**: Advanced features and performance optimization

**Backend Tasks**:
1. Advanced scheduling algorithm (fairness, team preferences)
2. Bulk change request handling
3. Capacity conflict resolution
4. Reporting and analytics APIs
5. Calendar export functionality
6. Performance optimization (caching, query optimization)
7. Comprehensive logging and monitoring

**Frontend Tasks**:
1. Manager dashboard (team schedule view)
2. Bulk change request UI
3. Advanced reporting dashboard
4. Calendar integration
5. Mobile-responsive design
6. Real-time notifications (WebSocket)

**Deliverables**:
- Enhanced feature set
- Performance benchmarks
- Monitoring dashboards
- User documentation

**Timeline**: 4 weeks

---

### Phase 3: Scalability & Microservices (Weeks 9-16)

**Objectives**: Prepare for multi-office expansion

**Backend Tasks**:
1. Refactor monolith into microservices:
   - Schedule Service
   - Employee Service
   - Change Request Service
   - Notification Service
2. Implement API Gateway
3. Service-to-service communication (gRPC)
4. Event-driven architecture (RabbitMQ/Kafka)
5. Distributed tracing (Jaeger)
6. Multi-office support (tenant isolation)

**Frontend Tasks**:
1. Multi-office support UI
2. Advanced analytics dashboard
3. Admin controls for multi-office management
4. Performance optimization

**Infrastructure Tasks**:
1. Kubernetes deployment configuration
2. Auto-scaling policies
3. Database replication strategy
4. Disaster recovery plan

**Deliverables**:
- Microservices architecture
- Kubernetes manifests
- Multi-office support
- Scalability documentation

**Timeline**: 8 weeks

---

### Phase 4: Production Hardening & Maintenance (Ongoing)

**Objectives**: Stability, security, and continuous improvement

**Tasks**:
1. Security audits and penetration testing
2. Performance tuning based on real usage
3. User feedback incorporation
4. Feature enhancements
5. Compliance and audit improvements
6. Disaster recovery drills

---

## 6. Database Schema (PostgreSQL)

### Core Tables

```sql
-- Employees
CREATE TABLE employees (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    team_id UUID REFERENCES teams(id),
    role VARCHAR(50) NOT NULL, -- 'employee', 'team_lead', 'manager', 'admin'
    status VARCHAR(50) NOT NULL, -- 'active', 'inactive', 'on_leave'
    preferences JSONB, -- office day preferences
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Teams
CREATE TABLE teams (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    team_lead_id UUID REFERENCES employees(id),
    preferences JSONB, -- team office day preferences
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Schedules
CREATE TABLE schedules (
    id UUID PRIMARY KEY,
    week_start_date DATE NOT NULL,
    week_end_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL, -- 'draft', 'published', 'archived'
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
    day_of_week INT NOT NULL, -- 0=Monday, 4=Friday
    work_type VARCHAR(50) NOT NULL, -- 'office', 'wfh'
    seat_id UUID,
    status VARCHAR(50) NOT NULL, -- 'assigned', 'cancelled', 'swapped'
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
    status VARCHAR(50) NOT NULL, -- 'pending', 'approved', 'rejected', 'cancelled'
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
- `POST /api/v1/admin/employees/bulk-import` - Bulk import employees

### Teams (Admin)
- `GET /api/v1/admin/teams` - List all teams
- `POST /api/v1/admin/teams` - Create team
- `PUT /api/v1/admin/teams/{id}` - Update team
- `GET /api/v1/admin/teams/{id}/members` - Get team members

### Schedules (Admin)
- `POST /api/v1/admin/schedules/generate` - Generate weekly schedule
- `GET /api/v1/admin/schedules/{id}` - Get schedule details
- `PUT /api/v1/admin/schedules/{id}` - Update schedule
- `POST /api/v1/admin/schedules/{id}/publish` - Publish schedule
- `GET /api/v1/admin/schedules/{id}/entries` - Get schedule entries

### Change Requests (Employee)
- `GET /api/v1/employee/schedule` - Get personal schedule
- `POST /api/v1/employee/change-requests` - Submit change request
- `GET /api/v1/employee/change-requests` - Get personal change requests
- `DELETE /api/v1/employee/change-requests/{id}` - Cancel change request

### Change Requests (Manager/Admin)
- `GET /api/v1/manager/change-requests` - Get team change requests
- `PUT /api/v1/manager/change-requests/{id}/approve` - Approve request
- `PUT /api/v1/manager/change-requests/{id}/reject` - Reject request

### Reports (Admin)
- `GET /api/v1/admin/reports/capacity-utilization` - Capacity report
- `GET /api/v1/admin/reports/fairness-analysis` - Fairness report
- `GET /api/v1/admin/reports/change-requests-stats` - Change request stats

---

## 8. Key Algorithms

### 8.1 Schedule Generation Algorithm

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

### 8.2 Capacity Validation

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

### 8.3 Hybrid Work Constraint Validation

```go
func ValidateHybridConstraint(employee Employee, schedule Schedule) bool {
    officeCount := CountOfficeDay(employee, schedule)
    wfhCount := CountWFHDay(employee, schedule)
    return officeCount == 3 && wfhCount == 2
}
```

---

## 9. Scalability Strategy

### Current State (MVP - Single Office)
- Monolithic architecture
- Single PostgreSQL database
- Redis for caching
- RabbitMQ for async jobs
- Horizontal scaling via load balancer

### Phase 2 (Multi-Office Ready)
- Tenant isolation at database level
- Separate schemas per office or shared schema with office_id
- API versioning for backward compatibility

### Phase 3+ (Multi-Office Microservices)
- Microservices per domain
- API Gateway for routing
- Service discovery (Consul/Kubernetes DNS)
- Event-driven communication
- Database per service (if needed)
- Distributed caching (Redis Cluster)
- Message queue scaling (Kafka)

### Scaling Considerations

**Database Scaling**:
- Read replicas for reporting queries
- Connection pooling (PgBouncer)
- Partitioning by office_id for multi-office
- Archive old schedules to separate storage

**Application Scaling**:
- Horizontal scaling with load balancer
- Stateless design (JWT for auth)
- Cache frequently accessed data
- Async processing for heavy operations

**Infrastructure Scaling**:
- Kubernetes for orchestration
- Auto-scaling based on CPU/memory
- CDN for static assets
- Multi-region deployment (future)

---

## 10. Security Considerations

### Authentication & Authorization
- JWT tokens with 1-hour expiry
- Refresh tokens with 7-day expiry
- Role-based access control (RBAC)
- MFA for admin users

### Data Protection
- Encryption at rest (AES-256)
- Encryption in transit (TLS 1.2+)
- Password hashing (bcrypt)
- Sensitive data masking in logs

### API Security
- Rate limiting (100 requests/minute per user)
- CORS configuration
- CSRF protection
- Input validation and sanitization
- SQL injection prevention (parameterized queries)

### Audit & Compliance
- Immutable audit logs
- Data retention policies
- GDPR compliance (right to be forgotten)
- Regular security audits

---

## 11. Deployment Strategy

### Development Environment
```bash
docker-compose up -d
# Starts: PostgreSQL, Redis, RabbitMQ, Backend, Frontend
```

### Staging Environment
- AWS EC2 instances
- RDS for PostgreSQL
- ElastiCache for Redis
- SQS for message queue
- CloudFront for CDN

### Production Environment
- Kubernetes cluster (EKS)
- RDS Multi-AZ
- ElastiCache Cluster
- Application Load Balancer
- CloudWatch monitoring
- Automated backups

---

## 12. Monitoring & Observability

### Metrics
- API response time (p50, p95, p99)
- Error rate by endpoint
- Database query performance
- Cache hit ratio
- Queue depth
- Active user count

### Logging
- Structured logging (JSON format)
- Log levels: DEBUG, INFO, WARN, ERROR
- Centralized logging (ELK Stack)
- Log retention: 30 days

### Tracing
- Distributed tracing (Jaeger)
- Trace sampling: 10% in production
- Trace retention: 7 days

### Alerting
- High error rate (> 1%)
- API latency (> 2 seconds)
- Database connection pool exhaustion
- Queue backlog
- Disk space usage

---

## 13. Development Workflow

### Backend Development
```bash
# Setup
go mod download
go mod tidy

# Run locally
go run cmd/main.go

# Tests
go test ./...

# Linting
golangci-lint run

# Build
go build -o bin/app cmd/main.go
```

### Frontend Development
```bash
# Setup
npm install

# Run dev server
npm run dev

# Tests
npm run test

# Build
npm run build

# Lint
npm run lint
```

### Database Migrations
```bash
# Create migration
flyway migrate -locations=filesystem:db/migrations

# Rollback
flyway undo
```

---

## 14. Testing Strategy

### Backend Testing
- Unit tests: 80%+ coverage
- Integration tests: Database, API endpoints
- Load testing: 1000 concurrent users
- Security testing: OWASP Top 10

### Frontend Testing
- Component tests: React Testing Library
- Integration tests: User workflows
- E2E tests: Cypress
- Visual regression: Percy

### Performance Testing
- Schedule generation: < 30 seconds for 500 employees
- Change request processing: < 5 seconds
- API response time: < 2 seconds (p95)

---

## 15. Rollback Strategy

### Database Rollback
- Automated backups every 6 hours
- Point-in-time recovery capability
- Test rollback procedures monthly

### Application Rollback
- Blue-green deployment
- Canary releases (5% → 25% → 100%)
- Automated rollback on error rate spike

---

## 16. Cost Estimation (AWS)

### MVP Phase (Monthly)
- EC2 (t3.medium): $30
- RDS (db.t3.small): $30
- ElastiCache (cache.t3.micro): $15
- Data transfer: $10
- **Total**: ~$85/month

### Phase 2 (Monthly)
- EC2 (2x t3.medium): $60
- RDS (db.t3.medium): $60
- ElastiCache (cache.t3.small): $30
- SQS: $5
- CloudFront: $20
- **Total**: ~$175/month

### Phase 3+ (Monthly)
- EKS cluster: $73
- EC2 (3x t3.medium): $90
- RDS (db.t3.large Multi-AZ): $120
- ElastiCache Cluster: $50
- Data transfer: $50
- **Total**: ~$383/month

---

## 17. Future Enhancements

- AI-powered scheduling optimization
- Mobile native apps (iOS/Android)
- Slack/Teams integration
- Desk booking system integration
- Meeting room coordination
- Advanced analytics with BI tools
- Multi-language support
- Accessibility improvements (WCAG 2.1 AAA)

---

**Document Version**: 1.0  
**Last Updated**: [Current Date]  
**Next Review Date**: [Date + 3 months]
