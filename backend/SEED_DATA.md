# Seed Data Summary

## ✅ Automatic Database Seeding

**Status**: Seed runs automatically on `docker-compose up`

---

## 📊 Seed Data Created

### Total: 56 Employees across 5 Teams

**Breakdown**:
- 1 Admin User
- 5 Team Managers/Leads
- 50 Regular Employees (10 per team)

---

## 👥 Users Created

### Admin
- **Email**: `admin@example.com`
- **Password**: `admin123`
- **Role**: `admin`

### Team Managers (5)
All managers have password: `manager123`

1. **Sarah Johnson** - `sarah.johnson@example.com`
   - Team: Engineering
   - Role: `manager`

2. **Michael Brown** - `michael.brown@example.com`
   - Team: Product
   - Role: `manager`

3. **Emily Davis** - `emily.davis@example.com`
   - Team: Design
   - Role: `manager`

4. **David Wilson** - `david.wilson@example.com`
   - Team: Marketing
   - Role: `manager`

5. **Jennifer Martinez** - `jennifer.martinez@example.com`
   - Team: Operations
   - Role: `manager`

### Regular Employees (50)
All employees have password: `password123`

**Format**: `{FirstName}.{LastName}@example.com`

**Examples**:
- `James.Smith@example.com`
- `Mary.Johnson@example.com`
- `John.Williams@example.com`
- etc.

---

## 🏢 Teams Created

| Team | Description | Manager | Employees |
|------|-------------|---------|-----------|
| Engineering | Software Engineering Team | Sarah Johnson | 10 |
| Product | Product Management Team | Michael Brown | 10 |
| Design | Design and UX Team | Emily Davis | 10 |
| Marketing | Marketing and Sales Team | David Wilson | 10 |
| Operations | Operations and Support Team | Jennifer Martinez | 10 |

---

## 🔄 How It Works

### Automatic Seeding
When you run `docker-compose up`, the backend container:
1. Waits 5 seconds for database to be ready
2. Runs database migrations
3. Seeds the database with test data
4. Starts the server

### Manual Seeding
```bash
cd backend
make seed
```

### Reset Data
```bash
cd backend
make dc-down-v  # Removes volumes
make dc-up      # Recreates everything with fresh seed data
```

---

## 🧪 Testing with Seed Data

### Login as Admin
```bash
curl -X POST http://localhost:8088/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

### Login as Manager
```bash
curl -X POST http://localhost:8088/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"sarah.johnson@example.com","password":"manager123"}'
```

### Login as Employee
```bash
curl -X POST http://localhost:8088/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"James.Smith@example.com","password":"password123"}'
```

### Get All Employees
```bash
curl -X GET "http://localhost:8088/api/v1/admin/employees?limit=100" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Team Members
```bash
curl -X GET "http://localhost:8088/api/v1/admin/teams/{team-id}/members" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📝 Files Modified

1. `cmd/seed/main.go` - Enhanced seed script
2. `Dockerfile` - Builds seed binary
3. `entrypoint.sh` - Runs seed before server
4. `Makefile` - Added `make seed` command

---

## ✨ Features

- ✅ Realistic employee names
- ✅ Proper team structure
- ✅ Manager roles assigned
- ✅ Team leads linked to teams
- ✅ 10 employees per team
- ✅ All passwords hashed with bcrypt
- ✅ Idempotent (can run multiple times)
- ✅ Automatic on container start

---

## 🎯 Use Cases

**For Testing**:
- Test authentication with different roles
- Test team-based filtering
- Test manager approval workflows
- Test employee CRUD operations
- Load testing with 50+ employees

**For Development**:
- No need to manually create test data
- Fresh data on every `dc-down-v && dc-up`
- Realistic data for UI development

---

## 📊 Verification

```bash
# Check total employees
curl -s -X GET "http://localhost:8088/api/v1/admin/employees?limit=100" \
  -H "Authorization: Bearer TOKEN" | jq '.pagination.total'
# Output: 56

# Check total teams
curl -s -X GET "http://localhost:8088/api/v1/admin/teams" \
  -H "Authorization: Bearer TOKEN" | jq '.pagination.total'
# Output: 5
```

---

**Status**: ✅ COMPLETE - Seed data automatically loaded on startup!
