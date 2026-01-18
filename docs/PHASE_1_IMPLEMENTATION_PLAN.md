# Phase 1 Implementation Plan
## Office Workspace Seat Allocation System - MVP (Weeks 1-4)

---

## 1. Overview

Phase 1 focuses on building the Minimum Viable Product (MVP) with core functionality. The system will be a monolithic application with basic features for schedule generation, employee management, and change request handling.

**Timeline**: 4 weeks  
**Team Size**: 2-3 developers (1 backend, 1 frontend, 1 DevOps/QA)  
**Deliverables**: Functional MVP with Docker deployment

---

## 2. High-Level Objectives

1. ✓ Setup development environment with Docker
2. ✓ Implement database schema and migrations
3. ✓ Build authentication system (JWT)
4. ✓ Create admin portal for employee/team management
5. ✓ Create employee portal for schedule viewing
6. ✓ Implement basic schedule generation algorithm
7. ✓ Implement change request workflow
8. ✓ Setup email notifications
9. ✓ Deploy locally with Docker Compose

---

## 3. Weekly Breakdown

### Week 1: Foundation & Setup

#### Backend (Days 1-5)
- [ ] Setup Go project structure
- [ ] Configure dependencies (Gin, GORM, PostgreSQL driver)
- [ ] Create database connection and configuration
- [ ] Write database migrations (001_initial_schema.sql)
- [ ] Setup logging with Zap
- [ ] Create models (Employee, Team, Schedule, ChangeRequest, AuditLog)
- [ ] Setup error handling middleware
- [ ] Create Dockerfile for backend

**Deliverables**:
- Go project with all dependencies
- Database schema created
- Models defined
- Docker image builds successfully

#### Frontend (Days 1-5)
- [ ] Setup React + TypeScript project with Vite
- [ ] Configure Redux Toolkit for state management
- [ ] Setup Material-UI (MUI) components
- [ ] Create project folder structure
- [ ] Setup API client (Axios)
- [ ] Create authentication types and interfaces
- [ ] Create Dockerfile for frontend
- [ ] Setup environment configuration

**Deliverables**:
- React project with all dependencies
- Folder structure organized
- Build process working
- Docker image builds successfully

#### DevOps (Days 1-5)
- [ ] Create docker-compose.yml with all services
- [ ] Setup PostgreSQL container with initialization
- [ ] Setup Redis container
- [ ] Setup RabbitMQ container
- [ ] Create .env.example files
- [ ] Document local setup process
- [ ] Test all containers start correctly

**Deliverables**:
- docker-compose.yml configured
- All services running locally
- Documentation for setup

---

### Week 2: Authentication & Core APIs

#### Backend (Days 6-10)
- [ ] Implement JWT authentication middleware
- [ ] Create auth handler (login, logout, refresh)
- [ ] Implement password hashing (bcrypt)
- [ ] Create Employee CRUD APIs
- [ ] Create Team CRUD APIs
- [ ] Implement role-based access control (RBAC)
- [ ] Create audit logging for all operations
- [ ] Write unit tests for auth and CRUD operations

**Deliverables**:
- Authentication working end-to-end
- Employee management APIs functional
- Team management APIs functional
- Audit logs being recorded

#### Frontend (Days 6-10)
- [ ] Create Login page component
- [ ] Implement authentication service
- [ ] Setup Redux auth slice
- [ ] Create protected route wrapper
- [ ] Create Admin Dashboard layout
- [ ] Create Employee list component (read-only for now)
- [ ] Create Team list component (read-only for now)
- [ ] Setup API interceptors for JWT tokens

**Deliverables**:
- Login page working
- Authentication flow complete
- Admin dashboard accessible
- Protected routes working

#### Integration (Days 6-10)
- [ ] Test backend APIs with Postman/Insomnia
- [ ] Test frontend login flow
- [ ] Verify JWT token refresh
- [ ] Test RBAC enforcement

---

### Week 3: Schedule Management & Change Requests

#### Backend (Days 11-15)
- [ ] Implement basic schedule generation algorithm
- [ ] Create schedule generation API
- [ ] Implement schedule publishing API
- [ ] Create schedule retrieval APIs
- [ ] Implement change request submission API
- [ ] Implement change request approval/rejection API
- [ ] Implement 2-day advance notice validation
- [ ] Implement hybrid work constraint validation (3 office, 2 WFH)
- [ ] Create notification service (email)
- [ ] Write integration tests

**Deliverables**:
- Schedule generation working
- Change request workflow functional
- Validation rules enforced
- Email notifications sending

#### Frontend (Days 11-15)
- [ ] Create Schedule Generation page (admin)
- [ ] Create Schedule View page (employee)
- [ ] Create Change Request Form component
- [ ] Create Change Request History component
- [ ] Implement schedule display with office/WFH days
- [ ] Add form validation for change requests
- [ ] Create notification display component
- [ ] Setup Redux slices for schedules and change requests

**Deliverables**:
- Admin can generate schedules
- Employees can view schedules
- Employees can submit change requests
- Change request history visible

#### Integration (Days 11-15)
- [ ] Test end-to-end schedule generation
- [ ] Test change request submission and approval
- [ ] Verify email notifications
- [ ] Test hybrid work constraint validation

---

### Week 4: Polish & Deployment

#### Backend (Days 16-20)
- [ ] Add comprehensive error handling
- [ ] Implement request validation
- [ ] Add rate limiting
- [ ] Create API documentation (Swagger)
- [ ] Performance optimization (add caching)
- [ ] Write remaining unit tests (target 70%+ coverage)
- [ ] Setup logging for debugging
- [ ] Final security review

**Deliverables**:
- API documentation complete
- Error handling comprehensive
- Tests passing
- Performance acceptable

#### Frontend (Days 16-20)
- [ ] Add loading states to all components
- [ ] Implement error handling and display
- [ ] Add success/failure notifications
- [ ] Responsive design for mobile
- [ ] Add basic styling with Tailwind CSS
- [ ] Performance optimization
- [ ] Write component tests
- [ ] Final UI/UX review

**Deliverables**:
- UI polished and responsive
- Error handling complete
- Tests passing
- Ready for user testing

#### DevOps & Testing (Days 16-20)
- [ ] Setup CI/CD pipeline (GitHub Actions - basic)
- [ ] Create comprehensive test suite
- [ ] Performance testing
- [ ] Security testing (basic)
- [ ] Create deployment documentation
- [ ] Create user documentation
- [ ] Final integration testing

**Deliverables**:
- CI/CD pipeline working
- All tests passing
- Documentation complete
- Ready for deployment

---

## 4. Detailed Task Breakdown

### Backend Tasks

#### 4.1 Project Setup
```
Task: Setup Go project structure
Subtasks:
  - Initialize Go module
  - Add dependencies (gin, gorm, postgres, redis, rabbitmq, zap, jwt)
  - Create folder structure
  - Setup configuration management
  - Create Dockerfile
Estimated Time: 4 hours
```

#### 4.2 Database Layer
```
Task: Create database schema and migrations
Subtasks:
  - Design schema (employees, teams, schedules, change_requests, audit_logs)
  - Write migration files
  - Create indexes
  - Setup database connection pooling
  - Create database initialization script
Estimated Time: 8 hours
```

#### 4.3 Models & Repositories
```
Task: Define models and repository pattern
Subtasks:
  - Create Employee model
  - Create Team model
  - Create Schedule model
  - Create ChangeRequest model
  - Create AuditLog model
  - Implement repository interfaces
  - Implement GORM-based repositories
Estimated Time: 12 hours
```

#### 4.4 Authentication
```
Task: Implement JWT authentication
Subtasks:
  - Create JWT token generation
  - Create JWT validation middleware
  - Implement password hashing
  - Create login endpoint
  - Create logout endpoint
  - Create token refresh endpoint
  - Implement RBAC middleware
Estimated Time: 10 hours
```

#### 4.5 Employee Management APIs
```
Task: Create employee CRUD endpoints
Subtasks:
  - GET /api/v1/admin/employees (list)
  - POST /api/v1/admin/employees (create)
  - PUT /api/v1/admin/employees/{id} (update)
  - DELETE /api/v1/admin/employees/{id} (delete)
  - POST /api/v1/admin/employees/bulk-import (bulk import)
  - Add validation
  - Add audit logging
Estimated Time: 10 hours
```

#### 4.6 Team Management APIs
```
Task: Create team CRUD endpoints
Subtasks:
  - GET /api/v1/admin/teams (list)
  - POST /api/v1/admin/teams (create)
  - PUT /api/v1/admin/teams/{id} (update)
  - GET /api/v1/admin/teams/{id}/members (get members)
  - Add validation
  - Add audit logging
Estimated Time: 8 hours
```

#### 4.7 Schedule Generation
```
Task: Implement schedule generation algorithm
Subtasks:
  - Create basic algorithm (round-robin with constraints)
  - Validate hybrid work constraint (3 office, 2 WFH)
  - Validate capacity constraints
  - Create schedule generation endpoint
  - Create schedule publishing endpoint
  - Create schedule retrieval endpoints
  - Add audit logging
Estimated Time: 16 hours
```

#### 4.8 Change Request Workflow
```
Task: Implement change request handling
Subtasks:
  - Create change request submission endpoint
  - Implement 2-day advance notice validation
  - Create approval endpoint
  - Create rejection endpoint
  - Validate hybrid work constraint on approval
  - Validate capacity on approval
  - Add audit logging
  - Send notifications
Estimated Time: 14 hours
```

#### 4.9 Notifications
```
Task: Setup email notification service
Subtasks:
  - Configure email service (SMTP)
  - Create email templates
  - Implement notification service
  - Send notifications on schedule publish
  - Send notifications on change request approval/rejection
  - Setup RabbitMQ for async notifications
Estimated Time: 10 hours
```

#### 4.10 Testing & Documentation
```
Task: Write tests and API documentation
Subtasks:
  - Write unit tests for services
  - Write integration tests for APIs
  - Create Swagger/OpenAPI documentation
  - Setup test database
  - Create test fixtures
Estimated Time: 12 hours
```

**Total Backend Time**: ~104 hours (26 hours/week)

---

### Frontend Tasks

#### 4.1 Project Setup
```
Task: Setup React + TypeScript project
Subtasks:
  - Initialize Vite project
  - Add dependencies (React, TypeScript, Redux, MUI, Axios)
  - Create folder structure
  - Setup environment configuration
  - Create Dockerfile
Estimated Time: 4 hours
```

#### 4.2 Authentication UI
```
Task: Create login page and auth flow
Subtasks:
  - Create Login page component
  - Create authentication service
  - Setup Redux auth slice
  - Create protected route wrapper
  - Implement token storage (localStorage)
  - Implement token refresh logic
  - Add form validation
Estimated Time: 10 hours
```

#### 4.3 Admin Portal - Employee Management
```
Task: Create employee management UI
Subtasks:
  - Create Employee list page
  - Create Employee add/edit form
  - Create Employee delete confirmation
  - Implement pagination
  - Add search/filter
  - Add form validation
  - Add loading states
  - Add error handling
Estimated Time: 14 hours
```

#### 4.4 Admin Portal - Team Management
```
Task: Create team management UI
Subtasks:
  - Create Team list page
  - Create Team add/edit form
  - Create Team member assignment
  - Implement pagination
  - Add search/filter
  - Add form validation
  - Add loading states
  - Add error handling
Estimated Time: 12 hours
```

#### 4.5 Admin Portal - Schedule Generation
```
Task: Create schedule generation UI
Subtasks:
  - Create Schedule generation page
  - Create form for generation parameters
  - Display generated schedule
  - Add manual adjustment capability
  - Create publish button
  - Add confirmation dialog
  - Add success/error messages
Estimated Time: 12 hours
```

#### 4.6 Employee Portal - Schedule View
```
Task: Create employee schedule view
Subtasks:
  - Create Schedule view page
  - Display 4-week schedule
  - Show office/WFH days clearly
  - Add calendar view option
  - Add export to calendar
  - Add responsive design
Estimated Time: 10 hours
```

#### 4.7 Employee Portal - Change Requests
```
Task: Create change request UI
Subtasks:
  - Create Change request form
  - Implement day selection
  - Add reason input
  - Validate 2-day advance notice
  - Show available seats
  - Create request history view
  - Add request status display
  - Add cancel request button
Estimated Time: 12 hours
```

#### 4.8 Styling & Responsive Design
```
Task: Apply styling and make responsive
Subtasks:
  - Setup Tailwind CSS
  - Create reusable components
  - Apply MUI theme
  - Make all pages responsive
  - Add dark mode support (optional)
  - Optimize for mobile
Estimated Time: 10 hours
```

#### 4.9 State Management
```
Task: Setup Redux for state management
Subtasks:
  - Create auth slice
  - Create employee slice
  - Create team slice
  - Create schedule slice
  - Create change request slice
  - Setup Redux middleware
  - Create custom hooks
Estimated Time: 10 hours
```

#### 4.10 Testing & Documentation
```
Task: Write tests and documentation
Subtasks:
  - Write component tests
  - Write integration tests
  - Create user documentation
  - Create developer documentation
  - Setup test fixtures
Estimated Time: 10 hours
```

**Total Frontend Time**: ~104 hours (26 hours/week)

---

## 5. API Endpoints for Phase 1

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

---

## 6. Database Schema for Phase 1

See BACKEND_PHASE_1_DETAILED_PLAN.md for complete schema

---

## 7. Deliverables Checklist

### Week 1
- [ ] Go project setup complete
- [ ] React project setup complete
- [ ] Docker Compose configuration working
- [ ] Database schema created
- [ ] All services running locally

### Week 2
- [ ] Authentication working end-to-end
- [ ] Employee CRUD APIs functional
- [ ] Team CRUD APIs functional
- [ ] Login page working
- [ ] Admin dashboard accessible

### Week 3
- [ ] Schedule generation working
- [ ] Change request workflow functional
- [ ] Employee schedule view working
- [ ] Change request form working
- [ ] Email notifications sending

### Week 4
- [ ] All features polished
- [ ] Tests passing (70%+ coverage)
- [ ] API documentation complete
- [ ] User documentation complete
- [ ] Ready for deployment

---

## 8. Risk & Mitigation

| Risk | Mitigation |
|------|-----------|
| Database schema changes | Use migrations, version control |
| API integration issues | Early integration testing, Postman tests |
| Performance issues | Profiling, caching, query optimization |
| Scope creep | Strict adherence to Phase 1 scope |
| Team communication | Daily standups, clear documentation |

---

## 9. Success Criteria

- ✓ All Phase 1 features implemented
- ✓ 70%+ test coverage
- ✓ Zero critical bugs
- ✓ All APIs documented
- ✓ Docker deployment working
- ✓ Performance targets met (< 2s API response)
- ✓ User documentation complete

---

**Document Version**: 1.0  
**Created**: [Current Date]  
**Next Phase**: Phase 2 Enhancement (Weeks 5-8)
