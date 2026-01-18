# Quick Reference - Test Credentials

## 🔑 Login Credentials

### Admin
```
Email: admin@example.com
Password: admin123
Role: admin
```

### Managers (password: manager123)
```
sarah.johnson@example.com    - Engineering Team
michael.brown@example.com     - Product Team
emily.davis@example.com       - Design Team
david.wilson@example.com      - Marketing Team
jennifer.martinez@example.com - Operations Team
```

### Employees (password: password123)
```
Format: {FirstName}.{LastName}@example.com
Examples:
  James.Smith@example.com
  Mary.Johnson@example.com
  John.Williams@example.com
  ... (50 total employees)
```

## 📊 Data Summary
- **Total Users**: 56
- **Admin**: 1
- **Managers**: 5
- **Employees**: 50
- **Teams**: 5 (10 employees each)

## 🚀 Quick Commands

```bash
# Reset and reseed database
make dc-down-v && make dc-up

# Manual seed
make seed

# Test login
curl -X POST http://localhost:8088/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```
