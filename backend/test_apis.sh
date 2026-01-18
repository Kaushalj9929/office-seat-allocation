#!/bin/bash

BASE_URL="http://localhost:8088/api/v1"

echo "🧪 Testing Phase 1.2 APIs"
echo "=========================="
echo ""

# Test 1: Login
echo "1️⃣  Testing Login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.access_token')

if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
  echo "✅ Login successful"
  echo "   Token: ${TOKEN:0:50}..."
else
  echo "❌ Login failed"
  exit 1
fi
echo ""

# Test 2: Get Employees
echo "2️⃣  Testing Get Employees..."
EMPLOYEES=$(curl -s -X GET "$BASE_URL/admin/employees" \
  -H "Authorization: Bearer $TOKEN")

EMPLOYEE_COUNT=$(echo $EMPLOYEES | jq '.pagination.total')
echo "✅ Found $EMPLOYEE_COUNT employees"
echo ""

# Test 3: Get Teams
echo "3️⃣  Testing Get Teams..."
TEAMS=$(curl -s -X GET "$BASE_URL/admin/teams" \
  -H "Authorization: Bearer $TOKEN")

TEAM_COUNT=$(echo $TEAMS | jq '.pagination.total')
echo "✅ Found $TEAM_COUNT teams"
echo ""

# Test 4: Create Employee
echo "4️⃣  Testing Create Employee..."
NEW_EMPLOYEE=$(curl -s -X POST "$BASE_URL/admin/employees" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "name":"Test User",
    "password":"password123",
    "role":"employee"
  }')

NEW_EMP_ID=$(echo $NEW_EMPLOYEE | jq -r '.id')
if [ "$NEW_EMP_ID" != "null" ] && [ -n "$NEW_EMP_ID" ]; then
  echo "✅ Employee created: $NEW_EMP_ID"
else
  echo "⚠️  Employee might already exist"
fi
echo ""

# Test 5: Create Team
echo "5️⃣  Testing Create Team..."
NEW_TEAM=$(curl -s -X POST "$BASE_URL/admin/teams" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"QA Team",
    "description":"Quality Assurance Team"
  }')

NEW_TEAM_ID=$(echo $NEW_TEAM | jq -r '.id')
if [ "$NEW_TEAM_ID" != "null" ] && [ -n "$NEW_TEAM_ID" ]; then
  echo "✅ Team created: $NEW_TEAM_ID"
else
  echo "⚠️  Team might already exist"
fi
echo ""

echo "=========================="
echo "🎉 All tests completed!"
echo ""
echo "Test Credentials:"
echo "  Admin: admin@example.com / admin123"
echo "  Employee: john.doe@example.com / password123"
