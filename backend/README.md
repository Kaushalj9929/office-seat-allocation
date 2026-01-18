# Office Seat Allocation - Backend

Go backend service for the Office Workspace Seat Allocation System.

## Setup

1. Install dependencies:
```bash
go mod download
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your database credentials

4. Run the application:
```bash
go run cmd/main.go
```

## Project Structure

```
backend/
├── cmd/main.go                 # Application entry point
├── internal/
│   ├── config/                 # Configuration management
│   ├── models/                 # Data models
│   ├── handlers/               # HTTP handlers
│   ├── services/               # Business logic
│   ├── repositories/           # Data access
│   ├── middleware/             # HTTP middleware
│   ├── utils/                  # Utilities
│   ├── database/               # Database setup
│   └── routes/                 # Route definitions
└── tests/                      # Test files
```

## API Endpoints

### Health Check
- `GET /health` - Check service health

## Development

Run with hot reload:
```bash
go run cmd/main.go
```

Run tests:
```bash
go test ./...
```

## Docker

Build:
```bash
docker build -t office-seat-backend .
```

Run:
```bash
docker run -p 8080:8080 office-seat-backend
```
