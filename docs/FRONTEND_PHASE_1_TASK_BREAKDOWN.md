# Frontend Phase 1 - Detailed Task Breakdown
## Office Workspace Seat Allocation System

**Status**: Ready for Implementation  
**Total Estimated Time**: ~28 days (5-6 weeks)  
**Assumption**: Backend APIs are deployed and accessible

---

## Overview

This document breaks down Phase 1 into small, manageable tasks that can be completed in 2-4 hour increments. Each task has clear deliverables and can be tested independently.

---

## Phase 1A: Project Setup & Configuration (Days 1-2)

### Task 1.1: Initialize React Project
**Time**: 30 minutes  
**Priority**: Critical

**Steps**:
1. Create React + TypeScript project with Vite
2. Verify project structure
3. Test that dev server runs

**Commands**:
```bash
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
npm run dev
```

**Deliverable**: ✅ React project running on localhost

---

### Task 1.2: Install Core Dependencies
**Time**: 30 minutes  
**Priority**: Critical

**Steps**:
1. Install state management packages
2. Install routing package
3. Install HTTP client
4. Install UI library
5. Install form handling
6. Install utilities
7. Install styling tools

**Commands**:
```bash
# State Management
npm install @reduxjs/toolkit react-redux

# Routing
npm install react-router-dom

# HTTP Client
npm install axios

# UI Library
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled

# Form Handling
npm install react-hook-form zod @hookform/resolvers

# Utilities
npm install date-fns

# Styling
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Deliverable**: ✅ All packages installed and verified

---

### Task 1.3: Create Project Folder Structure
**Time**: 15 minutes  
**Priority**: Critical

**Steps**:
1. Create all directory folders
2. Create placeholder index files where needed
3. Verify structure matches plan

**Structure to Create**:
```
src/
├── components/
│   ├── Common/
│   ├── Auth/
│   ├── Admin/
│   │   ├── EmployeeManagement/
│   │   ├── TeamManagement/
│   │   └── ScheduleGeneration/
│   ├── Employee/
│   │   ├── ScheduleView/
│   │   └── ChangeRequest/
│   └── Manager/
├── pages/
├── services/
├── store/
│   └── slices/
├── hooks/
├── types/
├── utils/
└── styles/
```

**Deliverable**: ✅ Complete folder structure created

---

### Task 1.4: Configure Environment Variables
**Time**: 20 minutes  
**Priority**: Critical

**Steps**:
1. Create `.env.example` file
2. Create `.env` file for local development
3. Create `.env.development` (optional)
4. Create `.env.production` (optional)
5. Update `.gitignore` to exclude `.env`

**Files to Create**:

`.env.example`:
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_API_VERSION=v1
VITE_APP_NAME=Office Seat Allocation
```

`.env`:
```env
VITE_API_BASE_URL=http://your-backend-server-url:port
VITE_API_VERSION=v1
VITE_APP_NAME=Office Seat Allocation
```

**Deliverable**: ✅ Environment configuration ready

---

### Task 1.5: Setup API Client Base Configuration
**Time**: 45 minutes  
**Priority**: Critical

**Steps**:
1. Create `src/services/api.ts`
2. Configure axios instance with base URL
3. Add request interceptor for auth token
4. Add response interceptor for token refresh
5. Add error handling
6. Test API client setup

**File**: `src/services/api.ts`

**Key Features**:
- Base URL from environment variable
- Automatic token injection
- Automatic token refresh on 401
- Error handling

**Deliverable**: ✅ API client configured and tested

---

### Task 1.6: Configure Tailwind CSS
**Time**: 30 minutes  
**Priority**: High

**Steps**:
1. Update `tailwind.config.js` with theme colors
2. Create `src/index.css` with Tailwind directives
3. Import CSS in `main.tsx`
4. Test Tailwind is working

**Deliverable**: ✅ Tailwind CSS configured and working

---

### Task 1.7: Configure Vite for Development
**Time**: 20 minutes  
**Priority**: Medium

**Steps**:
1. Update `vite.config.ts` with proxy configuration
2. Configure path aliases (optional)
3. Test dev server with proxy

**Deliverable**: ✅ Vite configuration optimized

---

## Phase 1B: Type Definitions (Day 3)

### Task 2.1: Create Auth Types
**Time**: 30 minutes  
**Priority**: Critical

**File**: `src/types/auth.ts`

**Types to Create**:
- `User` interface
- `LoginRequest` interface
- `LoginResponse` interface
- `AuthState` interface

**Deliverable**: ✅ Auth types defined

---

### Task 2.2: Create Employee Types
**Time**: 30 minutes  
**Priority**: Critical

**File**: `src/types/employee.ts`

**Types to Create**:
- `Employee` interface
- `EmployeeInput` interface
- `EmployeeState` interface
- `EmployeeResponse` interface (for paginated responses)

**Deliverable**: ✅ Employee types defined

---

### Task 2.3: Create Team Types
**Time**: 20 minutes  
**Priority**: High

**File**: `src/types/team.ts`

**Types to Create**:
- `Team` interface
- `TeamInput` interface
- `TeamState` interface
- `TeamMember` interface

**Deliverable**: ✅ Team types defined

---

### Task 2.4: Create Schedule Types
**Time**: 30 minutes  
**Priority**: Critical

**File**: `src/types/schedule.ts`

**Types to Create**:
- `ScheduleEntry` interface
- `Schedule` interface
- `ScheduleState` interface
- `ScheduleGenerateRequest` interface

**Deliverable**: ✅ Schedule types defined

---

### Task 2.5: Create Change Request Types
**Time**: 30 minutes  
**Priority**: Critical

**File**: `src/types/changeRequest.ts`

**Types to Create**:
- `ChangeRequest` interface
- `ChangeRequestInput` interface
- `ChangeRequestState` interface

**Deliverable**: ✅ Change Request types defined

---

### Task 2.6: Create Type Index File
**Time**: 10 minutes  
**Priority**: High

**File**: `src/types/index.ts`

**Steps**:
1. Export all types from individual files
2. Create common utility types if needed

**Deliverable**: ✅ All types exported from index

---

## Phase 1C: Redux Store Setup (Day 4)

### Task 3.1: Create Redux Store Configuration
**Time**: 30 minutes  
**Priority**: Critical

**File**: `src/store/store.ts`

**Steps**:
1. Configure store with all slices
2. Setup middleware (if needed)
3. Export types (RootState, AppDispatch)
4. Create store hooks (useAppDispatch, useAppSelector)

**Deliverable**: ✅ Redux store configured

---

### Task 3.2: Create Auth Slice
**Time**: 1 hour  
**Priority**: Critical

**File**: `src/store/slices/authSlice.ts`

**Features**:
- Initial state
- Reducers: setUser, setTokens, logout, setLoading, setError
- Async thunks: login, logout, refreshToken
- Selectors

**Deliverable**: ✅ Auth slice complete with async thunks

---

### Task 3.3: Create Employee Slice
**Time**: 1 hour  
**Priority**: High

**File**: `src/store/slices/employeeSlice.ts`

**Features**:
- Initial state with pagination
- Reducers: setEmployees, addEmployee, updateEmployee, deleteEmployee
- Async thunks: fetchEmployees, createEmployee, updateEmployee, deleteEmployee
- Selectors

**Deliverable**: ✅ Employee slice complete

---

### Task 3.4: Create Team Slice
**Time**: 45 minutes  
**Priority**: High

**File**: `src/store/slices/teamSlice.ts`

**Features**:
- Initial state
- Reducers: setTeams, addTeam, updateTeam, deleteTeam
- Async thunks: fetchTeams, createTeam, updateTeam, deleteTeam
- Selectors

**Deliverable**: ✅ Team slice complete

---

### Task 3.5: Create Schedule Slice
**Time**: 1 hour  
**Priority**: High

**File**: `src/store/slices/scheduleSlice.ts`

**Features**:
- Initial state
- Reducers: setSchedules, setCurrentSchedule, updateScheduleEntry
- Async thunks: generateSchedule, fetchSchedule, publishSchedule
- Selectors

**Deliverable**: ✅ Schedule slice complete

---

### Task 3.6: Create Change Request Slice
**Time**: 1 hour  
**Priority**: High

**File**: `src/store/slices/changeRequestSlice.ts`

**Features**:
- Initial state
- Reducers: setRequests, addRequest, updateRequest
- Async thunks: fetchRequests, submitRequest, cancelRequest
- Selectors

**Deliverable**: ✅ Change Request slice complete

---

### Task 3.7: Setup Redux Provider
**Time**: 15 minutes  
**Priority**: Critical

**File**: `src/main.tsx` or `src/App.tsx`

**Steps**:
1. Import Provider from react-redux
2. Wrap app with Provider
3. Pass store to Provider
4. Test Redux is working

**Deliverable**: ✅ Redux Provider setup and working

---

## Phase 1D: API Services (Day 5-6)

### Task 4.1: Create Auth Service
**Time**: 45 minutes  
**Priority**: Critical

**File**: `src/services/authService.ts`

**Methods**:
- `login(email, password)` → POST /api/v1/auth/login
- `logout()` → POST /api/v1/auth/logout
- `refreshToken(refreshToken)` → POST /api/v1/auth/refresh

**Test**: Create test file or test manually with backend

**Deliverable**: ✅ Auth service complete and tested

---

### Task 4.2: Create Employee Service
**Time**: 1 hour  
**Priority**: High

**File**: `src/services/employeeService.ts`

**Methods**:
- `getEmployees(page, limit, filters)` → GET /api/v1/admin/employees
- `createEmployee(data)` → POST /api/v1/admin/employees
- `updateEmployee(id, data)` → PUT /api/v1/admin/employees/{id}
- `deleteEmployee(id)` → DELETE /api/v1/admin/employees/{id}

**Deliverable**: ✅ Employee service complete

---

### Task 4.3: Create Team Service
**Time**: 45 minutes  
**Priority**: High

**File**: `src/services/teamService.ts`

**Methods**:
- `getTeams()` → GET /api/v1/admin/teams
- `createTeam(data)` → POST /api/v1/admin/teams
- `updateTeam(id, data)` → PUT /api/v1/admin/teams/{id}
- `getTeamMembers(id)` → GET /api/v1/admin/teams/{id}/members

**Deliverable**: ✅ Team service complete

---

### Task 4.4: Create Schedule Service
**Time**: 1 hour  
**Priority**: High

**File**: `src/services/scheduleService.ts`

**Methods**:
- `generateSchedule(weekStart, weekEnd)` → POST /api/v1/admin/schedules/generate
- `getSchedule(id)` → GET /api/v1/admin/schedules/{id}
- `updateSchedule(id, data)` → PUT /api/v1/admin/schedules/{id}
- `publishSchedule(id)` → POST /api/v1/admin/schedules/{id}/publish
- `getScheduleEntries(id)` → GET /api/v1/admin/schedules/{id}/entries
- `getEmployeeSchedule()` → GET /api/v1/employee/schedule

**Deliverable**: ✅ Schedule service complete

---

### Task 4.5: Create Change Request Service
**Time**: 45 minutes  
**Priority**: High

**File**: `src/services/changeRequestService.ts`

**Methods**:
- `submitRequest(data)` → POST /api/v1/employee/change-requests
- `getRequests()` → GET /api/v1/employee/change-requests
- `cancelRequest(id)` → DELETE /api/v1/employee/change-requests/{id}
- `getTeamRequests()` → GET /api/v1/manager/change-requests
- `approveRequest(id, reason)` → PUT /api/v1/manager/change-requests/{id}/approve
- `rejectRequest(id, reason)` → PUT /api/v1/manager/change-requests/{id}/reject

**Deliverable**: ✅ Change Request service complete

---

## Phase 1E: Common Components (Day 7)

### Task 5.1: Create Loading Spinner Component
**Time**: 30 minutes  
**Priority**: High

**File**: `src/components/Common/LoadingSpinner.tsx`

**Features**:
- Reusable spinner
- Size variants (small, medium, large)
- Optional text prop

**Deliverable**: ✅ Loading spinner component

---

### Task 5.2: Create Error Alert Component
**Time**: 30 minutes  
**Priority**: High

**File**: `src/components/Common/ErrorAlert.tsx`

**Features**:
- Display error messages
- Dismissible
- Different severity levels

**Deliverable**: ✅ Error alert component

---

### Task 5.3: Create Success Alert Component
**Time**: 20 minutes  
**Priority**: Medium

**File**: `src/components/Common/SuccessAlert.tsx`

**Features**:
- Display success messages
- Auto-dismiss after timeout
- Dismissible

**Deliverable**: ✅ Success alert component

---

### Task 5.4: Create Header Component
**Time**: 1 hour  
**Priority**: High

**File**: `src/components/Common/Header.tsx`

**Features**:
- Logo/Branding
- User info display
- Logout button
- Responsive design

**Deliverable**: ✅ Header component

---

### Task 5.5: Create Sidebar Component
**Time**: 1.5 hours  
**Priority**: High

**File**: `src/components/Common/Sidebar.tsx`

**Features**:
- Navigation menu
- Role-based menu items
- Active route highlighting
- Collapsible (mobile)

**Deliverable**: ✅ Sidebar component

---

### Task 5.6: Create Footer Component
**Time**: 20 minutes  
**Priority**: Low

**File**: `src/components/Common/Footer.tsx`

**Features**:
- Copyright info
- Simple layout

**Deliverable**: ✅ Footer component

---

## Phase 1F: Authentication Flow (Day 8)

### Task 6.1: Create Login Form Component
**Time**: 1.5 hours  
**Priority**: Critical

**File**: `src/components/Auth/LoginForm.tsx`

**Features**:
- Email input with validation
- Password input
- Submit button
- Error display
- Loading state
- Form validation (react-hook-form + zod)

**Deliverable**: ✅ Login form component

---

### Task 6.2: Create Login Page
**Time**: 30 minutes  
**Priority**: Critical

**File**: `src/pages/LoginPage.tsx`

**Features**:
- Use LoginForm component
- Handle login submission
- Redirect on success
- Display errors

**Deliverable**: ✅ Login page complete

---

### Task 6.3: Create Protected Route Component
**Time**: 45 minutes  
**Priority**: Critical

**File**: `src/components/Auth/ProtectedRoute.tsx`

**Features**:
- Check authentication status
- Redirect to login if not authenticated
- Role-based access control
- Loading state while checking auth

**Deliverable**: ✅ Protected route component

---

### Task 6.4: Create Logout Button Component
**Time**: 30 minutes  
**Priority**: High

**File**: `src/components/Auth/LogoutButton.tsx`

**Features**:
- Logout button
- Confirm dialog (optional)
- Clear tokens and redirect

**Deliverable**: ✅ Logout button component

---

### Task 6.5: Setup Routing with Protected Routes
**Time**: 1 hour  
**Priority**: Critical

**File**: `src/App.tsx`

**Routes to Create**:
- `/login` - Public
- `/admin/*` - Protected (admin only)
- `/employee/*` - Protected (employee only)
- `/manager/*` - Protected (manager only)
- `/` - Redirect based on role

**Deliverable**: ✅ Routing setup with protection

---

### Task 6.6: Test Authentication Flow
**Time**: 30 minutes  
**Priority**: Critical

**Test Cases**:
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Token storage
- [ ] Protected route access
- [ ] Logout functionality
- [ ] Token refresh on 401

**Deliverable**: ✅ Authentication flow tested and working

---

## Phase 1G: Admin Portal - Employee Management (Days 9-11)

### Task 7.1: Create Employee Table Component
**Time**: 1.5 hours  
**Priority**: High

**File**: `src/components/Admin/EmployeeManagement/EmployeeTable.tsx`

**Features**:
- Display employees in table
- Sorting by columns
- Pagination controls
- Row actions (edit, delete)

**Deliverable**: ✅ Employee table component

---

### Task 7.2: Create Employee Form Component
**Time**: 2 hours  
**Priority**: High

**File**: `src/components/Admin/EmployeeManagement/EmployeeForm.tsx`

**Features**:
- Form fields (email, name, password, team, role, status)
- Form validation
- Create/Edit modes
- Submit handler

**Deliverable**: ✅ Employee form component

---

### Task 7.3: Create Employee Modal Component
**Time**: 1 hour  
**Priority**: High

**File**: `src/components/Admin/EmployeeManagement/EmployeeModal.tsx`

**Features**:
- Modal dialog
- Contains EmployeeForm
- Handle create/edit
- Close on success

**Deliverable**: ✅ Employee modal component

---

### Task 7.4: Create Employee List Component
**Time**: 2 hours  
**Priority**: High

**File**: `src/components/Admin/EmployeeManagement/EmployeeList.tsx`

**Features**:
- Integrate EmployeeTable
- Add employee button
- Search/filter functionality
- Connect to Redux store
- Handle CRUD operations

**Deliverable**: ✅ Employee list component

---

### Task 7.5: Create Admin Dashboard Layout
**Time**: 2 hours  
**Priority**: Critical

**File**: `src/pages/AdminDashboard.tsx`

**Features**:
- Header and Sidebar
- Tab navigation (Employees, Teams, Schedules)
- Content area
- Role-based access

**Deliverable**: ✅ Admin dashboard layout

---

### Task 7.6: Integrate Employee Management with Backend
**Time**: 1 hour  
**Priority**: Critical

**Test Integration**:
- [ ] Fetch employees from API
- [ ] Create employee via API
- [ ] Update employee via API
- [ ] Delete employee via API
- [ ] Pagination working
- [ ] Filters working

**Deliverable**: ✅ Employee management fully integrated

---

## Phase 1H: Admin Portal - Team Management (Days 12-13)

### Task 8.1: Create Team Table Component
**Time**: 1 hour  
**Priority**: High

**File**: `src/components/Admin/TeamManagement/TeamTable.tsx`

**Features**:
- Display teams in table
- Team lead information
- Member count
- Row actions

**Deliverable**: ✅ Team table component

---

### Task 8.2: Create Team Form Component
**Time**: 1.5 hours  
**Priority**: High

**File**: `src/components/Admin/TeamManagement/TeamForm.tsx`

**Features**:
- Form fields (name, description, team_lead_id)
- Form validation
- Create/Edit modes

**Deliverable**: ✅ Team form component

---

### Task 8.3: Create Team Modal Component
**Time**: 45 minutes  
**Priority**: High

**File**: `src/components/Admin/TeamManagement/TeamModal.tsx`

**Features**:
- Modal dialog
- Contains TeamForm
- Handle create/edit

**Deliverable**: ✅ Team modal component

---

### Task 8.4: Create Team List Component
**Time**: 1.5 hours  
**Priority**: High

**File**: `src/components/Admin/TeamManagement/TeamList.tsx`

**Features**:
- Integrate TeamTable
- Add team button
- Connect to Redux store
- Handle CRUD operations

**Deliverable**: ✅ Team list component

---

### Task 8.5: Integrate Team Management with Backend
**Time**: 1 hour  
**Priority**: Critical

**Test Integration**:
- [ ] Fetch teams from API
- [ ] Create team via API
- [ ] Update team via API
- [ ] Get team members via API

**Deliverable**: ✅ Team management fully integrated

---

## Phase 1I: Admin Portal - Schedule Generation (Days 14-16)

### Task 9.1: Create Schedule Generator Component
**Time**: 2 hours  
**Priority**: High

**File**: `src/components/Admin/ScheduleGeneration/ScheduleGenerator.tsx`

**Features**:
- Week date picker
- Generate button
- Loading state
- Error handling

**Deliverable**: ✅ Schedule generator component

---

### Task 9.2: Create Schedule Table Component
**Time**: 2 hours  
**Priority**: High

**File**: `src/components/Admin/ScheduleGeneration/ScheduleTable.tsx`

**Features**:
- Display schedule entries
- Group by employee or by day
- Show office/WFH days
- Editable entries (optional)

**Deliverable**: ✅ Schedule table component

---

### Task 9.3: Create Schedule Preview Component
**Time**: 1.5 hours  
**Priority**: High

**File**: `src/components/Admin/ScheduleGeneration/SchedulePreview.tsx`

**Features**:
- Display generated schedule
- Visual representation
- Summary statistics
- Edit capability

**Deliverable**: ✅ Schedule preview component

---

### Task 9.4: Create Publish Dialog Component
**Time**: 1 hour  
**Priority**: High

**File**: `src/components/Admin/ScheduleGeneration/PublishDialog.tsx`

**Features**:
- Confirmation dialog
- Warning message
- Publish button
- Cancel button

**Deliverable**: ✅ Publish dialog component

---

### Task 9.5: Integrate Schedule Generation with Backend
**Time**: 1.5 hours  
**Priority**: Critical

**Test Integration**:
- [ ] Generate schedule via API
- [ ] Fetch schedule details
- [ ] Update schedule entries
- [ ] Publish schedule
- [ ] View schedule entries

**Deliverable**: ✅ Schedule generation fully integrated

---

## Phase 1J: Employee Portal - Schedule View (Days 17-18)

### Task 10.1: Create Schedule Card Component
**Time**: 1 hour  
**Priority**: High

**File**: `src/components/Employee/ScheduleView/ScheduleCard.tsx`

**Features**:
- Display single week schedule
- Show office/WFH days
- Color coding
- Date range display

**Deliverable**: ✅ Schedule card component

---

### Task 10.2: Create Schedule Calendar Component
**Time**: 2 hours  
**Priority**: High

**File**: `src/components/Employee/ScheduleView/ScheduleCalendar.tsx`

**Features**:
- Calendar view of schedule
- 4-week display
- Office/WFH indicators
- Export to calendar (optional)

**Deliverable**: ✅ Schedule calendar component

---

### Task 10.3: Create Schedule View Component
**Time**: 1.5 hours  
**Priority**: High

**File**: `src/components/Employee/ScheduleView/ScheduleView.tsx`

**Features**:
- Integrate ScheduleCalendar
- Fetch schedule from API
- Loading state
- Error handling

**Deliverable**: ✅ Schedule view component

---

### Task 10.4: Create Employee Dashboard
**Time**: 1.5 hours  
**Priority**: Critical

**File**: `src/pages/EmployeeDashboard.tsx`

**Features**:
- Header and Sidebar
- Schedule view section
- Change request section
- Request history section

**Deliverable**: ✅ Employee dashboard

---

### Task 10.5: Integrate Employee Schedule with Backend
**Time**: 1 hour  
**Priority**: Critical

**Test Integration**:
- [ ] Fetch employee schedule from API
- [ ] Display schedule correctly
- [ ] Handle no schedule case

**Deliverable**: ✅ Employee schedule fully integrated

---

## Phase 1K: Employee Portal - Change Requests (Days 19-21)

### Task 11.1: Create Request Status Badge Component
**Time**: 30 minutes  
**Priority**: Medium

**File**: `src/components/Employee/ChangeRequest/RequestStatusBadge.tsx`

**Features**:
- Display request status
- Color coding (pending, approved, rejected, cancelled)
- Icon indicators

**Deliverable**: ✅ Status badge component

---

### Task 11.2: Create Request Card Component
**Time**: 1 hour  
**Priority**: High

**File**: `src/components/Employee/ChangeRequest/RequestCard.tsx`

**Features**:
- Display change request details
- Show current day and requested day
- Show reason
- Show status
- Cancel button (if pending)

**Deliverable**: ✅ Request card component

---

### Task 11.3: Create Change Request Form Component
**Time**: 2 hours  
**Priority**: High

**File**: `src/components/Employee/ChangeRequest/ChangeRequestForm.tsx`

**Features**:
- Current day display (read-only)
- Requested day dropdown
- Reason textarea
- Form validation (2-day advance notice)
- Available seats display
- Submit button

**Deliverable**: ✅ Change request form component

---

### Task 11.4: Create Change Request History Component
**Time**: 1.5 hours  
**Priority**: High

**File**: `src/components/Employee/ChangeRequest/ChangeRequestHistory.tsx`

**Features**:
- List of all change requests
- Use RequestCard component
- Sort by date
- Filter by status

**Deliverable**: ✅ Change request history component

---

### Task 11.5: Integrate Change Requests with Backend
**Time**: 1.5 hours  
**Priority**: Critical

**Test Integration**:
- [ ] Submit change request via API
- [ ] Fetch change requests from API
- [ ] Cancel change request via API
- [ ] Validation working (2-day advance)

**Deliverable**: ✅ Change requests fully integrated

---

## Phase 1L: Manager Portal (Days 22-23)

### Task 12.1: Create Team Schedule Component
**Time**: 2 hours  
**Priority**: High

**File**: `src/components/Manager/TeamSchedule.tsx`

**Features**:
- Display team schedule
- Show all team members
- Filter by week
- Export option

**Deliverable**: ✅ Team schedule component

---

### Task 12.2: Create Team Change Requests Component
**Time**: 2.5 hours  
**Priority**: High

**File**: `src/components/Manager/TeamChangeRequests.tsx`

**Features**:
- List team change requests
- Approve button
- Reject button
- Decision reason input
- Filter by status

**Deliverable**: ✅ Team change requests component

---

### Task 12.3: Create Manager Dashboard
**Time**: 1.5 hours  
**Priority**: Critical

**File**: `src/pages/ManagerDashboard.tsx`

**Features**:
- Header and Sidebar
- Team schedule section
- Change requests section
- Team members section

**Deliverable**: ✅ Manager dashboard

---

### Task 12.4: Integrate Manager Features with Backend
**Time**: 1.5 hours  
**Priority**: Critical

**Test Integration**:
- [ ] Fetch team change requests from API
- [ ] Approve request via API
- [ ] Reject request via API

**Deliverable**: ✅ Manager features fully integrated

---

## Phase 1M: Error Handling & Polish (Days 24-28)

### Task 13.1: Add Global Error Boundary
**Time**: 1 hour  
**Priority**: High

**File**: `src/components/Common/ErrorBoundary.tsx`

**Features**:
- Catch React errors
- Display error message
- Reload button

**Deliverable**: ✅ Error boundary implemented

---

### Task 13.2: Add Loading States Everywhere
**Time**: 2 hours  
**Priority**: High

**Steps**:
1. Add loading states to all async operations
2. Use LoadingSpinner component
3. Add skeleton loaders where appropriate

**Deliverable**: ✅ Loading states added throughout

---

### Task 13.3: Add Toast Notifications
**Time**: 1.5 hours  
**Priority**: High

**Steps**:
1. Install toast library (react-toastify or similar)
2. Add success notifications
3. Add error notifications
4. Add info notifications

**Deliverable**: ✅ Toast notifications working

---

### Task 13.4: Improve Error Messages
**Time**: 2 hours  
**Priority**: High

**Steps**:
1. Create user-friendly error messages
2. Handle API errors gracefully
3. Show validation errors inline
4. Add error recovery options

**Deliverable**: ✅ Error messages improved

---

### Task 13.5: Make Responsive Design
**Time**: 3 hours  
**Priority**: High

**Steps**:
1. Test on mobile devices
2. Adjust layouts for mobile
3. Make tables responsive
4. Adjust navigation for mobile
5. Test on tablets

**Deliverable**: ✅ Responsive design complete

---

### Task 13.6: Add Form Validation Everywhere
**Time**: 2 hours  
**Priority**: Medium

**Steps**:
1. Review all forms
2. Add validation rules
3. Add error messages
4. Test validation

**Deliverable**: ✅ All forms validated

---

### Task 13.7: Performance Optimization
**Time**: 2 hours  
**Priority**: Medium

**Steps**:
1. Code splitting by route
2. Lazy load components
3. Memoize expensive components
4. Optimize images
5. Check bundle size

**Deliverable**: ✅ Performance optimized

---

### Task 13.8: Final Testing & Bug Fixes
**Time**: 4 hours  
**Priority**: Critical

**Test Checklist**:
- [ ] All authentication flows
- [ ] All CRUD operations
- [ ] All API integrations
- [ ] Error handling
- [ ] Loading states
- [ ] Responsive design
- [ ] Form validations
- [ ] Navigation
- [ ] Role-based access

**Deliverable**: ✅ All features tested and bugs fixed

---

## Summary

### Total Tasks: 78 tasks
### Estimated Time: ~140 hours (28 days @ 5 hours/day)

### Task Distribution:
- **Setup & Configuration**: 7 tasks (Day 1-2)
- **Type Definitions**: 6 tasks (Day 3)
- **Redux Store**: 7 tasks (Day 4)
- **API Services**: 5 tasks (Day 5-6)
- **Common Components**: 6 tasks (Day 7)
- **Authentication**: 6 tasks (Day 8)
- **Employee Management**: 6 tasks (Days 9-11)
- **Team Management**: 5 tasks (Days 12-13)
- **Schedule Generation**: 5 tasks (Days 14-16)
- **Employee Schedule**: 5 tasks (Days 17-18)
- **Change Requests**: 5 tasks (Days 19-21)
- **Manager Portal**: 4 tasks (Days 22-23)
- **Polish & Testing**: 8 tasks (Days 24-28)

---

## Quick Reference

### Daily Workflow:
1. Pick a task from the list
2. Read the task details
3. Complete the task
4. Test the deliverable
5. Mark as complete
6. Move to next task

### Priority Levels:
- **Critical**: Must be done first, blocks other work
- **High**: Important, should be done soon
- **Medium**: Nice to have, can be done later
- **Low**: Optional, lowest priority

---

**Document Version**: 1.0  
**Created**: 2024-12-19  
**Status**: Ready for Implementation

