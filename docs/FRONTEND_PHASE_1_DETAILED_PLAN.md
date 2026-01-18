# Frontend Phase 1 Detailed Implementation Plan
## Office Workspace Seat Allocation System

---

## 1. Overview

This document provides detailed specifications for frontend implementation in Phase 1. It covers component structure, page layouts, state management, and UI/UX specifications.

---

## 2. Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Common/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── ErrorAlert.tsx
│   │   │   └── SuccessAlert.tsx
│   │   ├── Auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── LogoutButton.tsx
│   │   ├── Admin/
│   │   │   ├── EmployeeManagement/
│   │   │   │   ├── EmployeeList.tsx
│   │   │   │   ├── EmployeeForm.tsx
│   │   │   │   ├── EmployeeTable.tsx
│   │   │   │   └── EmployeeModal.tsx
│   │   │   ├── TeamManagement/
│   │   │   │   ├── TeamList.tsx
│   │   │   │   ├── TeamForm.tsx
│   │   │   │   ├── TeamTable.tsx
│   │   │   │   └── TeamModal.tsx
│   │   │   └── ScheduleGeneration/
│   │   │       ├── ScheduleGenerator.tsx
│   │   │       ├── SchedulePreview.tsx
│   │   │       ├── ScheduleTable.tsx
│   │   │       └── PublishDialog.tsx
│   │   ├── Employee/
│   │   │   ├── ScheduleView/
│   │   │   │   ├── ScheduleView.tsx
│   │   │   │   ├── ScheduleCalendar.tsx
│   │   │   │   └── ScheduleCard.tsx
│   │   │   └── ChangeRequest/
│   │   │       ├── ChangeRequestForm.tsx
│   │   │       ├── ChangeRequestHistory.tsx
│   │   │       ├── RequestCard.tsx
│   │   │       └── RequestStatusBadge.tsx
│   │   └── Manager/
│   │       ├── TeamSchedule.tsx
│   │       └── TeamChangeRequests.tsx
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── EmployeeDashboard.tsx
│   │   ├── ManagerDashboard.tsx
│   │   ├── NotFoundPage.tsx
│   │   └── UnauthorizedPage.tsx
│   ├── services/
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   ├── employeeService.ts
│   │   ├── teamService.ts
│   │   ├── scheduleService.ts
│   │   └── changeRequestService.ts
│   ├── store/
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── employeeSlice.ts
│   │   │   ├── teamSlice.ts
│   │   │   ├── scheduleSlice.ts
│   │   │   └── changeRequestSlice.ts
│   │   └── store.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useEmployee.ts
│   │   ├── useTeam.ts
│   │   ├── useSchedule.ts
│   │   └── useChangeRequest.ts
│   ├── types/
│   │   ├── index.ts
│   │   ├── auth.ts
│   │   ├── employee.ts
│   │   ├── team.ts
│   │   ├── schedule.ts
│   │   └── changeRequest.ts
│   ├── utils/
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── constants.ts
│   ├── styles/
│   │   ├── globals.css
│   │   └── theme.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
│   └── index.html
├── tests/
│   ├── unit/
│   ├── integration/
│   └── fixtures/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── Dockerfile
├── .env.example
└── README.md
```

---

## 3. Type Definitions

### 3.1 Auth Types

```typescript
// types/auth.ts
export interface User {
    id: string;
    email: string;
    name: string;
    role: 'employee' | 'team_lead' | 'manager' | 'admin';
    status: 'active' | 'inactive' | 'on_leave';
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    user: User;
}

export interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isLoading: boolean;
    error: string | null;
}
```

### 3.2 Employee Types

```typescript
// types/employee.ts
export interface Employee {
    id: string;
    email: string;
    name: string;
    team_id: string | null;
    role: string;
    status: string;
    preferences: Record<string, any>;
    created_at: string;
    updated_at: string;
}

export interface EmployeeInput {
    email: string;
    name: string;
    password: string;
    team_id?: string;
    role: string;
    status: string;
}

export interface EmployeeState {
    employees: Employee[];
    selectedEmployee: Employee | null;
    isLoading: boolean;
    error: string | null;
    pagination: {
        page: number;
        limit: number;
        total: number;
    };
}
```

### 3.3 Schedule Types

```typescript
// types/schedule.ts
export interface ScheduleEntry {
    id: string;
    schedule_id: string;
    employee_id: string;
    day_of_week: number;
    work_type: 'office' | 'wfh';
    seat_id?: string;
    status: string;
}

export interface Schedule {
    id: string;
    week_start_date: string;
    week_end_date: string;
    status: 'draft' | 'published' | 'archived';
    entries: ScheduleEntry[];
    created_at: string;
    published_at?: string;
    version: number;
}

export interface ScheduleState {
    schedules: Schedule[];
    currentSchedule: Schedule | null;
    isLoading: boolean;
    error: string | null;
}
```

### 3.4 Change Request Types

```typescript
// types/changeRequest.ts
export interface ChangeRequest {
    id: string;
    employee_id: string;
    current_day: number;
    requested_day: number;
    reason?: string;
    status: 'pending' | 'approved' | 'rejected' | 'cancelled';
    requested_date: string;
    decision_date?: string;
    decision_reason?: string;
}

export interface ChangeRequestInput {
    current_day: number;
    requested_day: number;
    reason?: string;
}

export interface ChangeRequestState {
    requests: ChangeRequest[];
    isLoading: boolean;
    error: string | null;
}
```

---

## 4. Page Layouts

### 4.1 Login Page

**URL**: `/login`  
**Access**: Public  
**Components**:
- LoginForm
- Logo/Branding
- Error messages

**Layout**:
```
┌─────────────────────────────────────┐
│                                     │
│         OFFICE SEAT ALLOCATION      │
│                                     │
│    ┌──────────────────────────┐    │
│    │  Email                   │    │
│    │  [________________]      │    │
│    │                          │    │
│    │  Password                │    │
│    │  [________________]      │    │
│    │                          │    │
│    │  [  Login  ]             │    │
│    └──────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

---

### 4.2 Admin Dashboard

**URL**: `/admin`  
**Access**: Admin only  
**Components**:
- Header with user info
- Sidebar with navigation
- Main content area with tabs

**Tabs**:
1. **Employees**: Employee management
2. **Teams**: Team management
3. **Schedules**: Schedule generation and management

**Layout**:
```
┌──────────────────────────────────────────┐
│  Header (Logo, User, Logout)             │
├──────────┬───────────────────────────────┤
│          │                               │
│ Sidebar  │  Main Content                 │
│          │  ┌─────────────────────────┐  │
│ - Home   │  │ Employees | Teams |     │  │
│ - Empl.  │  │ Schedules               │  │
│ - Teams  │  │                         │  │
│ - Sched. │  │ [Content Area]          │  │
│          │  │                         │  │
│          │  └─────────────────────────┘  │
│          │                               │
└──────────┴───────────────────────────────┘
```

---

### 4.3 Employee Dashboard

**URL**: `/employee`  
**Access**: Employee only  
**Components**:
- Header with user info
- Schedule view
- Change request form
- Request history

**Layout**:
```
┌──────────────────────────────────────────┐
│  Header (Logo, User, Logout)             │
├──────────────────────────────────────────┤
│                                          │
│  My Schedule (4 weeks)                   │
│  ┌────────────────────────────────────┐  │
│  │ Mon | Tue | Wed | Thu | Fri        │  │
│  │ Off | WFH | Off | WFH | Off        │  │
│  └────────────────────────────────────┘  │
│                                          │
│  Request Schedule Change                 │
│  ┌────────────────────────────────────┐  │
│  │ Current Day: [Monday]              │  │
│  │ Requested Day: [Wednesday]         │  │
│  │ Reason: [________________]         │  │
│  │ [Submit]                           │  │
│  └────────────────────────────────────┘  │
│                                          │
│  My Requests                             │
│  ┌────────────────────────────────────┐  │
│  │ Request 1 | Status: Pending        │  │
│  │ Request 2 | Status: Approved       │  │
│  └────────────────────────────────────┘  │
│                                          │
└──────────────────────────────────────────┘
```

---

## 5. Component Specifications

### 5.1 LoginForm Component

```typescript
interface LoginFormProps {
    onSubmit: (data: LoginRequest) => Promise<void>;
    isLoading: boolean;
    error?: string;
}

// Features:
// - Email input with validation
// - Password input
// - Submit button
// - Error display
// - Loading state
// - Remember me checkbox (optional)
```

### 5.2 EmployeeList Component

```typescript
interface EmployeeListProps {
    employees: Employee[];
    isLoading: boolean;
    onAdd: () => void;
    onEdit: (employee: Employee) => void;
    onDelete: (id: string) => void;
    pagination: Pagination;
    onPageChange: (page: number) => void;
}

// Features:
// - Table display with sorting
// - Pagination
// - Search/filter
// - Add button
// - Edit/Delete actions
// - Bulk actions (optional)
```

### 5.3 ScheduleGenerator Component

```typescript
interface ScheduleGeneratorProps {
    onGenerate: (weekStart: Date, weekEnd: Date) => Promise<Schedule>;
    isLoading: boolean;
}

// Features:
// - Week date picker
// - Generate button
// - Preview generated schedule
// - Manual adjustment capability
// - Publish button
```

### 5.4 ScheduleView Component

```typescript
interface ScheduleViewProps {
    schedule: Schedule;
    isLoading: boolean;
}

// Features:
// - Display 4-week schedule
// - Show office/WFH days
// - Color coding (office=blue, wfh=gray)
// - Export to calendar
// - Responsive design
```

### 5.5 ChangeRequestForm Component

```typescript
interface ChangeRequestFormProps {
    currentSchedule: Schedule;
    onSubmit: (data: ChangeRequestInput) => Promise<void>;
    isLoading: boolean;
}

// Features:
// - Current day display
// - Requested day dropdown
// - Reason textarea
// - Validation (2-day advance notice)
// - Available seats display
// - Submit button
```

---

## 6. Redux Store Structure

### 6.1 Auth Slice

```typescript
// store/slices/authSlice.ts
const authSlice = createSlice({
    name: 'auth',
    initialState: initialAuthState,
    reducers: {
        setUser: (state, action) => { /* ... */ },
        setTokens: (state, action) => { /* ... */ },
        logout: (state) => { /* ... */ },
        setLoading: (state, action) => { /* ... */ },
        setError: (state, action) => { /* ... */ },
    },
});
```

### 6.2 Employee Slice

```typescript
// store/slices/employeeSlice.ts
const employeeSlice = createSlice({
    name: 'employee',
    initialState: initialEmployeeState,
    reducers: {
        setEmployees: (state, action) => { /* ... */ },
        addEmployee: (state, action) => { /* ... */ },
        updateEmployee: (state, action) => { /* ... */ },
        deleteEmployee: (state, action) => { /* ... */ },
        setLoading: (state, action) => { /* ... */ },
        setError: (state, action) => { /* ... */ },
    },
});
```

### 6.3 Schedule Slice

```typescript
// store/slices/scheduleSlice.ts
const scheduleSlice = createSlice({
    name: 'schedule',
    initialState: initialScheduleState,
    reducers: {
        setSchedules: (state, action) => { /* ... */ },
        setCurrentSchedule: (state, action) => { /* ... */ },
        updateScheduleEntry: (state, action) => { /* ... */ },
        setLoading: (state, action) => { /* ... */ },
        setError: (state, action) => { /* ... */ },
    },
});
```

---

## 7. API Service Layer

### 7.1 Auth Service

```typescript
// services/authService.ts
export const authService = {
    login: async (email: string, password: string): Promise<LoginResponse> => {
        // POST /api/v1/auth/login
    },
    logout: async (): Promise<void> => {
        // POST /api/v1/auth/logout
    },
    refreshToken: async (refreshToken: string): Promise<LoginResponse> => {
        // POST /api/v1/auth/refresh
    },
};
```

### 7.2 Employee Service

```typescript
// services/employeeService.ts
export const employeeService = {
    getEmployees: async (page: number, limit: number): Promise<EmployeeResponse> => {
        // GET /api/v1/admin/employees
    },
    createEmployee: async (data: EmployeeInput): Promise<Employee> => {
        // POST /api/v1/admin/employees
    },
    updateEmployee: async (id: string, data: Partial<EmployeeInput>): Promise<Employee> => {
        // PUT /api/v1/admin/employees/{id}
    },
    deleteEmployee: async (id: string): Promise<void> => {
        // DELETE /api/v1/admin/employees/{id}
    },
};
```

### 7.3 Schedule Service

```typescript
// services/scheduleService.ts
export const scheduleService = {
    generateSchedule: async (weekStart: Date, weekEnd: Date): Promise<Schedule> => {
        // POST /api/v1/admin/schedules/generate
    },
    getSchedule: async (id: string): Promise<Schedule> => {
        // GET /api/v1/admin/schedules/{id}
    },
    publishSchedule: async (id: string): Promise<Schedule> => {
        // POST /api/v1/admin/schedules/{id}/publish
    },
    getEmployeeSchedule: async (): Promise<Schedule> => {
        // GET /api/v1/employee/schedule
    },
};
```

---

## 8. Custom Hooks

### 8.1 useAuth Hook

```typescript
// hooks/useAuth.ts
export const useAuth = () => {
    const dispatch = useDispatch();
    const { user, isLoading, error } = useSelector(selectAuth);

    const login = async (email: string, password: string) => {
        // Dispatch login action
    };

    const logout = () => {
        // Dispatch logout action
    };

    return { user, isLoading, error, login, logout };
};
```

### 8.2 useEmployee Hook

```typescript
// hooks/useEmployee.ts
export const useEmployee = () => {
    const dispatch = useDispatch();
    const { employees, isLoading, error } = useSelector(selectEmployee);

    const fetchEmployees = async (page: number) => {
        // Dispatch fetch action
    };

    const createEmployee = async (data: EmployeeInput) => {
        // Dispatch create action
    };

    return { employees, isLoading, error, fetchEmployees, createEmployee };
};
```

---

## 9. Form Validation

### 9.1 Login Form Validation

```typescript
const loginValidation = {
    email: {
        required: 'Email is required',
        pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address',
        },
    },
    password: {
        required: 'Password is required',
        minLength: {
            value: 8,
            message: 'Password must be at least 8 characters',
        },
    },
};
```

### 9.2 Employee Form Validation

```typescript
const employeeValidation = {
    email: {
        required: 'Email is required',
        pattern: { /* ... */ },
    },
    name: {
        required: 'Name is required',
        minLength: { value: 2, message: 'Name must be at least 2 characters' },
    },
    password: {
        required: 'Password is required',
        minLength: { value: 8, message: 'Password must be at least 8 characters' },
    },
    role: {
        required: 'Role is required',
    },
};
```

### 9.3 Change Request Validation

```typescript
const changeRequestValidation = {
    requested_day: {
        required: 'Requested day is required',
        validate: (value) => {
            // Check 2-day advance notice
            // Check capacity
            // Check hybrid constraint
        },
    },
    reason: {
        maxLength: { value: 500, message: 'Reason must be less than 500 characters' },
    },
};
```

---

## 10. Styling Strategy

### 10.1 Tailwind CSS Configuration

```javascript
// tailwind.config.js
module.exports = {
    theme: {
        colors: {
            primary: '#1976d2',
            secondary: '#dc004e',
            success: '#4caf50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#2196f3',
        },
        spacing: {
            // Standard spacing scale
        },
    },
};
```

### 10.2 Component Styling

- Use Tailwind utility classes
- Create reusable component classes
- Use MUI for complex components
- Maintain consistent spacing and colors

---

## 11. Testing Strategy

### 11.1 Unit Tests

```typescript
// tests/unit/components/LoginForm.test.tsx
describe('LoginForm', () => {
    it('should render login form', () => { /* ... */ });
    it('should validate email', () => { /* ... */ });
    it('should submit form', () => { /* ... */ });
});
```

### 11.2 Integration Tests

```typescript
// tests/integration/auth.test.tsx
describe('Authentication Flow', () => {
    it('should login user', () => { /* ... */ });
    it('should redirect to dashboard', () => { /* ... */ });
    it('should logout user', () => { /* ... */ });
});
```

---

## 12. Performance Optimization

- Code splitting by route
- Lazy loading components
- Memoization of expensive components
- Image optimization
- Bundle size optimization

---

## 13. Accessibility

- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- Color contrast ratios
- ARIA labels

---

## 14. Dependencies (package.json)

```json
{
    "dependencies": {
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "react-router-dom": "^6.14.0",
        "@reduxjs/toolkit": "^1.9.5",
        "react-redux": "^8.1.1",
        "axios": "^1.4.0",
        "@mui/material": "^5.14.0",
        "@mui/icons-material": "^5.14.0",
        "react-hook-form": "^7.45.0",
        "zod": "^3.22.0",
        "date-fns": "^2.30.0",
        "tailwindcss": "^3.3.0"
    },
    "devDependencies": {
        "typescript": "^5.1.0",
        "vite": "^4.4.0",
        "@vitejs/plugin-react": "^4.0.0",
        "vitest": "^0.34.0",
        "@testing-library/react": "^14.0.0",
        "@testing-library/jest-dom": "^6.1.0"
    }
}
```

---

## 15. Deployment Checklist

- [ ] All components built
- [ ] All pages functional
- [ ] Tests passing
- [ ] Build optimized
- [ ] Environment variables configured
- [ ] API integration complete
- [ ] Error handling comprehensive
- [ ] Responsive design verified
- [ ] Accessibility checked
- [ ] Performance optimized

---

**Document Version**: 1.0  
**Created**: [Current Date]  
**Status**: Phase 1 Frontend Implementation
