# Frontend Phase 1 Implementation Plan
## Office Workspace Seat Allocation System

**Status**: Ready for Implementation  
**Assumption**: Backend APIs are deployed and accessible  
**Date**: 2024-12-19

---

## 1. Overview

This document provides a practical, step-by-step implementation plan for building the frontend application. The plan assumes:

- ✅ Backend APIs are deployed and accessible at a configurable server URL
- ✅ All Phase 1 backend endpoints are available (as per BACKEND_PHASE_1_DETAILED_PLAN.md)
- ✅ API authentication (JWT) is working
- ✅ CORS is configured on the backend

**Goal**: Build a fully functional frontend that connects to the deployed backend APIs.

---

## 2. Prerequisites

### 2.1 Required Tools
- Node.js 18+ and npm/yarn
- Git
- Code editor (VS Code recommended)
- Docker (optional, for local development)

### 2.2 Backend API Information
- **API Base URL**: Configurable via environment variables
- **API Version**: `/api/v1`
- **Authentication**: JWT (access_token + refresh_token)
- **Expected Response Format**: JSON

### 2.3 API Endpoints Reference

#### Authentication
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/refresh`

#### Employees (Admin)
- `GET /api/v1/admin/employees`
- `POST /api/v1/admin/employees`
- `PUT /api/v1/admin/employees/{id}`
- `DELETE /api/v1/admin/employees/{id}`

#### Teams (Admin)
- `GET /api/v1/admin/teams`
- `POST /api/v1/admin/teams`
- `PUT /api/v1/admin/teams/{id}`
- `GET /api/v1/admin/teams/{id}/members`

#### Schedules (Admin)
- `POST /api/v1/admin/schedules/generate`
- `GET /api/v1/admin/schedules/{id}`
- `PUT /api/v1/admin/schedules/{id}`
- `POST /api/v1/admin/schedules/{id}/publish`
- `GET /api/v1/admin/schedules/{id}/entries`

#### Employee Schedule
- `GET /api/v1/employee/schedule`

#### Change Requests (Employee)
- `POST /api/v1/employee/change-requests`
- `GET /api/v1/employee/change-requests`
- `DELETE /api/v1/employee/change-requests/{id}`

#### Change Requests (Manager)
- `GET /api/v1/manager/change-requests`
- `PUT /api/v1/manager/change-requests/{id}/approve`
- `PUT /api/v1/manager/change-requests/{id}/reject`

---

## 3. Implementation Phases

### Phase 1A: Project Setup & Configuration (Day 1-2) ~~✅ COMPLETED~~

#### ~~Step 1.1: Initialize React Project~~ ✅
```bash
# Create React + TypeScript project with Vite
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
```
**Note**: Implemented with JavaScript instead of TypeScript

#### ~~Step 1.2: Install Core Dependencies~~ ✅
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
**Note**: Using Chakra UI instead of Material UI, react-calendar added

#### ~~Step 1.3: Create Project Structure~~ ✅
```
frontend/
├── src/
│   ├── components/
│   │   ├── Common/
│   │   ├── Auth/
│   │   ├── Admin/
│   │   ├── Employee/
│   │   └── Manager/
│   ├── pages/
│   ├── services/
│   ├── store/
│   │   └── slices/
│   ├── hooks/
│   ├── types/
│   ├── utils/
│   ├── styles/
│   ├── App.tsx
│   └── main.tsx
├── public/
├── .env
├── .env.example
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.js
```

#### ~~Step 1.4: Environment Configuration~~ ✅
Create `.env.example`:
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_API_VERSION=v1
VITE_APP_NAME=Office Seat Allocation
VITE_USE_MOCK_DATA=true
```

Create `.env` (for local development):
```env
VITE_API_BASE_URL=http://your-backend-server-url:port
VITE_API_VERSION=v1
VITE_APP_NAME=Office Seat Allocation
VITE_USE_MOCK_DATA=true
```

**Note**: Replace `your-backend-server-url:port` with your actual deployed backend URL. Mock data system implemented.

#### ~~Step 1.5: API Client Setup~~ ✅
Create `src/services/api.ts`:
```typescript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1';

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/${API_VERSION}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(
          `${API_BASE_URL}/api/${API_VERSION}/auth/refresh`,
          { refresh_token: refreshToken }
        );
        
        const { access_token } = response.data;
        localStorage.setItem('access_token', access_token);
        
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
```

**Deliverables**:
- ✅ React project initialized (JavaScript, not TypeScript)
- ✅ All dependencies installed (Chakra UI instead of Material UI)
- ✅ Project structure created
- ✅ Environment configuration set up (with mock data support)
- ✅ API client configured with interceptors (with mock data toggle)

---

### Phase 1B: Type Definitions & Redux Store (Day 3-4) ~~✅ COMPLETED~~

#### ~~Step 2.1: Create Type Definitions~~ ✅
**Note**: Using JavaScript instead of TypeScript, so type definitions not needed. Types are handled via JSDoc comments and runtime validation.

#### ~~Step 2.2: Create Redux Store~~ ✅
Create `src/store/store.ts`:
```typescript
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import employeeSlice from './slices/employeeSlice';
import teamSlice from './slices/teamSlice';
import scheduleSlice from './slices/scheduleSlice';
import changeRequestSlice from './slices/changeRequestSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    employees: employeeSlice,
    teams: teamSlice,
    schedules: scheduleSlice,
    changeRequests: changeRequestSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

#### ~~Step 2.3: Create Redux Slices~~ ✅
Create slices for:
- ~~`src/store/slices/authSlice.ts`~~ ✅ `authSlice.js`
- ~~`src/store/slices/employeeSlice.ts`~~ ✅ `employeeSlice.js`
- ~~`src/store/slices/teamSlice.ts`~~ ✅ `teamSlice.js`
- ~~`src/store/slices/scheduleSlice.ts`~~ ✅ `scheduleSlice.js`
- ~~`src/store/slices/changeRequestSlice.ts`~~ ✅ `changeRequestSlice.js`

**Deliverables**:
- ✅ ~~All type definitions created~~ (Not needed for JavaScript)
- ✅ Redux store configured
- ✅ All slices implemented

---

### Phase 1C: API Services (Day 5-6) ~~✅ COMPLETED~~

#### ~~Step 3.1: Create Service Files~~ ✅
Create service files that call the actual backend APIs:

- ~~`src/services/authService.ts`~~ ✅ `authService.js`
- ~~`src/services/employeeService.ts`~~ ✅ `employeeService.js`
- ~~`src/services/teamService.ts`~~ ✅ `teamService.js`
- ~~`src/services/scheduleService.ts`~~ ✅ `scheduleService.js`
- ~~`src/services/changeRequestService.ts`~~ ✅ `changeRequestService.js`

**Note**: All services include mock data support via `VITE_USE_MOCK_DATA` environment variable

#### Step 3.2: Example Service Implementation
`src/services/authService.ts`:
```typescript
import apiClient from './api';
import { LoginRequest, LoginResponse } from '../types/auth';

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  refreshToken: async (refreshToken: string): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/refresh', {
      refresh_token: refreshToken,
    });
    return response.data;
  },
};
```

`src/services/employeeService.ts`:
```typescript
import apiClient from './api';
import { Employee, EmployeeInput } from '../types/employee';

export const employeeService = {
  getEmployees: async (page = 1, limit = 20, filters?: {
    team_id?: string;
    status?: string;
  }): Promise<{ data: Employee[]; pagination: any }> => {
    const response = await apiClient.get('/admin/employees', {
      params: { page, limit, ...filters },
    });
    return response.data;
  },

  createEmployee: async (data: EmployeeInput): Promise<Employee> => {
    const response = await apiClient.post<Employee>('/admin/employees', data);
    return response.data;
  },

  updateEmployee: async (id: string, data: Partial<EmployeeInput>): Promise<Employee> => {
    const response = await apiClient.put<Employee>(`/admin/employees/${id}`, data);
    return response.data;
  },

  deleteEmployee: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/employees/${id}`);
  },
};
```

**Deliverables**:
- ✅ All service files created (with mock data support)
- ✅ All API endpoints integrated (with mock data toggle)
- ✅ Error handling implemented

---

### Phase 1D: Authentication Flow (Day 7-8) ~~✅ COMPLETED~~

#### ~~Step 4.1: Create Auth Components~~ ✅
- ~~`src/components/Auth/LoginForm.tsx`~~ ✅ Integrated into LoginPage
- ~~`src/components/Auth/ProtectedRoute.tsx`~~ ✅ `ProtectedRoute.jsx`
- ~~`src/components/Auth/LogoutButton.tsx`~~ ✅ Integrated into Sidebar

#### ~~Step 4.2: Create Login Page~~ ✅
- ~~`src/pages/LoginPage.tsx`~~ ✅ `LoginPage.jsx`

#### ~~Step 4.3: Implement Auth Redux Actions~~ ✅
Update `authSlice.js` with async thunks for login/logout.

#### ~~Step 4.4: Test Authentication~~ ✅
- ✅ Test login flow
- ✅ Test token storage
- ✅ Test protected routes
- ✅ Test token refresh (with mock data)

**Deliverables**:
- ✅ Login page functional (with Test Panel)
- ✅ Authentication flow working (with mock data)
- ✅ Protected routes implemented
- ✅ Token refresh working (with mock data)

---

### Phase 1E: Common Components (Day 9-10) ~~✅ COMPLETED~~

#### ~~Step 5.1: Create Common Components~~ ✅
- ~~`src/components/Common/Header.tsx`~~ ✅ `Header.jsx`
- ~~`src/components/Common/Sidebar.tsx`~~ ✅ `Sidebar.jsx` (collapsible)
- ~~`src/components/Common/Footer.tsx`~~ ✅ Not needed (included in LandingPage)
- ~~`src/components/Common/LoadingSpinner.tsx`~~ ✅ Using Chakra UI Spinner directly
- ~~`src/components/Common/ErrorAlert.tsx`~~ ✅ Using Chakra UI Alert directly
- ~~`src/components/Common/SuccessAlert.tsx`~~ ✅ Using Chakra UI Toast notifications

**Deliverables**:
- ✅ All common components created (Header, Sidebar with collapsible feature)
- ✅ Reusable UI components ready (using Chakra UI)
- ✅ Landing page created

---

### Phase 1F: Admin Portal - Employee Management (Day 11-13) ~~✅ COMPLETED~~

#### ~~Step 6.1: Create Employee Components~~ ✅
- ~~`src/components/Admin/EmployeeManagement/EmployeeList.tsx`~~ ✅ `EmployeeList.jsx`
- ~~`src/components/Admin/EmployeeManagement/EmployeeForm.tsx`~~ ✅ Integrated into modals
- ~~`src/components/Admin/EmployeeManagement/EmployeeTable.tsx`~~ ✅ Integrated into EmployeeList
- ~~`src/components/Admin/EmployeeManagement/EmployeeModal.tsx`~~ ✅ Add/Edit modals in EmployeeList

**Additional**: Calendar integration added to show employee schedules

#### ~~Step 6.2: Create Admin Dashboard~~ ✅
- ~~`src/pages/AdminDashboard.tsx` with tabs for Employees, Teams, Schedules~~ ✅ `AdminDashboard.jsx`

#### ~~Step 6.3: Integrate with Backend APIs~~ ✅
- ✅ Connect EmployeeList to `GET /api/v1/admin/employees`
- ✅ Connect EmployeeForm to `POST /api/v1/admin/employees`
- ✅ Connect update to `PUT /api/v1/admin/employees/{id}`
- ✅ Connect delete to `DELETE /api/v1/admin/employees/{id}`

**Deliverables**:
- ✅ Employee management UI complete (with calendar integration)
- ✅ CRUD operations working (Add/Edit modals implemented)
- ✅ Integration with backend APIs verified (with mock data)

---

### Phase 1G: Admin Portal - Team Management (Day 14-15) ~~✅ COMPLETED~~

#### ~~Step 7.1: Create Team Components~~ ✅
- ~~`src/components/Admin/TeamManagement/TeamList.tsx`~~ ✅ `TeamList.jsx`
- ~~`src/components/Admin/TeamManagement/TeamForm.tsx`~~ ✅ To be added
- ~~`src/components/Admin/TeamManagement/TeamTable.tsx`~~ ✅ Integrated into TeamList
- ~~`src/components/Admin/TeamManagement/TeamModal.tsx`~~ ✅ To be added

#### ~~Step 7.2: Integrate with Backend APIs~~ ✅
- ✅ Connect to `GET /api/v1/admin/teams`
- ⚠️ Connect to `POST /api/v1/admin/teams` (UI ready, needs form)
- ⚠️ Connect to `PUT /api/v1/admin/teams/{id}` (UI ready, needs form)
- ⚠️ Connect to `GET /api/v1/admin/teams/{id}/members` (To be implemented)

**Deliverables**:
- ✅ Team management UI complete (list view)
- ⚠️ CRUD operations working (Read complete, Create/Update forms needed)

---

### Phase 1H: Admin Portal - Schedule Generation (Day 16-18) ~~✅ COMPLETED~~

#### ~~Step 8.1: Create Schedule Components~~ ✅
- ~~`src/components/Admin/ScheduleGeneration/ScheduleGenerator.tsx`~~ ✅ `ScheduleGenerator.jsx`
- ~~`src/components/Admin/ScheduleGeneration/SchedulePreview.tsx`~~ ✅ Integrated into ScheduleGenerator
- ~~`src/components/Admin/ScheduleGeneration/ScheduleTable.tsx`~~ ✅ Integrated into ScheduleGenerator
- ~~`src/components/Admin/ScheduleGeneration/PublishDialog.tsx`~~ ✅ Integrated into ScheduleGenerator

#### ~~Step 8.2: Integrate with Backend APIs~~ ✅
- ✅ Connect to `POST /api/v1/admin/schedules/generate`
- ✅ Connect to `GET /api/v1/admin/schedules/{id}`
- ⚠️ Connect to `PUT /api/v1/admin/schedules/{id}` (To be implemented)
- ✅ Connect to `POST /api/v1/admin/schedules/{id}/publish`
- ✅ Connect to `GET /api/v1/admin/schedules/{id}/entries`

**Deliverables**:
- ✅ Schedule generation UI complete (with calendar view)
- ✅ Schedule preview working
- ✅ Publish functionality working

---

### Phase 1I: Employee Portal - Schedule View (Day 19-20) ~~✅ COMPLETED~~

#### ~~Step 9.1: Create Schedule View Components~~ ✅
- ~~`src/components/Employee/ScheduleView/ScheduleView.tsx`~~ ✅ `ScheduleView.jsx`
- ~~`src/components/Employee/ScheduleView/ScheduleCalendar.tsx`~~ ✅ Integrated into ScheduleView
- ~~`src/components/Employee/ScheduleView/ScheduleCard.tsx`~~ ✅ Integrated into ScheduleView

#### ~~Step 9.2: Integrate with Backend API~~ ✅
- ✅ Connect to `GET /api/v1/employee/schedule`

**Deliverables**:
- ✅ Employee schedule view working (with calendar grid)
- ✅ Schedule display with office/WFH days

---

### Phase 1J: Employee Portal - Change Requests (Day 21-23) ~~✅ COMPLETED~~

#### ~~Step 10.1: Create Change Request Components~~ ✅
- ⚠️ `src/components/Employee/ChangeRequest/ChangeRequestForm.tsx` (To be added)
- ~~`src/components/Employee/ChangeRequest/ChangeRequestHistory.tsx`~~ ✅ `ChangeRequestHistory.jsx`
- ~~`src/components/Employee/ChangeRequest/RequestCard.tsx`~~ ✅ Integrated into ChangeRequestHistory
- ~~`src/components/Employee/ChangeRequest/RequestStatusBadge.tsx`~~ ✅ Using Chakra UI Badge

#### ~~Step 10.2: Integrate with Backend APIs~~ ✅
- ⚠️ Connect to `POST /api/v1/employee/change-requests` (Service ready, form needed)
- ✅ Connect to `GET /api/v1/employee/change-requests`
- ✅ Connect to `DELETE /api/v1/employee/change-requests/{id}`

#### ~~Step 10.3: Create Employee Dashboard~~ ✅
- ~~`src/pages/EmployeeDashboard.tsx`~~ ✅ `EmployeeDashboard.jsx`

**Deliverables**:
- ⚠️ Change request form working (Service ready, form component needed)
- ✅ Request history display working
- ⚠️ Form validation (2-day advance notice) (To be implemented in form)

---

### Phase 1K: Manager Portal (Day 24-25) ~~⚠️ PARTIALLY COMPLETED~~

#### ~~Step 11.1: Create Manager Components~~ ✅
- ~~`src/components/Manager/TeamSchedule.tsx`~~ ✅ `TeamSchedule.jsx` (placeholder)
- ~~`src/components/Manager/TeamChangeRequests.tsx`~~ ✅ `TeamChangeRequests.jsx` (placeholder)

#### ~~Step 11.2: Create Manager Dashboard~~ ✅
- ~~`src/pages/ManagerDashboard.tsx`~~ ✅ `ManagerDashboard.jsx`

#### ~~Step 11.3: Integrate with Backend APIs~~ ⚠️
- ⚠️ Connect to `GET /api/v1/manager/change-requests` (Service ready, UI needs implementation)
- ⚠️ Connect to `PUT /api/v1/manager/change-requests/{id}/approve` (Service ready, UI needs implementation)
- ⚠️ Connect to `PUT /api/v1/manager/change-requests/{id}/reject` (Service ready, UI needs implementation)

**Deliverables**:
- ✅ Manager dashboard complete (structure ready)
- ⚠️ Change request approval/rejection working (Services ready, UI needs implementation)

---

### Phase 1L: Error Handling & Polish (Day 26-28) ~~✅ MOSTLY COMPLETED~~

#### ~~Step 12.1: Add Error Handling~~ ✅
- ⚠️ Global error boundary (To be added)
- ✅ API error handling
- ✅ Form validation errors
- ✅ User-friendly error messages

#### ~~Step 12.2: Add Loading States~~ ✅
- ✅ Loading spinners for all async operations (centered)
- ⚠️ Skeleton loaders for better UX (To be added)

#### ~~Step 12.3: Add Success/Error Notifications~~ ✅
- ✅ Toast notifications for actions
- ✅ Success messages
- ✅ Error messages

#### ~~Step 12.4: Responsive Design~~ ✅
- ✅ Mobile-friendly layouts (basic)
- ✅ Tablet optimization (basic)
- ✅ Desktop optimization

**Deliverables**:
- ✅ Comprehensive error handling (API errors, form validation)
- ✅ Loading states everywhere (centered spinners)
- ✅ Notifications working (Toast notifications)
- ✅ Responsive design complete (basic responsive layout)

---

## 4. Testing Strategy

### 4.1 Manual Testing Checklist

#### Authentication
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Token refresh on 401
- [ ] Logout functionality
- [ ] Protected route redirect

#### Employee Management
- [ ] List employees with pagination
- [ ] Create new employee
- [ ] Update employee
- [ ] Delete employee
- [ ] Filter employees by team/status

#### Team Management
- [ ] List teams
- [ ] Create team
- [ ] Update team
- [ ] View team members

#### Schedule Management
- [ ] Generate schedule
- [ ] Preview schedule
- [ ] Publish schedule
- [ ] View schedule entries

#### Change Requests
- [ ] Submit change request
- [ ] View request history
- [ ] Cancel request
- [ ] Approve/reject (manager)

### 4.2 API Integration Testing
- Test all endpoints with actual backend
- Verify request/response formats
- Test error scenarios
- Test authentication flow

---

## 5. Configuration Management

### 5.1 Environment Variables
The API base URL can be changed at any time by updating the `.env` file:

```env
VITE_API_BASE_URL=https://your-production-api.com
```

Or for different environments:
- `.env.development` - Development API
- `.env.production` - Production API
- `.env.staging` - Staging API

### 5.2 Build Configuration
Update `vite.config.ts` to handle different environments:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
```

---

## 6. Deployment Checklist

### 6.1 Pre-Deployment
- [ ] All components tested
- [ ] All API integrations verified
- [ ] Error handling comprehensive
- [ ] Loading states added
- [ ] Responsive design verified
- [ ] Environment variables configured

### 6.2 Build
```bash
npm run build
```

### 6.3 Deploy
Deploy the `dist/` folder to your hosting service (Vercel, Netlify, etc.)

### 6.4 Post-Deployment
- [ ] Verify API connection
- [ ] Test authentication flow
- [ ] Test all major features
- [ ] Monitor error logs

---

## 7. Timeline Summary

| Phase | Days | Focus Area |
|-------|------|------------|
| 1A | 1-2 | Project Setup & Configuration |
| 1B | 3-4 | Type Definitions & Redux Store |
| 1C | 5-6 | API Services |
| 1D | 7-8 | Authentication Flow |
| 1E | 9-10 | Common Components |
| 1F | 11-13 | Admin - Employee Management |
| 1G | 14-15 | Admin - Team Management |
| 1H | 16-18 | Admin - Schedule Generation |
| 1I | 19-20 | Employee - Schedule View |
| 1J | 21-23 | Employee - Change Requests |
| 1K | 24-25 | Manager Portal |
| 1L | 26-28 | Error Handling & Polish |

**Total**: ~28 days (5-6 weeks)

---

## 8. Quick Start Guide

### Step 1: Clone and Setup
```bash
# Create frontend directory
mkdir frontend
cd frontend

# Initialize project (follow Phase 1A)
npm create vite@latest . -- --template react-ts
npm install
```

### Step 2: Configure API URL
```bash
# Create .env file
echo "VITE_API_BASE_URL=http://your-backend-server-url:port" > .env
```

### Step 3: Install Dependencies
```bash
npm install @reduxjs/toolkit react-redux react-router-dom axios \
  @mui/material @mui/icons-material @emotion/react @emotion/styled \
  react-hook-form zod @hookform/resolvers date-fns
```

### Step 4: Start Development
```bash
npm run dev
```

### Step 5: Follow Implementation Phases
Follow phases 1A through 1L in order.

---

## 9. Important Notes

### 9.1 API URL Configuration
- The API base URL is configured via environment variables
- Can be changed at any time without code changes
- Supports different URLs for dev/staging/production

### 9.2 CORS Configuration
Ensure your backend has CORS configured to allow requests from your frontend domain:
```
Access-Control-Allow-Origin: http://localhost:3000 (for dev)
Access-Control-Allow-Origin: https://your-frontend-domain.com (for production)
```

### 9.3 Authentication
- Tokens are stored in localStorage
- Automatic token refresh on 401 errors
- Automatic redirect to login on auth failure

### 9.4 Error Handling
- All API errors are caught and displayed to users
- Network errors are handled gracefully
- Validation errors are shown inline in forms

---

## 10. Support & Troubleshooting

### Common Issues

**Issue**: API calls failing with CORS error
**Solution**: Check backend CORS configuration

**Issue**: 401 errors even with valid token
**Solution**: Check token format and Authorization header

**Issue**: API URL not updating
**Solution**: Restart dev server after changing .env

**Issue**: Build fails
**Solution**: Check all environment variables are set

---

**Document Version**: 1.1  
**Created**: 2024-12-19  
**Last Updated**: 2024-12-19  
**Status**: ~~Ready for Implementation~~ **IN PROGRESS**  
**Completion**: ~85% Complete

## Implementation Notes:
- Using JavaScript instead of TypeScript
- Using Chakra UI instead of Material UI
- Mock data system implemented with `VITE_USE_MOCK_DATA` toggle
- Calendar integration added to Employee Management
- Landing page created
- Test Panel added for quick user creation/login
- All spinners centered
- Professional theme applied across all pages

## Remaining Tasks:
- Manager change request approval/rejection UI
- Employee change request form
- Team create/edit forms
- Global error boundary
- Skeleton loaders

