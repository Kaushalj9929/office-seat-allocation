# API Documentation
## Office Workspace Seat Allocation System

---

## 1. Overview

Base URL: `http://localhost:8080/api/v1`

All requests require authentication via JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

---

## 2. Authentication Endpoints

### 2.1 Login

**Endpoint**: `POST /auth/login`

**Authentication**: None (public endpoint)

**Request**:
```json
{
    "email": "admin@example.com",
    "password": "password123"
}
```

**Response** (200):
```json
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 3600,
    "user": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "email": "admin@example.com",
        "name": "Admin User",
        "role": "admin",
        "status": "active"
    }
}
```

**Error** (401):
```json
{
    "error": {
        "code": "INVALID_CREDENTIALS",
        "message": "Invalid email or password"
    }
}
```

---

### 2.2 Refresh Token

**Endpoint**: `POST /auth/refresh`

**Request**:
```json
{
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response** (200):
```json
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 3600
}
```

---

### 2.3 Logout

**Endpoint**: `POST /auth/logout`

**Response** (200):
```json
{
    "message": "Logged out successfully"
}
```

---

## 3. Employee Management Endpoints

### 3.1 List Employees

**Endpoint**: `GET /admin/employees`

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `team_id` (optional): Filter by team ID
- `status` (optional): Filter by status (active, inactive, on_leave)
- `search` (optional): Search by name or email

**Response** (200):
```json
{
    "data": [
        {
            "id": "550e8400-e29b-41d4-a716-446655440000",
            "email": "john@example.com",
            "name": "John Doe",
            "team_id": "550e8400-e29b-41d4-a716-446655440001",
            "role": "employee",
            "status": "active",
            "preferences": {},
            "created_at": "2024-01-05T10:00:00Z",
            "updated_at": "2024-01-05T10:00:00Z"
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 20,
        "total": 100,
        "total_pages": 5
    }
}
```

---

### 3.2 Create Employee

**Endpoint**: `POST /admin/employees`

**Request**:
```json
{
    "email": "john@example.com",
    "name": "John Doe",
    "password": "SecurePassword123!",
    "team_id": "550e8400-e29b-41d4-a716-446655440001",
    "role": "employee",
    "status": "active"
}
```

**Response** (201):
```json
{
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john@example.com",
    "name": "John Doe",
    "team_id": "550e8400-e29b-41d4-a716-446655440001",
    "role": "employee",
    "status": "active",
    "created_at": "2024-01-05T10:00:00Z"
}
```

**Error** (400):
```json
{
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Validation failed",
        "details": [
            {
                "field": "email",
                "message": "Email already exists"
            }
        ]
    }
}
```

---

### 3.3 Update Employee

**Endpoint**: `PUT /admin/employees/{id}`

**Request**:
```json
{
    "name": "John Doe Updated",
    "team_id": "550e8400-e29b-41d4-a716-446655440001",
    "status": "active"
}
```

**Response** (200):
```json
{
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john@example.com",
    "name": "John Doe Updated",
    "team_id": "550e8400-e29b-41d4-a716-446655440001",
    "role": "employee",
    "status": "active",
    "updated_at": "2024-01-05T11:00:00Z"
}
```

---

### 3.4 Delete Employee

**Endpoint**: `DELETE /admin/employees/{id}`

**Response** (204): No content

---

### 3.5 Bulk Import Employees

**Endpoint**: `POST /admin/employees/bulk-import`

**Request** (multipart/form-data):
- `file`: CSV file with columns: email, name, team_id, role, status

**Response** (200):
```json
{
    "imported": 50,
    "failed": 2,
    "errors": [
        {
            "row": 5,
            "email": "invalid@example.com",
            "error": "Email already exists"
        }
    ]
}
```

---

## 4. Team Management Endpoints

### 4.1 List Teams

**Endpoint**: `GET /admin/teams`

**Query Parameters**:
- `page` (optional): Page number
- `limit` (optional): Items per page
- `search` (optional): Search by name

**Response** (200):
```json
{
    "data": [
        {
            "id": "550e8400-e29b-41d4-a716-446655440001",
            "name": "Engineering",
            "description": "Engineering team",
            "team_lead_id": "550e8400-e29b-41d4-a716-446655440000",
            "preferences": {
                "preferred_days": [0, 2, 4]
            },
            "created_at": "2024-01-05T10:00:00Z"
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 20,
        "total": 10
    }
}
```

---

### 4.2 Create Team

**Endpoint**: `POST /admin/teams`

**Request**:
```json
{
    "name": "Engineering",
    "description": "Engineering team",
    "team_lead_id": "550e8400-e29b-41d4-a716-446655440000",
    "preferences": {
        "preferred_days": [0, 2, 4]
    }
}
```

**Response** (201):
```json
{
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Engineering",
    "description": "Engineering team",
    "team_lead_id": "550e8400-e29b-41d4-a716-446655440000",
    "preferences": {
        "preferred_days": [0, 2, 4]
    },
    "created_at": "2024-01-05T10:00:00Z"
}
```

---

### 4.3 Get Team Members

**Endpoint**: `GET /admin/teams/{id}/members`

**Response** (200):
```json
{
    "data": [
        {
            "id": "550e8400-e29b-41d4-a716-446655440000",
            "email": "john@example.com",
            "name": "John Doe",
            "role": "employee",
            "status": "active"
        }
    ]
}
```

---

## 5. Schedule Management Endpoints

### 5.1 Generate Schedule

**Endpoint**: `POST /admin/schedules/generate`

**Request**:
```json
{
    "week_start_date": "2024-01-08",
    "week_end_date": "2024-01-12"
}
```

**Response** (201):
```json
{
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "week_start_date": "2024-01-08",
    "week_end_date": "2024-01-12",
    "status": "draft",
    "entries": [
        {
            "id": "550e8400-e29b-41d4-a716-446655440003",
            "employee_id": "550e8400-e29b-41d4-a716-446655440000",
            "day_of_week": 0,
            "work_type": "office",
            "status": "assigned"
        }
    ],
    "created_at": "2024-01-05T10:00:00Z"
}
```

---

### 5.2 Get Schedule

**Endpoint**: `GET /admin/schedules/{id}`

**Response** (200):
```json
{
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "week_start_date": "2024-01-08",
    "week_end_date": "2024-01-12",
    "status": "draft",
    "entries": [
        {
            "id": "550e8400-e29b-41d4-a716-446655440003",
            "employee_id": "550e8400-e29b-41d4-a716-446655440000",
            "day_of_week": 0,
            "work_type": "office",
            "status": "assigned"
        }
    ],
    "created_at": "2024-01-05T10:00:00Z"
}
```

---

### 5.3 Publish Schedule

**Endpoint**: `POST /admin/schedules/{id}/publish`

**Response** (200):
```json
{
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "status": "published",
    "published_at": "2024-01-05T11:00:00Z"
}
```

---

### 5.4 Get Fairness Metrics

**Endpoint**: `GET /admin/schedules/{id}/fairness`

**Response** (200):
```json
{
    "data": [
        {
            "employee_id": "550e8400-e29b-41d4-a716-446655440000",
            "employee_name": "John Doe",
            "fairness_score": 95.5,
            "historical_office_days": 12,
            "assigned_office_days": 3,
            "variance": -9
        }
    ]
}
```

---

## 6. Change Request Endpoints

### 6.1 Submit Change Request

**Endpoint**: `POST /employee/change-requests`

**Request**:
```json
{
    "current_day": 0,
    "requested_day": 2,
    "reason": "Need to attend meeting"
}
```

**Response** (201):
```json
{
    "id": "550e8400-e29b-41d4-a716-446655440004",
    "employee_id": "550e8400-e29b-41d4-a716-446655440000",
    "current_day": 0,
    "requested_day": 2,
    "reason": "Need to attend meeting",
    "status": "pending",
    "requested_date": "2024-01-05T10:00:00Z"
}
```

**Error** (400):
```json
{
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Request must be made at least 2 days in advance"
    }
}
```

---

### 6.2 Get Employee Change Requests

**Endpoint**: `GET /employee/change-requests`

**Query Parameters**:
- `status` (optional): Filter by status (pending, approved, rejected)

**Response** (200):
```json
{
    "data": [
        {
            "id": "550e8400-e29b-41d4-a716-446655440004",
            "employee_id": "550e8400-e29b-41d4-a716-446655440000",
            "current_day": 0,
            "requested_day": 2,
            "reason": "Need to attend meeting",
            "status": "pending",
            "requested_date": "2024-01-05T10:00:00Z"
        }
    ]
}
```

---

### 6.3 Approve Change Request

**Endpoint**: `PUT /manager/change-requests/{id}/approve`

**Request**:
```json
{
    "decision_reason": "Approved"
}
```

**Response** (200):
```json
{
    "id": "550e8400-e29b-41d4-a716-446655440004",
    "status": "approved",
    "decision_date": "2024-01-05T11:00:00Z",
    "approved_by": "550e8400-e29b-41d4-a716-446655440001"
}
```

---

### 6.4 Reject Change Request

**Endpoint**: `PUT /manager/change-requests/{id}/reject`

**Request**:
```json
{
    "decision_reason": "Capacity exceeded on requested day"
}
```

**Response** (200):
```json
{
    "id": "550e8400-e29b-41d4-a716-446655440004",
    "status": "rejected",
    "decision_date": "2024-01-05T11:00:00Z",
    "decision_reason": "Capacity exceeded on requested day"
}
```

---

## 7. Reporting Endpoints

### 7.1 Capacity Utilization Report

**Endpoint**: `GET /admin/reports/capacity-utilization`

**Query Parameters**:
- `week_start_date` (optional): Start date
- `week_end_date` (optional): End date

**Response** (200):
```json
{
    "data": [
        {
            "day_of_week": 0,
            "day_name": "Monday",
            "total_seats": 50,
            "occupied_seats": 45,
            "utilization_percentage": 90.0,
            "trend": "up"
        }
    ]
}
```

---

### 7.2 Fairness Analysis Report

**Endpoint**: `GET /admin/reports/fairness-analysis`

**Response** (200):
```json
{
    "total_employees": 100,
    "average_fairness_score": 92.5,
    "min_fairness_score": 75.0,
    "max_fairness_score": 100.0,
    "variance": 8.5,
    "employee_metrics": [
        {
            "employee_id": "550e8400-e29b-41d4-a716-446655440000",
            "employee_name": "John Doe",
            "fairness_score": 95.5,
            "historical_office_days": 12,
            "assigned_office_days": 3,
            "variance": -9
        }
    ]
}
```

---

### 7.3 Export Report

**Endpoint**: `POST /admin/reports/export`

**Request**:
```json
{
    "report_type": "capacity",
    "format": "csv"
}
```

**Response** (200): CSV file download

---

## 8. Manager Endpoints

### 8.1 Get Team Schedule

**Endpoint**: `GET /manager/team/schedule`

**Query Parameters**:
- `team_id`: Team ID
- `week_start_date` (optional): Start date

**Response** (200):
```json
{
    "team_id": "550e8400-e29b-41d4-a716-446655440001",
    "team_name": "Engineering",
    "schedule": {
        "week_start_date": "2024-01-08",
        "entries": [
            {
                "employee_id": "550e8400-e29b-41d4-a716-446655440000",
                "employee_name": "John Doe",
                "day_of_week": 0,
                "work_type": "office"
            }
        ]
    }
}
```

---

### 8.2 Get Team Analytics

**Endpoint**: `GET /manager/team/analytics`

**Query Parameters**:
- `team_id`: Team ID

**Response** (200):
```json
{
    "team_id": "550e8400-e29b-41d4-a716-446655440001",
    "total_members": 10,
    "average_fairness_score": 93.5,
    "pending_requests": 2,
    "approval_rate": 95.0,
    "capacity_utilization": 88.0
}
```

---

## 9. Notification Endpoints

### 9.1 Get Notifications

**Endpoint**: `GET /notifications`

**Query Parameters**:
- `read` (optional): Filter by read status (true/false)
- `limit` (optional): Number of notifications (default: 20)

**Response** (200):
```json
{
    "data": [
        {
            "id": "550e8400-e29b-41d4-a716-446655440005",
            "type": "schedule_published",
            "title": "New Schedule Published",
            "message": "Schedule for week 2024-01-08 is now available",
            "read": false,
            "created_at": "2024-01-05T10:00:00Z"
        }
    ]
}
```

---

### 9.2 Mark Notification as Read

**Endpoint**: `PUT /notifications/{id}/read`

**Response** (200):
```json
{
    "id": "550e8400-e29b-41d4-a716-446655440005",
    "read": true
}
```

---

## 10. Error Responses

### 10.1 Error Format

```json
{
    "error": {
        "code": "ERROR_CODE",
        "message": "Human readable message",
        "details": [
            {
                "field": "field_name",
                "message": "Field specific error"
            }
        ]
    }
}
```

### 10.2 Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| VALIDATION_ERROR | 400 | Input validation failed |
| UNAUTHORIZED | 401 | Authentication failed |
| FORBIDDEN | 403 | Authorization failed |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Resource already exists |
| INTERNAL_ERROR | 500 | Server error |

---

## 11. Rate Limiting

All endpoints are rate limited to 100 requests per minute per user.

Response headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1704456000
```

---

## 12. Pagination

List endpoints support pagination with:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

Response includes:
```json
{
    "pagination": {
        "page": 1,
        "limit": 20,
        "total": 100,
        "total_pages": 5
    }
}
```

---

## 13. Filtering & Sorting

Supported query parameters:
- `search`: Search by name or email
- `status`: Filter by status
- `team_id`: Filter by team
- `sort_by`: Sort field
- `sort_order`: asc or desc

---

## 14. WebSocket Endpoints

### 14.1 Real-time Notifications

**Endpoint**: `ws://localhost:8080/ws/notifications`

**Connection**:
```javascript
const ws = new WebSocket('ws://localhost:8080/ws/notifications');

ws.onmessage = (event) => {
    const notification = JSON.parse(event.data);
    console.log(notification);
};
```

**Message Format**:
```json
{
    "id": "550e8400-e29b-41d4-a716-446655440005",
    "type": "schedule_published",
    "title": "New Schedule Published",
    "message": "Schedule for week 2024-01-08 is now available",
    "created_at": "2024-01-05T10:00:00Z"
}
```

---

**Document Version**: 1.0  
**Last Updated**: [Current Date]
