# Testing Strategy
## Office Workspace Seat Allocation System

---

## 1. Overview

This document outlines the testing approach for the project, including unit tests, integration tests, and end-to-end tests.

**Testing Goals**:
- Ensure code quality and reliability
- Catch bugs early
- Enable confident refactoring
- Document expected behavior
- Maintain 70%+ code coverage

---

## 2. Testing Pyramid

```
        /\
       /  \
      / E2E \
     /______\
    /        \
   / Integration\
  /____________\
 /              \
/   Unit Tests   \
/________________\

Ratio: 70% Unit : 20% Integration : 10% E2E
```

---

## 3. Backend Testing

### 3.1 Unit Tests

**Purpose**: Test individual functions and methods in isolation

**Tools**: Go testing package, Testify, Mockery

**Coverage Target**: 80%+

#### Example: Employee Service

```go
package employee

import (
    "testing"
    "github.com/stretchr/testify/assert"
    "github.com/stretchr/testify/mock"
)

type MockEmployeeRepository struct {
    mock.Mock
}

func (m *MockEmployeeRepository) GetByID(id string) (*Employee, error) {
    args := m.Called(id)
    if args.Get(0) == nil {
        return nil, args.Error(1)
    }
    return args.Get(0).(*Employee), args.Error(1)
}

func TestGetEmployee(t *testing.T) {
    // Arrange
    mockRepo := new(MockEmployeeRepository)
    mockRepo.On("GetByID", "123").Return(&Employee{
        ID:    "123",
        Email: "john@example.com",
        Name:  "John Doe",
    }, nil)
    
    service := NewEmployeeService(mockRepo)
    
    // Act
    employee, err := service.GetEmployee("123")
    
    // Assert
    assert.NoError(t, err)
    assert.NotNil(t, employee)
    assert.Equal(t, "john@example.com", employee.Email)
    mockRepo.AssertExpectations(t)
}

func TestGetEmployeeNotFound(t *testing.T) {
    // Arrange
    mockRepo := new(MockEmployeeRepository)
    mockRepo.On("GetByID", "999").Return(nil, ErrNotFound)
    
    service := NewEmployeeService(mockRepo)
    
    // Act
    employee, err := service.GetEmployee("999")
    
    // Assert
    assert.Error(t, err)
    assert.Nil(t, employee)
    assert.Equal(t, ErrNotFound, err)
}
```

#### Test Categories

**Validation Tests**:
```go
func TestValidateEmail(t *testing.T) {
    tests := []struct {
        name    string
        email   string
        wantErr bool
    }{
        {"valid email", "test@example.com", false},
        {"invalid email", "invalid", true},
        {"empty email", "", true},
    }
    
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            err := ValidateEmail(tt.email)
            if (err != nil) != tt.wantErr {
                t.Errorf("ValidateEmail() error = %v, wantErr %v", err, tt.wantErr)
            }
        })
    }
}
```

**Algorithm Tests**:
```go
func TestScheduleGeneration(t *testing.T) {
    // Test fairness algorithm
    employees := createTestEmployees(100)
    capacity := map[int]int{0: 50, 1: 50, 2: 50, 3: 50, 4: 50}
    
    schedule, err := GenerateSchedule(employees, capacity)
    
    assert.NoError(t, err)
    assert.NotNil(t, schedule)
    
    // Verify constraints
    assert.True(t, validateHybridConstraint(schedule))
    assert.True(t, validateCapacity(schedule, capacity))
    assert.True(t, validateFairness(schedule))
}
```

### 3.2 Integration Tests

**Purpose**: Test interactions between components

**Tools**: Go testing package, Testify, Docker for test database

**Coverage Target**: 50%+

#### Example: Employee API

```go
package employee

import (
    "bytes"
    "encoding/json"
    "net/http"
    "net/http/httptest"
    "testing"
)

func TestCreateEmployeeAPI(t *testing.T) {
    // Setup
    router := setupTestRouter()
    db := setupTestDatabase()
    defer db.Close()
    
    // Create request
    payload := CreateEmployeeRequest{
        Email:    "john@example.com",
        Name:     "John Doe",
        Password: "SecurePassword123!",
        Role:     "employee",
    }
    
    body, _ := json.Marshal(payload)
    req := httptest.NewRequest("POST", "/api/v1/admin/employees", bytes.NewReader(body))
    req.Header.Set("Authorization", "Bearer "+testToken)
    req.Header.Set("Content-Type", "application/json")
    
    // Execute
    w := httptest.NewRecorder()
    router.ServeHTTP(w, req)
    
    // Assert
    assert.Equal(t, http.StatusCreated, w.Code)
    
    var response CreateEmployeeResponse
    json.Unmarshal(w.Body.Bytes(), &response)
    assert.Equal(t, "john@example.com", response.Email)
    
    // Verify in database
    var emp Employee
    db.Where("email = ?", "john@example.com").First(&emp)
    assert.NotEmpty(t, emp.ID)
}

func TestCreateEmployeeDuplicateEmail(t *testing.T) {
    // Setup
    router := setupTestRouter()
    db := setupTestDatabase()
    defer db.Close()
    
    // Create first employee
    createTestEmployee(db, "john@example.com")
    
    // Try to create duplicate
    payload := CreateEmployeeRequest{
        Email:    "john@example.com",
        Name:     "John Doe",
        Password: "SecurePassword123!",
        Role:     "employee",
    }
    
    body, _ := json.Marshal(payload)
    req := httptest.NewRequest("POST", "/api/v1/admin/employees", bytes.NewReader(body))
    req.Header.Set("Authorization", "Bearer "+testToken)
    
    w := httptest.NewRecorder()
    router.ServeHTTP(w, req)
    
    // Assert
    assert.Equal(t, http.StatusConflict, w.Code)
}
```

### 3.3 Database Tests

```go
func TestScheduleRepository(t *testing.T) {
    db := setupTestDatabase()
    defer db.Close()
    
    repo := NewScheduleRepository(db)
    
    // Create schedule
    schedule := &Schedule{
        WeekStartDate: time.Now(),
        WeekEndDate:   time.Now().AddDate(0, 0, 4),
        Status:        "draft",
    }
    
    err := repo.Create(schedule)
    assert.NoError(t, err)
    assert.NotEmpty(t, schedule.ID)
    
    // Retrieve schedule
    retrieved, err := repo.GetByID(schedule.ID)
    assert.NoError(t, err)
    assert.Equal(t, schedule.ID, retrieved.ID)
}
```

### 3.4 Running Backend Tests

```bash
# Run all tests
go test ./...

# Run with coverage
go test -cover ./...

# Generate coverage report
go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out

# Run specific test
go test -run TestScheduleGeneration ./...

# Run with verbose output
go test -v ./...

# Run with race detector
go test -race ./...
```

---

## 4. Frontend Testing

### 4.1 Unit Tests

**Purpose**: Test individual components and functions

**Tools**: Vitest, React Testing Library, Jest

**Coverage Target**: 80%+

#### Example: Component Test

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { EmployeeForm } from './EmployeeForm';

describe('EmployeeForm', () => {
    it('should render form fields', () => {
        render(<EmployeeForm onSubmit={jest.fn()} />);
        
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });
    
    it('should validate email format', async () => {
        const { getByText } = render(<EmployeeForm onSubmit={jest.fn()} />);
        
        const emailInput = screen.getByLabelText('Email');
        fireEvent.change(emailInput, { target: { value: 'invalid' } });
        fireEvent.click(getByText('Submit'));
        
        expect(screen.getByText('Invalid email format')).toBeInTheDocument();
    });
    
    it('should call onSubmit with form data', async () => {
        const onSubmit = jest.fn();
        render(<EmployeeForm onSubmit={onSubmit} />);
        
        fireEvent.change(screen.getByLabelText('Email'), {
            target: { value: 'john@example.com' },
        });
        fireEvent.change(screen.getByLabelText('Name'), {
            target: { value: 'John Doe' },
        });
        fireEvent.change(screen.getByLabelText('Password'), {
            target: { value: 'SecurePassword123!' },
        });
        
        fireEvent.click(screen.getByText('Submit'));
        
        expect(onSubmit).toHaveBeenCalledWith({
            email: 'john@example.com',
            name: 'John Doe',
            password: 'SecurePassword123!',
        });
    });
});
```

#### Example: Hook Test

```typescript
import { renderHook, act } from '@testing-library/react';
import { useEmployee } from './useEmployee';

describe('useEmployee', () => {
    it('should fetch employees on mount', async () => {
        const { result } = renderHook(() => useEmployee());
        
        expect(result.current.isLoading).toBe(true);
        
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
        });
        
        expect(result.current.isLoading).toBe(false);
        expect(result.current.employees).toHaveLength(10);
    });
});
```

### 4.2 Integration Tests

**Purpose**: Test component interactions and workflows

**Tools**: React Testing Library, Vitest

#### Example: Workflow Test

```typescript
describe('Employee Management Workflow', () => {
    it('should create and display new employee', async () => {
        const { getByText, getByLabelText } = render(<AdminDashboard />);
        
        // Click add employee button
        fireEvent.click(getByText('Add Employee'));
        
        // Fill form
        fireEvent.change(getByLabelText('Email'), {
            target: { value: 'john@example.com' },
        });
        fireEvent.change(getByLabelText('Name'), {
            target: { value: 'John Doe' },
        });
        
        // Submit
        fireEvent.click(getByText('Create'));
        
        // Verify employee appears in list
        await waitFor(() => {
            expect(getByText('John Doe')).toBeInTheDocument();
        });
    });
});
```

### 4.3 Running Frontend Tests

```bash
# Run all tests
npm run test

# Run with coverage
npm run test -- --coverage

# Run specific test file
npm run test -- EmployeeForm.test.tsx

# Run in watch mode
npm run test -- --watch

# Run with UI
npm run test -- --ui
```

---

## 5. End-to-End Testing

**Purpose**: Test complete user workflows

**Tools**: Cypress, Playwright

**Coverage Target**: Critical paths only

### 5.1 Example: E2E Test

```typescript
describe('Schedule Generation Workflow', () => {
    beforeEach(() => {
        cy.login('admin@example.com', 'password');
        cy.visit('/admin/schedules');
    });
    
    it('should generate and publish schedule', () => {
        // Click generate button
        cy.contains('Generate Schedule').click();
        
        // Select week
        cy.get('[data-testid="week-start"]').type('2024-01-08');
        cy.get('[data-testid="week-end"]').type('2024-01-12');
        
        // Generate
        cy.contains('Generate').click();
        
        // Verify schedule preview
        cy.get('[data-testid="schedule-preview"]').should('be.visible');
        cy.get('[data-testid="fairness-score"]').should('contain', '95');
        
        // Publish
        cy.contains('Publish').click();
        
        // Verify success
        cy.contains('Schedule published successfully').should('be.visible');
    });
});
```

### 5.2 Running E2E Tests

```bash
# Run Cypress tests
npx cypress run

# Run in headed mode
npx cypress open

# Run specific test
npx cypress run --spec "cypress/e2e/schedule.cy.ts"
```

---

## 6. Performance Testing

### 6.1 Backend Performance

```go
func BenchmarkScheduleGeneration(b *testing.B) {
    employees := createTestEmployees(500)
    capacity := map[int]int{0: 50, 1: 50, 2: 50, 3: 50, 4: 50}
    
    b.ResetTimer()
    for i := 0; i < b.N; i++ {
        GenerateSchedule(employees, capacity)
    }
}

// Run benchmarks
// go test -bench=. -benchmem ./...
```

### 6.2 Frontend Performance

```typescript
// Measure component render time
import { render } from '@testing-library/react';

it('should render EmployeeList in < 100ms', () => {
    const start = performance.now();
    render(<EmployeeList employees={largeEmployeeList} />);
    const end = performance.now();
    
    expect(end - start).toBeLessThan(100);
});
```

---

## 7. Load Testing

### 7.1 Backend Load Test

```bash
# Using Apache Bench
ab -n 1000 -c 100 http://localhost:8080/api/v1/admin/employees

# Using wrk
wrk -t12 -c400 -d30s http://localhost:8080/api/v1/admin/employees
```

### 7.2 Load Test Script

```go
package main

import (
    "fmt"
    "sync"
    "time"
)

func loadTest() {
    var wg sync.WaitGroup
    results := make(chan time.Duration, 1000)
    
    for i := 0; i < 1000; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            start := time.Now()
            // Make API request
            results <- time.Since(start)
        }()
    }
    
    wg.Wait()
    close(results)
    
    // Analyze results
    var total time.Duration
    for d := range results {
        total += d
    }
    
    fmt.Printf("Average: %v\n", total/1000)
}
```

---

## 8. Test Data & Fixtures

### 8.1 Backend Fixtures

```go
func createTestEmployee(db *gorm.DB, email string) *Employee {
    emp := &Employee{
        ID:       uuid.New(),
        Email:    email,
        Name:     "Test User",
        Role:     "employee",
        Status:   "active",
    }
    db.Create(emp)
    return emp
}

func createTestEmployees(count int) []Employee {
    employees := make([]Employee, count)
    for i := 0; i < count; i++ {
        employees[i] = Employee{
            ID:     uuid.New(),
            Email:  fmt.Sprintf("user%d@example.com", i),
            Name:   fmt.Sprintf("User %d", i),
            Role:   "employee",
            Status: "active",
        }
    }
    return employees
}
```

### 8.2 Frontend Fixtures

```typescript
export const mockEmployees: Employee[] = [
    {
        id: '1',
        email: 'john@example.com',
        name: 'John Doe',
        role: 'employee',
        status: 'active',
    },
    {
        id: '2',
        email: 'jane@example.com',
        name: 'Jane Smith',
        role: 'team_lead',
        status: 'active',
    },
];

export const mockSchedule: Schedule = {
    id: '1',
    week_start_date: '2024-01-08',
    week_end_date: '2024-01-12',
    status: 'published',
    entries: [
        {
            id: '1',
            employee_id: '1',
            day_of_week: 0,
            work_type: 'office',
        },
    ],
};
```

---

## 9. Continuous Integration Testing

### 9.1 GitHub Actions Workflow

```yaml
name: Tests

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-go@v2
        with:
          go-version: 1.21
      
      - name: Run tests
        run: go test -v -race -coverprofile=coverage.out ./...
      
      - name: Upload coverage
        uses: codecov/codecov-action@v2
        with:
          files: ./coverage.out

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm install
      
      - name: Run tests
        run: npm run test -- --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v2
```

---

## 10. Test Coverage Goals

| Component | Target | Current |
|-----------|--------|---------|
| Backend Services | 80% | TBD |
| Backend Handlers | 70% | TBD |
| Backend Repositories | 75% | TBD |
| Frontend Components | 80% | TBD |
| Frontend Hooks | 85% | TBD |
| Frontend Services | 75% | TBD |
| **Overall** | **70%** | **TBD** |

---

## 11. Testing Checklist

### Before Commit
- [ ] All unit tests passing
- [ ] No console errors/warnings
- [ ] Code coverage maintained
- [ ] Linting passes

### Before PR
- [ ] Integration tests passing
- [ ] E2E tests for critical paths
- [ ] Performance acceptable
- [ ] Documentation updated

### Before Release
- [ ] All tests passing
- [ ] Coverage > 70%
- [ ] Load testing completed
- [ ] Security testing done

---

**Document Version**: 1.0  
**Last Updated**: [Current Date]
