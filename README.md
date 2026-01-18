# Office Workspace Seat Allocation System

A comprehensive scheduling and management platform for optimizing limited office seating resources in hybrid work environments.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [Support](#support)

---

## 🎯 Overview

The Office Workspace Seat Allocation System automates the scheduling of employees in a hybrid work model where:
- **3 days/week** in office
- **2 days/week** work from home
- Limited office seating capacity

The system intelligently allocates seats, manages change requests, and provides comprehensive analytics.

---

## ✨ Features

### Phase 1 (MVP)
- ✓ Employee and team management
- ✓ Automated schedule generation
- ✓ Change request workflow
- ✓ Email notifications
- ✓ Admin and employee portals

### Phase 2 (Enhancement)
- ✓ Advanced fairness-aware scheduling
- ✓ Bulk change requests
- ✓ Comprehensive reporting and analytics
- ✓ Real-time notifications (WebSocket)
- ✓ Manager dashboard
- ✓ Calendar integration
- ✓ Mobile-responsive design

### Phase 3+ (Future)
- Microservices architecture
- Multi-office support
- Kubernetes deployment
- Advanced analytics

---

## 🛠 Tech Stack

### Backend
- **Language**: Go 1.21+
- **Framework**: Gin Web Framework
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Message Queue**: RabbitMQ 3.12
- **Authentication**: JWT

### Frontend
- **Framework**: React 18+
- **Language**: TypeScript 5+
- **State Management**: Redux Toolkit
- **UI Library**: Material-UI (MUI)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Version Control**: Git

---

## 📦 Prerequisites

### Required
- Docker Desktop (latest version)
- Docker Compose (v2.0+)
- Git
- Node.js 18+ (for local frontend development)
- Go 1.21+ (for local backend development)

### Optional
- Postman/Insomnia (for API testing)
- VS Code with extensions:
  - Go extension
  - ES7+ React/Redux/React-Native snippets
  - Prettier
  - ESLint

---

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone <repository-url>
cd office-seat-allocation
```

### 2. Setup Environment

```bash
# Copy environment template
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Update .env files if needed (defaults work for local development)
```

### 3. Start Services

```bash
# Start all services with Docker Compose
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

### 4. Access Applications

| Service | URL | Credentials |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | admin@example.com / password |
| Backend API | http://localhost:8080/api/v1 | - |
| API Docs | http://localhost:8080/swagger | - |
| RabbitMQ UI | http://localhost:15672 | guest / guest |
| Database | localhost:5432 | postgres / postgres |

### 5. Verify Setup

```bash
# Test backend health
curl http://localhost:8080/health

# Test frontend
open http://localhost:3000
```

---

## 📁 Project Structure

```
office-seat-allocation/
├── backend/                          # Go backend application
│   ├── cmd/main.go                  # Entry point
│   ├── internal/                    # Internal packages
│   │   ├── config/                  # Configuration
│   │   ├── models/                  # Data models
│   │   ├── handlers/                # HTTP handlers
│   │   ├── services/                # Business logic
│   │   ├── repositories/            # Data access
│   │   ├── middleware/              # HTTP middleware
│   │   ├── utils/                   # Utilities
│   │   ├── database/                # Database setup
│   │   └── routes/                  # Route definitions
│   ├── tests/                       # Test files
│   ├── docs/                        # Backend documentation
│   │   ├── BACKEND_PHASE_1_DETAILED_PLAN.md
│   │   └── BACKEND_PHASE_2_DETAILED_PLAN.md
│   ├── Dockerfile                   # Docker image
│   ├── go.mod                       # Go dependencies
│   └── README.md                    # Backend documentation
│
├── frontend/                         # React frontend application
│   ├── src/
│   │   ├── components/              # React components
│   │   ├── pages/                   # Page components
│   │   ├── services/                # API services
│   │   ├── store/                   # Redux store
│   │   ├── hooks/                   # Custom hooks
│   │   ├── types/                   # TypeScript types
│   │   ├── utils/                   # Utilities
│   │   ├── App.tsx                  # Root component
│   │   └── main.tsx                 # Entry point
│   ├── tests/                       # Test files
│   ├── docs/                        # Frontend documentation
│   │   ├── FRONTEND_PHASE_1_DETAILED_PLAN.md
│   │   └── FRONTEND_PHASE_2_DETAILED_PLAN.md
│   ├── Dockerfile                   # Docker image
│   ├── package.json                 # Dependencies
│   ├── vite.config.ts               # Vite configuration
│   └── README.md                    # Frontend documentation
│
├── docs/                            # Shared documentation
│   ├── OFFICE_SEAT_ALLOCATION_PRD.md
│   ├── PHASE_1_IMPLEMENTATION_PLAN.md
│   ├── PHASE_2_IMPLEMENTATION_PLAN.md
│   ├── README.md
│   ├── DEPLOYMENT_GUIDE.md
│   ├── API_DOCUMENTATION.md
│   ├── ARCHITECTURE_DECISION_RECORDS.md
│   ├── DEVELOPMENT_GUIDELINES.md
│   ├── TESTING_STRATEGY.md
│   ├── TECHNICAL_IMPLEMENTATION_DOCUMENT_SIMPLIFIED.md
│   ├── TECHNICAL_IMPLEMENTATION_DOCUMENT.md
│   └── DOCUMENTATION_INDEX.md
│
├── docker-compose.yml               # Docker Compose configuration
├── .gitignore                       # Git ignore rules
├── REORGANIZATION_GUIDE_SIMPLE.md   # Documentation reorganization guide
└── README.md                        # This file
```

---

## 📚 Documentation

### Getting Started
- [README.md](./README.md) - Project overview and quick start
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Deployment instructions

### Development
- [DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md) - Coding standards
- [TESTING_STRATEGY.md](./TESTING_STRATEGY.md) - Testing approach
- [ARCHITECTURE_DECISION_RECORDS.md](./ARCHITECTURE_DECISION_RECORDS.md) - Design decisions

### API & Architecture
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API reference
- [TECHNICAL_IMPLEMENTATION_DOCUMENT_SIMPLIFIED.md](./TECHNICAL_IMPLEMENTATION_DOCUMENT_SIMPLIFIED.md) - Tech stack overview

### Product & Planning
- [OFFICE_SEAT_ALLOCATION_PRD.md](./OFFICE_SEAT_ALLOCATION_PRD.md) - Product requirements
- [PHASE_1_IMPLEMENTATION_PLAN.md](./PHASE_1_IMPLEMENTATION_PLAN.md) - Phase 1 plan
- [PHASE_2_IMPLEMENTATION_PLAN.md](./PHASE_2_IMPLEMENTATION_PLAN.md) - Phase 2 plan

---

## 🔧 Common Commands

### Docker Compose

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f [service-name]

# Rebuild containers
docker-compose build --no-cache

# Reset database
docker-compose down -v
docker-compose up -d
```

### Backend Development

```bash
# Run backend shell
docker-compose exec backend bash

# Run tests
docker-compose exec backend go test ./...

# Run linting
docker-compose exec backend golangci-lint run

# View database
docker-compose exec postgres psql -U postgres -d office_allocation
```

### Frontend Development

```bash
# Run frontend shell
docker-compose exec frontend bash

# Run tests
docker-compose exec frontend npm run test

# Build
docker-compose exec frontend npm run build

# Lint
docker-compose exec frontend npm run lint
```

---

## 🌐 Environment Variables

### Backend (.env)

```env
GO_ENV=development
PORT=8080
DATABASE_URL=postgres://postgres:postgres@postgres:5432/office_allocation
REDIS_URL=redis://redis:6379
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672/
JWT_SECRET=dev-secret-key
JWT_EXPIRY=3600
REFRESH_TOKEN_EXPIRY=604800
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-password
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:8080/api/v1
```

---

## 🧪 Testing

### Run All Tests

```bash
# Backend tests
docker-compose exec backend go test ./...

# Frontend tests
docker-compose exec frontend npm run test
```

### Run Specific Tests

```bash
# Backend specific test
docker-compose exec backend go test -run TestScheduleGeneration ./...

# Frontend specific test
docker-compose exec frontend npm run test -- ScheduleView
```

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :8080

# Kill process
kill -9 <PID>
```

### Database Connection Error

```bash
# Restart PostgreSQL
docker-compose restart postgres

# Check logs
docker-compose logs postgres
```

### Frontend Not Updating

```bash
# Clear node_modules and reinstall
docker-compose exec frontend rm -rf node_modules
docker-compose exec frontend npm install

# Restart frontend
docker-compose restart frontend
```

### Services Not Starting

```bash
# Rebuild all containers
docker-compose build --no-cache

# Start fresh
docker-compose down -v
docker-compose up -d
```

---

## 📖 API Examples

### Login

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password"
  }'
```

### Get Employees

```bash
curl -X GET http://localhost:8080/api/v1/admin/employees \
  -H "Authorization: Bearer <token>"
```

### Generate Schedule

```bash
curl -X POST http://localhost:8080/api/v1/admin/schedules/generate \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "week_start_date": "2024-01-08",
    "week_end_date": "2024-01-12"
  }'
```

---

## 🤝 Contributing

### Branch Naming
- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `docs/description` - Documentation
- `refactor/description` - Code refactoring

### Commit Messages
```
[TYPE] Brief description

Detailed explanation if needed.

Fixes #issue-number
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Pull Request Process
1. Create feature branch
2. Make changes
3. Write/update tests
4. Update documentation
5. Submit PR with description
6. Address review comments
7. Merge when approved

---

## 📞 Support

### Getting Help
- Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues
- Review [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API details
- Check [DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md) for coding help

### Reporting Issues
- Create GitHub issue with:
  - Clear description
  - Steps to reproduce
  - Expected vs actual behavior
  - Environment details

---

## 📄 License

[Add your license here]

---

## 👥 Team

- **Product Manager**: [Name]
- **Backend Lead**: [Name]
- **Frontend Lead**: [Name]
- **DevOps**: [Name]

---

**Last Updated**: [Current Date]  
**Version**: 1.0
