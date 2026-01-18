# Development Guidelines
## Office Workspace Seat Allocation System

---

## 1. Overview

This document outlines coding standards, best practices, and conventions for the project.

---

## 2. General Principles

### 2.1 Code Quality

- **Readability**: Code should be self-documenting
- **Simplicity**: Prefer simple solutions over complex ones
- **DRY**: Don't Repeat Yourself
- **SOLID**: Follow SOLID principles
- **Testing**: Write testable code

### 2.2 Version Control

- Use meaningful commit messages
- Keep commits atomic and focused
- Create feature branches for new work
- Use pull requests for code review
- Squash commits before merging

---

## 3. Backend (Go) Guidelines

### 3.1 Code Style

```go
// Use standard Go formatting (gofmt)
// Line length: 80-100 characters
// Indentation: tabs (Go standard)

// Package names: lowercase, single word
package models

// Type names: PascalCase
type Employee struct {
    ID    uuid.UUID
    Email string
    Name  string
}

// Function names: PascalCase for exported, camelCase for unexported
func (e *Employee) GetFullName() string {
    return e.Name
}

func (e *Employee) validate() error {
    // validation logic
}

// Constants: UPPER_SNAKE_CASE
const (
    DefaultPageSize = 20
    MaxPageSize     = 100
)

// Variables: camelCase
var (
    employeeRepository EmployeeRepository
    scheduleService    ScheduleService
)
```

### 3.2 Error Handling

```go
// Always handle errors
if err != nil {
    return fmt.Errorf("failed to fetch employee: %w", err)
}

// Use custom error types for specific errors
type ValidationError struct {
    Field   string
    Message string
}

func (e *ValidationError) Error() string {
    return fmt.Sprintf("%s: %s", e.Field, e.Message)
}

// Wrap errors with context
if err != nil {
    return fmt.Errorf("create employee: %w", err)
}
```

### 3.3 Logging

```go
// Use structured logging
logger.Info("employee created",
    zap.String("employee_id", emp.ID.String()),
    zap.String("email", emp.Email),
)

// Log levels: Debug, Info, Warn, Error
logger.Debug("processing change request", zap.Any("request", req))
logger.Warn("capacity exceeded", zap.Int("day", day))
logger.Error("database error", zap.Error(err))
```

### 3.4 Testing

```go
// Test file naming: filename_test.go
// Test function naming: TestFunctionName

func TestGenerateSchedule(t *testing.T) {
    // Arrange
    employees := []Employee{...}
    capacity := map[int]int{0: 50, 1: 50, ...}
    
    // Act
    schedule, err := GenerateSchedule(employees, capacity)
    
    // Assert
    assert.NoError(t, err)
    assert.NotNil(t, schedule)
    assert.Equal(t, len(schedule.Entries), len(employees)*5)
}

// Use table-driven tests for multiple scenarios
func TestValidateEmail(t *testing.T) {
    tests := []struct {
        name    string
        email   string
        wantErr bool
    }{
        {"valid email", "test@example.com", false},
        {"invalid email", "invalid", true},
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

### 3.5 Project Structure

```go
// Organize by feature/domain, not by layer
backend/
├── internal/
│   ├── employee/
│   │   ├── model.go
│   │   ├── repository.go
│   │   ├── service.go
│   │   ├── handler.go
│   │   └── employee_test.go
│   ├── schedule/
│   │   ├── model.go
│   │   ├── repository.go
│   │   ├── service.go
│   │   ├── handler.go
│   │   └── schedule_test.go
```

### 3.6 Dependency Injection

```go
// Use constructor injection
type EmployeeService struct {
    repo EmployeeRepository
    db   *gorm.DB
}

func NewEmployeeService(repo EmployeeRepository, db *gorm.DB) *EmployeeService {
    return &EmployeeService{
        repo: repo,
        db:   db,
    }
}

// Avoid global variables
// Avoid service locator pattern
```

### 3.7 Concurrency

```go
// Use goroutines for async operations
go func() {
    if err := sendNotification(emp); err != nil {
        logger.Error("failed to send notification", zap.Error(err))
    }
}()

// Use channels for communication
results := make(chan Result, len(employees))
for _, emp := range employees {
    go func(e Employee) {
        results <- processEmployee(e)
    }(emp)
}

// Use context for cancellation
ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
defer cancel()
```

---

## 4. Frontend (React/TypeScript) Guidelines

### 4.1 Code Style

```typescript
// Use PascalCase for components
export const EmployeeList: React.FC<EmployeeListProps> = ({ employees }) => {
    return <div>{/* component */}</div>;
};

// Use camelCase for functions and variables
const handleEmployeeSelect = (id: string) => {
    // handle selection
};

// Use UPPER_SNAKE_CASE for constants
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

// Use meaningful variable names
const isLoading = true;
const hasError = false;
const employeeCount = 100;
```

### 4.2 Component Structure

```typescript
// Functional components with hooks
interface EmployeeListProps {
    employees: Employee[];
    isLoading: boolean;
    onSelect: (id: string) => void;
}

export const EmployeeList: React.FC<EmployeeListProps> = ({
    employees,
    isLoading,
    onSelect,
}) => {
    const [filter, setFilter] = useState('');
    
    const filteredEmployees = useMemo(() => {
        return employees.filter(e => e.name.includes(filter));
    }, [employees, filter]);
    
    return (
        <div className="employee-list">
            {/* component JSX */}
        </div>
    );
};
```

### 4.3 Type Safety

```typescript
// Always define types
interface Employee {
    id: string;
    email: string;
    name: string;
    role: 'employee' | 'team_lead' | 'manager' | 'admin';
    status: 'active' | 'inactive' | 'on_leave';
}

// Use enums for constants
enum EmployeeRole {
    Employee = 'employee',
    TeamLead = 'team_lead',
    Manager = 'manager',
    Admin = 'admin',
}

// Use union types for multiple possibilities
type UserRole = 'admin' | 'manager' | 'employee';

// Avoid 'any' type
// Use 'unknown' if type is truly unknown
function processData(data: unknown) {
    if (typeof data === 'string') {
        // handle string
    }
}
```

### 4.4 State Management

```typescript
// Use Redux for global state
import { useSelector, useDispatch } from 'react-redux';
import { selectEmployees, fetchEmployees } from './employeeSlice';

export const EmployeeContainer: React.FC = () => {
    const dispatch = useDispatch();
    const employees = useSelector(selectEmployees);
    
    useEffect(() => {
        dispatch(fetchEmployees());
    }, [dispatch]);
    
    return <EmployeeList employees={employees} />;
};

// Use local state for component-specific state
const [isOpen, setIsOpen] = useState(false);
```

### 4.5 Hooks

```typescript
// Custom hooks for reusable logic
export const useEmployee = () => {
    const dispatch = useDispatch();
    const { employees, isLoading, error } = useSelector(selectEmployee);
    
    const fetchEmployees = useCallback(async () => {
        dispatch(fetchEmployeesAsync());
    }, [dispatch]);
    
    return { employees, isLoading, error, fetchEmployees };
};

// Use useCallback for memoized functions
const handleClick = useCallback(() => {
    // handle click
}, [dependency]);

// Use useMemo for expensive computations
const filteredEmployees = useMemo(() => {
    return employees.filter(e => e.status === 'active');
}, [employees]);
```

### 4.6 Testing

```typescript
// Component tests
describe('EmployeeList', () => {
    it('should render employee list', () => {
        const { getByText } = render(
            <EmployeeList employees={mockEmployees} isLoading={false} onSelect={jest.fn()} />
        );
        
        expect(getByText('John Doe')).toBeInTheDocument();
    });
    
    it('should call onSelect when employee is clicked', () => {
        const onSelect = jest.fn();
        const { getByText } = render(
            <EmployeeList employees={mockEmployees} isLoading={false} onSelect={onSelect} />
        );
        
        fireEvent.click(getByText('John Doe'));
        expect(onSelect).toHaveBeenCalledWith('123');
    });
});

// Hook tests
describe('useEmployee', () => {
    it('should fetch employees on mount', () => {
        const { result } = renderHook(() => useEmployee());
        
        expect(result.current.isLoading).toBe(true);
    });
});
```

### 4.7 Styling

```typescript
// Use Tailwind CSS classes
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
    <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Action
    </button>
</div>

// Use CSS modules for component-specific styles
import styles from './EmployeeList.module.css';

<div className={styles.container}>
    {/* component */}
</div>

// Avoid inline styles
// ❌ <div style={{ color: 'red' }}>
// ✅ <div className="text-red-500">
```

---

## 5. Git Workflow

### 5.1 Branch Naming

```
feature/description          # New features
bugfix/description           # Bug fixes
docs/description             # Documentation
refactor/description         # Code refactoring
test/description             # Test additions
chore/description            # Maintenance tasks
```

### 5.2 Commit Messages

```
[TYPE] Brief description (50 chars max)

Detailed explanation if needed (wrap at 72 chars).
Explain what and why, not how.

Fixes #issue-number
Related to #issue-number
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### 5.3 Pull Request Process

1. Create feature branch from `main`
2. Make changes with meaningful commits
3. Write/update tests
4. Update documentation
5. Push to remote
6. Create PR with description
7. Address review comments
8. Squash commits if needed
9. Merge when approved

---

## 6. Code Review Checklist

### Backend Review

- [ ] Code follows Go conventions
- [ ] Error handling is comprehensive
- [ ] Tests are included and passing
- [ ] No hardcoded values
- [ ] Logging is appropriate
- [ ] Performance is acceptable
- [ ] Security is considered
- [ ] Documentation is updated

### Frontend Review

- [ ] Code follows React/TypeScript conventions
- [ ] Components are reusable
- [ ] Props are properly typed
- [ ] Tests are included and passing
- [ ] No console errors/warnings
- [ ] Accessibility is considered
- [ ] Performance is acceptable
- [ ] Styling is consistent

---

## 7. Performance Guidelines

### Backend

```go
// Use indexes for frequently queried fields
db.Model(&Employee{}).Index("idx_email", "email")

// Use pagination for large result sets
db.Offset((page - 1) * limit).Limit(limit).Find(&employees)

// Use caching for expensive operations
cache.Set("employees", employees, 1*time.Hour)

// Use connection pooling
sqlDB.SetMaxOpenConns(100)
sqlDB.SetMaxIdleConns(10)
```

### Frontend

```typescript
// Use React.memo for expensive components
export const EmployeeCard = memo(({ employee }: Props) => {
    return <div>{/* component */}</div>;
});

// Use lazy loading for routes
const AdminDashboard = lazy(() => import('./AdminDashboard'));

// Use code splitting
import { EmployeeList } from './components/EmployeeList';

// Optimize images
<img src={image} alt="description" loading="lazy" />
```

---

## 8. Security Guidelines

### Backend

```go
// Validate all inputs
if err := ValidateEmail(email); err != nil {
    return err
}

// Use parameterized queries (GORM does this)
db.Where("email = ?", email).First(&employee)

// Hash passwords
hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

// Use HTTPS in production
// Implement rate limiting
// Validate JWT tokens
```

### Frontend

```typescript
// Sanitize user input
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(userInput);

// Use HTTPS
// Don't store sensitive data in localStorage
// Validate on both client and server
// Use Content Security Policy headers
```

---

## 9. Documentation Guidelines

### Code Comments

```go
// Comment exported functions
// GenerateSchedule creates a weekly schedule for all employees
// considering fairness, team preferences, and capacity constraints.
func GenerateSchedule(employees []Employee, capacity map[int]int) (*Schedule, error) {
    // implementation
}

// Avoid obvious comments
// ❌ // increment i
// i++

// ✅ // move to next unprocessed employee
// i++
```

### README Files

- Include project description
- List prerequisites
- Provide quick start instructions
- Document API endpoints
- Include troubleshooting section

---

## 10. Tools & Linting

### Backend

```bash
# Format code
gofmt -w .

# Lint code
golangci-lint run

# Run tests
go test ./...

# Check coverage
go test -cover ./...
```

### Frontend

```bash
# Format code
prettier --write .

# Lint code
eslint src/

# Type check
tsc --noEmit

# Run tests
npm run test
```

---

## 11. Pre-commit Hooks

Create `.git/hooks/pre-commit`:

```bash
#!/bin/bash

# Backend
cd backend
gofmt -w .
golangci-lint run
go test ./...

# Frontend
cd ../frontend
prettier --write .
eslint src/
npm run test

exit 0
```

---

## 12. Continuous Integration

### GitHub Actions

```yaml
name: CI

on: [push, pull_request]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-go@v2
      - run: go test ./...
      - run: golangci-lint run

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run test
      - run: npm run build
```

---

**Document Version**: 1.0  
**Last Updated**: [Current Date]
