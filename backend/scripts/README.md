# Backend Scripts

This directory contains shell scripts for the Office Seat Allocation System backend.

---

## Scripts

### 1. entrypoint.sh
**Purpose**: Docker container startup script

**What it does**:
- Waits 5 seconds for database to be ready
- Runs database seed script
- Starts the backend server

**Usage**: Automatically executed by Docker container
```bash
# Used in Dockerfile CMD
./entrypoint.sh
```

---

### 2. test_apis.sh
**Purpose**: Quick API testing script for Phase 1.2 endpoints

**What it does**:
- Tests login endpoint
- Tests employee management endpoints
- Tests team management endpoints
- Creates test data

**Usage**:
```bash
# Make executable
chmod +x scripts/test_apis.sh

# Run tests
./scripts/test_apis.sh
```

**Requirements**:
- Backend server running on http://localhost:8088
- `jq` installed for JSON parsing
- `curl` installed

**Test Credentials**:
- Admin: admin@example.com / admin123
- Employee: john.doe@example.com / password123

---

### 3. validate_phase1.sh ⭐
**Purpose**: Comprehensive Phase 1 validation test suite

**What it does**:
- Tests all 28 API endpoints
- Validates authentication & authorization
- Tests CRUD operations (Employee, Team)
- Tests schedule generation (3 office + 2 WFH)
- Tests change request workflow
- Validates capacity constraints
- Tests input validation
- Tests RBAC (Role-Based Access Control)

**Usage**:
```bash
# Make executable
chmod +x scripts/validate_phase1.sh

# Run comprehensive validation
./scripts/validate_phase1.sh
```

**Test Coverage**: 31 tests
- 7 Authentication tests
- 6 Employee management tests
- 5 Team management tests
- 7 Schedule generation tests
- 7 Change request tests
- 7 Security & validation tests

**Requirements**:
- Backend server running on http://localhost:8088
- `jq` installed for JSON parsing
- `curl` installed

**Output**:
```
✓ All tests passed!

Phase 1 Implementation Status:
✓ Authentication & Authorization
✓ Employee Management (CRUD)
✓ Team Management (CRUD)
✓ Schedule Generation (3 office + 2 WFH)
✓ Change Request Workflow
✓ Capacity Validation
✓ Input Validation
✓ RBAC (Role-Based Access Control)
```

---

## Adding New Scripts

When adding new scripts:
1. Place them in this directory
2. Make them executable: `chmod +x script_name.sh`
3. Add shebang: `#!/bin/bash`
4. Document them in this README
5. Update Dockerfile if needed for Docker usage

---

## Script Conventions

- Use `#!/bin/bash` shebang
- Add descriptive comments
- Use meaningful variable names
- Include error handling
- Print status messages with emojis for clarity
- Exit with appropriate codes (0 = success, 1 = error)

---

**Last Updated**: January 18, 2026
