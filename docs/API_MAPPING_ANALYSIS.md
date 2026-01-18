# API Mapping Analysis - Frontend vs Backend

**Date**: 2024-12-19  
**Status**: Analysis Complete - Missing APIs Identified

---

## Summary

This document compares the APIs defined in the Postman collection (`backend/Office_Seat_Allocation_API.postman_collection.json`) with the frontend service implementations.

**Total APIs in Postman**: 40+  
**APIs Implemented in Frontend**: 20  
**APIs Missing**: 20+

---

## API Coverage by Category

### ✅ Authentication (3/3) - 100% Complete
- ✅ POST `/auth/login`
- ✅ POST `/auth/refresh`
- ✅ POST `/auth/logout`

### ⚠️ Admin - Employees (4/5) - 80% Complete
- ✅ GET `/admin/employees` (with pagination)
- ❌ **MISSING**: GET `/admin/employees/:id`
- ✅ POST `/admin/employees`
- ✅ PUT `/admin/employees/:id`
- ✅ DELETE `/admin/employees/:id`

### ⚠️ Admin - Teams (4/6) - 67% Complete
- ✅ GET `/admin/teams`
- ❌ **MISSING**: GET `/admin/teams/:id`
- ✅ POST `/admin/teams`
- ✅ PUT `/admin/teams/:id`
- ❌ **MISSING**: DELETE `/admin/teams/:id`
- ✅ GET `/admin/teams/:id/members`

### ⚠️ Admin - Schedules (3/8) - 38% Complete
- ✅ POST `/admin/schedules/generate`
- ❌ **MISSING**: POST `/admin/schedules/generate-advanced`
- ❌ **MISSING**: GET `/admin/schedules` (get all schedules)
- ✅ GET `/admin/schedules/:id`
- ❌ **MISSING**: GET `/admin/schedules/:id/fairness`
- ❌ **MISSING**: GET `/admin/schedules/:id/fairness-report`
- ✅ POST `/admin/schedules/:id/publish`
- ❌ **MISSING**: DELETE `/admin/schedules/:id`

### ❌ Admin - Change Requests (0/4) - 0% Complete
- ❌ **MISSING**: GET `/admin/change-requests`
- ❌ **MISSING**: GET `/admin/change-requests/:id`
- ❌ **MISSING**: POST `/admin/change-requests/:id/approve`
- ❌ **MISSING**: POST `/admin/change-requests/:id/reject`

### ⚠️ Employee - Change Requests (3/4) - 75% Complete
- ✅ POST `/employee/change-requests`
- ✅ GET `/employee/change-requests`
- ❌ **MISSING**: GET `/employee/change-requests/:id`
- ✅ DELETE `/employee/change-requests/:id` (cancel)

### ⚠️ Manager - Change Requests (2/2) - 100% Complete
- ✅ GET `/manager/change-requests`
- ✅ PUT `/manager/change-requests/:id/approve`
- ✅ PUT `/manager/change-requests/:id/reject`

### ⚠️ Employee - Schedule (1/1) - 100% Complete
- ✅ GET `/employee/schedule`

### ❌ Phase 2 APIs (0/7) - Not Implemented (Future)
- ❌ POST `/admin/bulk-change-requests`
- ❌ GET `/admin/bulk-change-requests`
- ❌ GET `/admin/bulk-change-requests/:id`
- ❌ POST `/admin/bulk-change-requests/:id/approve`
- ❌ POST `/admin/bulk-change-requests/:id/reject`
- ❌ GET `/admin/conflicts`

### ❌ Health Check (0/1) - Not Critical
- ❌ GET `/health` (not needed in frontend)

---

## Missing APIs to Implement

### High Priority (Phase 1)

1. **Employee Service**
   - `getEmployeeById(id)` - GET `/admin/employees/:id`

2. **Team Service**
   - `getTeamById(id)` - GET `/admin/teams/:id`
   - `deleteTeam(id)` - DELETE `/admin/teams/:id`

3. **Schedule Service**
   - `getAllSchedules()` - GET `/admin/schedules`
   - `generateAdvancedSchedule(weekStartDate, weekEndDate)` - POST `/admin/schedules/generate-advanced`
   - `getScheduleFairness(id)` - GET `/admin/schedules/:id/fairness`
   - `getScheduleFairnessReport(id)` - GET `/admin/schedules/:id/fairness-report`
   - `deleteSchedule(id)` - DELETE `/admin/schedules/:id`

4. **Change Request Service**
   - `getChangeRequestById(id)` - GET `/employee/change-requests/:id`
   - `getAdminChangeRequests(filters)` - GET `/admin/change-requests`
   - `getAdminChangeRequestById(id)` - GET `/admin/change-requests/:id`
   - `approveAdminChangeRequest(id, reason)` - POST `/admin/change-requests/:id/approve`
   - `rejectAdminChangeRequest(id, reason)` - POST `/admin/change-requests/:id/reject`

### Low Priority (Phase 2 - Future)

- Bulk Change Request APIs
- Conflict Detection APIs

---

## Implementation Plan

1. ✅ Update `employeeService.js` - Add `getEmployeeById`
2. ✅ Update `teamService.js` - Add `getTeamById`, `deleteTeam`
3. ✅ Update `scheduleService.js` - Add missing schedule methods
4. ✅ Update `changeRequestService.js` - Add missing change request methods

---

## Notes

- Manager change requests use `PUT` method, while Admin change requests use `POST` method
- Phase 2 APIs (Bulk Change Requests, Conflicts) are not part of Phase 1 scope
- Health check endpoint is not needed in frontend

