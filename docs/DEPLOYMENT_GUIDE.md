# Deployment Guide
## Office Workspace Seat Allocation System

---

## 1. Overview

This guide covers deployment strategies for different environments:
- **Local Development**: Docker Compose
- **Staging**: Docker Compose with production-like configuration
- **Production**: Future cloud deployment (AWS/Azure/GCP)

---

## 2. Local Development Deployment

### 2.1 Prerequisites

```bash
# Check Docker installation
docker --version
# Docker version 20.10+

# Check Docker Compose installation
docker-compose --version
# Docker Compose version 2.0+
```

### 2.2 Initial Setup

```bash
# Clone repository
git clone <repository-url>
cd office-seat-allocation

# Create environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Verify .env files
cat backend/.env
cat frontend/.env
```

### 2.3 Start Services

```bash
# Build and start all services
docker-compose up -d

# Verify all services are running
docker-compose ps

# Expected output:
# NAME                    STATUS
# office-seat-allocation-postgres-1    Up
# office-seat-allocation-redis-1       Up
# office-seat-allocation-rabbitmq-1    Up
# office-seat-allocation-backend-1     Up
# office-seat-allocation-frontend-1    Up
```

### 2.4 Verify Deployment

```bash
# Check backend health
curl http://localhost:8080/health

# Check frontend
open http://localhost:3000

# Check database
docker-compose exec postgres psql -U postgres -d office_allocation -c "\dt"

# Check Redis
docker-compose exec redis redis-cli ping
# Expected: PONG

# Check RabbitMQ
open http://localhost:15672
# Login: guest / guest
```

### 2.5 Database Initialization

```bash
# Migrations run automatically on backend startup
# To manually run migrations:
docker-compose exec backend go run cmd/main.go migrate

# Seed sample data (optional)
docker-compose exec backend go run cmd/seed/main.go
```

---

## 3. Staging Deployment

### 3.1 Staging Configuration

Create `docker-compose.staging.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: office_allocation
    volumes:
      - postgres_staging_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_staging_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  rabbitmq:
    image: rabbitmq:3.12-management-alpine
    environment:
      RABBITMQ_DEFAULT_USER: ${RABBITMQ_USER}
      RABBITMQ_DEFAULT_PASS: ${RABBITMQ_PASSWORD}
    ports:
      - "5672:5672"
      - "15672:15672"
    volumes:
      - rabbitmq_staging_data:/var/lib/rabbitmq
    healthcheck:
      test: ["CMD", "rabbitmq-diagnostics", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      GO_ENV: staging
      DATABASE_URL: postgres://${DB_USER}:${DB_PASSWORD}@postgres:5432/office_allocation
      REDIS_URL: redis://redis:6379
      RABBITMQ_URL: amqp://${RABBITMQ_USER}:${RABBITMQ_PASSWORD}@rabbitmq:5672/
      JWT_SECRET: ${JWT_SECRET}
    ports:
      - "8080:8080"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      rabbitmq:
        condition: service_healthy
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    environment:
      REACT_APP_API_URL: ${API_URL}
    ports:
      - "3000:3000"
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  postgres_staging_data:
  redis_staging_data:
  rabbitmq_staging_data:
```

### 3.2 Staging Environment Variables

Create `.env.staging`:

```env
# Database
DB_USER=staging_user
DB_PASSWORD=staging_password_secure

# RabbitMQ
RABBITMQ_USER=staging_user
RABBITMQ_PASSWORD=staging_password_secure

# JWT
JWT_SECRET=staging_secret_key_change_this

# API
API_URL=https://staging-api.example.com/api/v1
```

### 3.3 Deploy to Staging

```bash
# Build and start staging environment
docker-compose -f docker-compose.staging.yml up -d

# Verify staging deployment
docker-compose -f docker-compose.staging.yml ps

# Check logs
docker-compose -f docker-compose.staging.yml logs -f backend
```

---

## 4. Production Deployment (Future)

### 4.1 Production Checklist

- [ ] Use strong, unique passwords for all services
- [ ] Enable SSL/TLS certificates
- [ ] Setup automated backups
- [ ] Configure monitoring and alerting
- [ ] Setup log aggregation
- [ ] Configure auto-scaling
- [ ] Setup CI/CD pipeline
- [ ] Security audit completed
- [ ] Performance testing passed
- [ ] Disaster recovery plan in place

### 4.2 Production Environment Variables

```env
# Database
DATABASE_URL=postgres://prod_user:strong_password@prod-db-host:5432/office_allocation
DB_SSL_MODE=require

# Redis
REDIS_URL=redis://:strong_password@prod-redis-host:6379

# RabbitMQ
RABBITMQ_URL=amqp://prod_user:strong_password@prod-rabbitmq-host:5672/

# JWT
JWT_SECRET=production_secret_key_very_long_and_secure

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=SG.xxxxx

# API
API_URL=https://api.example.com/api/v1
FRONTEND_URL=https://example.com
```

### 4.3 Production Deployment Steps

```bash
# 1. Build production images
docker build -t office-seat-allocation-backend:1.0.0 ./backend
docker build -t office-seat-allocation-frontend:1.0.0 ./frontend

# 2. Push to registry
docker push office-seat-allocation-backend:1.0.0
docker push office-seat-allocation-frontend:1.0.0

# 3. Deploy using orchestration tool (Kubernetes, Docker Swarm, etc.)
# See KUBERNETES_DEPLOYMENT.md for Kubernetes setup

# 4. Verify deployment
curl https://api.example.com/health

# 5. Monitor logs
# Setup centralized logging (ELK, CloudWatch, etc.)
```

---

## 5. Database Backup & Recovery

### 5.1 Backup Database

```bash
# Backup PostgreSQL
docker-compose exec postgres pg_dump -U postgres office_allocation > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup with compression
docker-compose exec postgres pg_dump -U postgres office_allocation | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz
```

### 5.2 Restore Database

```bash
# Restore from backup
docker-compose exec -T postgres psql -U postgres office_allocation < backup_20240105_120000.sql

# Restore from compressed backup
gunzip -c backup_20240105_120000.sql.gz | docker-compose exec -T postgres psql -U postgres office_allocation
```

### 5.3 Automated Backups

Create `backup.sh`:

```bash
#!/bin/bash

BACKUP_DIR="/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.sql.gz"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Backup database
docker-compose exec postgres pg_dump -U postgres office_allocation | gzip > $BACKUP_FILE

# Keep only last 7 days of backups
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_FILE"
```

Schedule with cron:

```bash
# Add to crontab (daily at 2 AM)
0 2 * * * /path/to/backup.sh
```

---

## 6. Monitoring & Health Checks

### 6.1 Health Check Endpoints

```bash
# Backend health
curl http://localhost:8080/health

# Database health
docker-compose exec postgres pg_isready -U postgres

# Redis health
docker-compose exec redis redis-cli ping

# RabbitMQ health
docker-compose exec rabbitmq rabbitmq-diagnostics ping
```

### 6.2 Log Monitoring

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# View logs with timestamps
docker-compose logs -f --timestamps

# View last 100 lines
docker-compose logs --tail=100 backend
```

### 6.3 Performance Monitoring

```bash
# Check container resource usage
docker stats

# Check database connections
docker-compose exec postgres psql -U postgres -c "SELECT count(*) FROM pg_stat_activity;"

# Check Redis memory usage
docker-compose exec redis redis-cli info memory
```

---

## 7. Scaling & Load Balancing

### 7.1 Scale Backend Services

```bash
# Scale backend to 3 instances
docker-compose up -d --scale backend=3

# Verify scaling
docker-compose ps
```

### 7.2 Load Balancer Configuration

Add Nginx to `docker-compose.yml`:

```yaml
nginx:
  image: nginx:alpine
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - ./nginx.conf:/etc/nginx/nginx.conf:ro
  depends_on:
    - backend
```

Create `nginx.conf`:

```nginx
upstream backend {
    server backend:8080;
}

server {
    listen 80;
    server_name _;

    location /api {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location / {
        proxy_pass http://frontend:3000;
    }
}
```

---

## 8. Troubleshooting Deployment

### 8.1 Service Won't Start

```bash
# Check logs
docker-compose logs backend

# Rebuild container
docker-compose build --no-cache backend

# Restart service
docker-compose restart backend
```

### 8.2 Database Connection Issues

```bash
# Check database is running
docker-compose ps postgres

# Check connection string
echo $DATABASE_URL

# Test connection
docker-compose exec postgres psql -U postgres -d office_allocation -c "SELECT 1;"
```

### 8.3 Port Conflicts

```bash
# Find process using port
lsof -i :8080

# Kill process
kill -9 <PID>

# Or change port in docker-compose.yml
```

### 8.4 Out of Disk Space

```bash
# Check disk usage
docker system df

# Clean up unused images
docker image prune -a

# Clean up unused volumes
docker volume prune

# Clean up unused containers
docker container prune
```

---

## 9. Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Documentation updated
- [ ] Environment variables configured
- [ ] Database migrations tested
- [ ] Backups created
- [ ] Monitoring configured

### Deployment
- [ ] Services started successfully
- [ ] Health checks passing
- [ ] Database initialized
- [ ] API responding
- [ ] Frontend accessible
- [ ] Logs monitored

### Post-Deployment
- [ ] Smoke tests passed
- [ ] Performance acceptable
- [ ] No errors in logs
- [ ] Backups verified
- [ ] Monitoring active
- [ ] Team notified

---

## 10. Rollback Procedure

### 10.1 Quick Rollback

```bash
# Stop current deployment
docker-compose down

# Restore database from backup
docker-compose up -d postgres
docker-compose exec -T postgres psql -U postgres office_allocation < backup_previous.sql

# Start previous version
docker-compose up -d
```

### 10.2 Blue-Green Deployment

```bash
# Keep two environments running
docker-compose -f docker-compose.blue.yml up -d
docker-compose -f docker-compose.green.yml up -d

# Switch traffic to green
# Update load balancer configuration

# If issues, switch back to blue
```

---

## 11. Maintenance Windows

### 11.1 Schedule Maintenance

```bash
# Announce maintenance
# Stop accepting new requests
# Wait for in-flight requests to complete

# Perform maintenance
docker-compose down
# Run migrations, backups, etc.
docker-compose up -d

# Verify deployment
# Resume accepting requests
```

### 11.2 Zero-Downtime Deployment

```bash
# Deploy new version alongside old
docker-compose -f docker-compose.new.yml up -d

# Run smoke tests
# Switch traffic gradually
# Monitor for issues
# Remove old version
```

---

## 12. Security Considerations

### 12.1 Secrets Management

```bash
# Use environment variables for secrets
# Never commit .env files
# Use secret management tools (Vault, AWS Secrets Manager)

# Example with Docker secrets
docker secret create db_password -
docker service create --secret db_password ...
```

### 12.2 Network Security

```bash
# Use internal networks for service communication
# Expose only necessary ports
# Use SSL/TLS for external communication
# Configure firewall rules
```

### 12.3 Access Control

```bash
# Limit SSH access
# Use strong authentication
# Audit access logs
# Rotate credentials regularly
```

---

**Document Version**: 1.0  
**Last Updated**: [Current Date]
