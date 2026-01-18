# Backend Phase 2 Detailed Implementation Plan
## Office Workspace Seat Allocation System - Enhancement & Optimization

---

## 1. Overview

This document provides detailed specifications for backend implementation in Phase 2. It covers advanced scheduling algorithms, performance optimization, real-time features, and reporting systems.

---

## 2. Advanced Scheduling Algorithm

### 2.1 Algorithm Overview

The advanced scheduling algorithm considers:
1. **Fairness**: Historical office day distribution
2. **Team Preferences**: Team-specific office day preferences
3. **Constraints**: Capacity, hybrid work model (3 office, 2 WFH)
4. **Optimization**: Maximize team collaboration days

### 2.2 Algorithm Implementation

```go
type SchedulingAlgorithm struct {
    employees []Employee
    capacity map[int]int
    teamPreferences map[uuid.UUID][]int
    historicalData map[uuid.UUID]int
}

func (sa *SchedulingAlgorithm) Generate() (*Schedule, error) {
    // Step 1: Calculate fairness scores
    fairnessScores := sa.calculateFairnessScores()
    
    // Step 2: Sort employees by fairness score
    sortedEmployees := sa.sortByFairness(fairnessScores)
    
    // Step 3: Assign office days respecting constraints
    schedule := sa.assignOfficeDays(sortedEmployees)
    
    // Step 4: Validate schedule
    if !sa.validateSchedule(schedule) {
        return nil, errors.New("schedule validation failed")
    }
    
    return schedule, nil
}

func (sa *SchedulingAlgorithm) calculateFairnessScores() map[uuid.UUID]float64 {
    scores := make(map[uuid.UUID]float64)
    
    for _, emp := range sa.employees {
        historicalDays := sa.historicalData[emp.ID]
        // Lower historical days = higher priority
        scores[emp.ID] = float64(historicalDays)
    }
    
    return scores
}

func (sa *SchedulingAlgorithm) assignOfficeDays(employees []Employee) *Schedule {
    schedule := &Schedule{
        Entries: make([]ScheduleEntry, 0),
    }
    
    dayAssignments := make(map[int]int) // day -> count
    
    for _, emp := range employees {
        officeCount := 0
        
        for day := 0; day < 5; day++ {
            if officeCount >= 3 {
                // Employee has 3 office days, rest are WFH
                schedule.Entries = append(schedule.Entries, ScheduleEntry{
                    EmployeeID: emp.ID,
                    DayOfWeek: day,
                    WorkType: "wfh",
                })
                continue
            }
            
            // Check if day has capacity
            if dayAssignments[day] < sa.capacity[day] {
                // Check team preference
                if sa.hasTeamPreference(emp.ID, day) {
                    schedule.Entries = append(schedule.Entries, ScheduleEntry{
                        EmployeeID: emp.ID,
                        DayOfWeek: day,
                        WorkType: "office",
                    })
                    dayAssignments[day]++
                    officeCount++
                    continue
                }
            }
            
            // Default to WFH
            schedule.Entries = append(schedule.Entries, ScheduleEntry{
                EmployeeID: emp.ID,
                DayOfWeek: day,
                WorkType: "wfh",
            })
        }
    }
    
    return schedule
}

func (sa *SchedulingAlgorithm) validateSchedule(schedule *Schedule) bool {
    // Validate hybrid work constraint
    employeeOfficeDays := make(map[uuid.UUID]int)
    employeeWFHDays := make(map[uuid.UUID]int)
    dayCapacity := make(map[int]int)
    
    for _, entry := range schedule.Entries {
        if entry.WorkType == "office" {
            employeeOfficeDays[entry.EmployeeID]++
            dayCapacity[entry.DayOfWeek]++
        } else {
            employeeWFHDays[entry.EmployeeID]++
        }
    }
    
    // Check each employee has exactly 3 office and 2 WFH days
    for _, emp := range sa.employees {
        if employeeOfficeDays[emp.ID] != 3 || employeeWFHDays[emp.ID] != 2 {
            return false
        }
    }
    
    // Check capacity constraints
    for day, count := range dayCapacity {
        if count > sa.capacity[day] {
            return false
        }
    }
    
    return true
}

func (sa *SchedulingAlgorithm) hasTeamPreference(empID uuid.UUID, day int) bool {
    emp, _ := sa.getEmployee(empID)
    if emp == nil {
        return false
    }
    
    prefs := sa.teamPreferences[emp.TeamID]
    for _, prefDay := range prefs {
        if prefDay == day {
            return true
        }
    }
    
    return false
}
```

---

## 3. Fairness Metrics Service

### 3.1 Fairness Calculation

```go
type FairnessMetrics struct {
    EmployeeID uuid.UUID
    FairnessScore float64
    HistoricalOfficeDays int
    AssignedOfficeDays int
    Variance float64
}

func (fs *FairnessService) CalculateMetrics(schedule *Schedule) ([]FairnessMetrics, error) {
    metrics := make([]FairnessMetrics, 0)
    
    for _, emp := range fs.employees {
        historical := fs.getHistoricalOfficeDays(emp.ID)
        assigned := fs.countAssignedOfficeDays(schedule, emp.ID)
        variance := float64(assigned - historical)
        
        // Fairness score: lower variance = higher fairness
        fairnessScore := 100.0 - math.Abs(variance)
        
        metrics = append(metrics, FairnessMetrics{
            EmployeeID: emp.ID,
            FairnessScore: fairnessScore,
            HistoricalOfficeDays: historical,
            AssignedOfficeDays: assigned,
            Variance: variance,
        })
    }
    
    return metrics, nil
}

func (fs *FairnessService) getHistoricalOfficeDays(empID uuid.UUID) int {
    // Query last 12 weeks of schedules
    var total int
    fs.db.Model(&ScheduleEntry{}).
        Where("employee_id = ? AND work_type = ?", empID, "office").
        Count(&total)
    
    return total / 12 // Average per week
}
```

---

## 4. Bulk Change Request Service

### 4.1 Bulk Request Model

```go
type BulkChangeRequest struct {
    ID uuid.UUID `gorm:"primaryKey"`
    CreatedBy uuid.UUID
    Status string // 'pending', 'processing', 'completed'
    TotalRequests int
    ApprovedCount int
    RejectedCount int
    Requests []ChangeRequest
    CreatedAt time.Time
    UpdatedAt time.Time
}

type BulkChangeRequestInput struct {
    EmployeeIDs []uuid.UUID `json:"employee_ids"`
    CurrentDay int `json:"current_day"`
    RequestedDay int `json:"requested_day"`
    Reason string `json:"reason"`
}
```

### 4.2 Bulk Request Service

```go
type BulkChangeRequestService struct {
    db *gorm.DB
    changeRequestService *ChangeRequestService
}

func (bs *BulkChangeRequestService) SubmitBulkRequest(ctx context.Context, input *BulkChangeRequestInput, createdBy uuid.UUID) (*BulkChangeRequest, error) {
    bulkReq := &BulkChangeRequest{
        ID: uuid.New(),
        CreatedBy: createdBy,
        Status: "pending",
        TotalRequests: len(input.EmployeeIDs),
        Requests: make([]ChangeRequest, 0),
    }
    
    // Create individual change requests
    for _, empID := range input.EmployeeIDs {
        req := &ChangeRequest{
            ID: uuid.New(),
            EmployeeID: empID,
            CurrentDay: input.CurrentDay,
            RequestedDay: input.RequestedDay,
            Reason: input.Reason,
            Status: "pending",
            RequestedDate: time.Now(),
        }
        bulkReq.Requests = append(bulkReq.Requests, *req)
    }
    
    // Save bulk request
    if err := bs.db.Create(bulkReq).Error; err != nil {
        return nil, err
    }
    
    return bulkReq, nil
}

func (bs *BulkChangeRequestService) ApproveBulkRequest(ctx context.Context, bulkID uuid.UUID, approvedBy uuid.UUID) error {
    bulkReq := &BulkChangeRequest{}
    if err := bs.db.Preload("Requests").First(bulkReq, "id = ?", bulkID).Error; err != nil {
        return err
    }
    
    // Approve each request
    for _, req := range bulkReq.Requests {
        if err := bs.changeRequestService.ApproveRequest(ctx, req.ID, approvedBy, "Bulk approval"); err != nil {
            bulkReq.RejectedCount++
        } else {
            bulkReq.ApprovedCount++
        }
    }
    
    bulkReq.Status = "completed"
    return bs.db.Save(bulkReq).Error
}
```

---

## 5. Capacity Conflict Resolution

### 5.1 Conflict Detection

```go
type CapacityConflict struct {
    RequestID uuid.UUID
    EmployeeID uuid.UUID
    RequestedDay int
    AvailableSeats int
    ConflictType string // 'capacity_exceeded', 'hybrid_constraint_violated'
    Suggestions []int // Alternative days
}

func (cm *CapacityManager) DetectConflict(ctx context.Context, req *ChangeRequest) (*CapacityConflict, error) {
    // Check capacity
    available := cm.getAvailableSeats(req.RequestedDay)
    if available <= 0 {
        return &CapacityConflict{
            RequestID: req.ID,
            EmployeeID: req.EmployeeID,
            RequestedDay: req.RequestedDay,
            AvailableSeats: available,
            ConflictType: "capacity_exceeded",
            Suggestions: cm.suggestAlternativeDays(req.EmployeeID),
        }, nil
    }
    
    // Check hybrid constraint
    if !cm.validateHybridConstraint(req.EmployeeID, req.RequestedDay) {
        return &CapacityConflict{
            RequestID: req.ID,
            EmployeeID: req.EmployeeID,
            RequestedDay: req.RequestedDay,
            ConflictType: "hybrid_constraint_violated",
            Suggestions: cm.suggestAlternativeDays(req.EmployeeID),
        }, nil
    }
    
    return nil, nil
}

func (cm *CapacityManager) suggestAlternativeDays(empID uuid.UUID) []int {
    suggestions := make([]int, 0)
    
    for day := 0; day < 5; day++ {
        if cm.getAvailableSeats(day) > 0 && cm.validateHybridConstraint(empID, day) {
            suggestions = append(suggestions, day)
        }
    }
    
    return suggestions
}

func (cm *CapacityManager) ResolveConflict(ctx context.Context, conflict *CapacityConflict, resolution string) error {
    // resolution: 'reject', 'suggest_alternative', 'swap_employee', 'override'
    
    switch resolution {
    case "reject":
        return cm.rejectRequest(conflict.RequestID)
    case "suggest_alternative":
        return cm.suggestAlternative(conflict.RequestID, conflict.Suggestions)
    case "swap_employee":
        return cm.swapEmployee(conflict.RequestID, conflict.RequestedDay)
    case "override":
        return cm.overrideCapacity(conflict.RequestID)
    default:
        return errors.New("invalid resolution type")
    }
}
```

---

## 6. Reporting Service

### 6.1 Report Models

```go
type Report struct {
    ID uuid.UUID `gorm:"primaryKey"`
    Name string
    Type string // 'capacity', 'fairness', 'change_requests', 'team_breakdown'
    CreatedBy uuid.UUID
    Filters datatypes.JSONType
    Data datatypes.JSONType
    CreatedAt time.Time
    ExpiresAt *time.Time
}

type CapacityUtilizationReport struct {
    WeekStartDate time.Time
    DayOfWeek int
    TotalSeats int
    OccupiedSeats int
    UtilizationPercentage float64
    Trend string // 'up', 'down', 'stable'
}

type FairnessAnalysisReport struct {
    TotalEmployees int
    AverageFairnessScore float64
    MinFairnessScore float64
    MaxFairnessScore float64
    Variance float64
    EmployeeMetrics []FairnessMetrics
}

type ChangeRequestStatsReport struct {
    TotalRequests int
    ApprovedCount int
    RejectedCount int
    PendingCount int
    ApprovalRate float64
    CommonReasons []string
    TrendByDay map[int]int
}
```

### 6.2 Report Generation Service

```go
type ReportingService struct {
    db *gorm.DB
    cache *redis.Client
}

func (rs *ReportingService) GenerateCapacityReport(ctx context.Context, weekStart, weekEnd time.Time) (*Report, error) {
    cacheKey := fmt.Sprintf("report:capacity:%s", weekStart.Format("2006-01-02"))
    
    // Check cache
    if cached, err := rs.cache.Get(ctx, cacheKey).Result(); err == nil {
        return rs.parseReport(cached), nil
    }
    
    // Generate report
    report := &Report{
        ID: uuid.New(),
        Type: "capacity",
        CreatedAt: time.Now(),
    }
    
    // Calculate capacity utilization
    for day := 0; day < 5; day++ {
        var occupied int
        rs.db.Model(&ScheduleEntry{}).
            Where("day_of_week = ? AND work_type = ?", day, "office").
            Count(&occupied)
        
        capacity := rs.getCapacity(day)
        utilization := float64(occupied) / float64(capacity) * 100
        
        // Add to report data
    }
    
    // Cache report
    rs.cache.Set(ctx, cacheKey, report, 24*time.Hour)
    
    return report, nil
}

func (rs *ReportingService) ExportReport(ctx context.Context, reportID uuid.UUID, format string) ([]byte, error) {
    report := &Report{}
    if err := rs.db.First(report, "id = ?", reportID).Error; err != nil {
        return nil, err
    }
    
    switch format {
    case "csv":
        return rs.exportCSV(report)
    case "pdf":
        return rs.exportPDF(report)
    case "excel":
        return rs.exportExcel(report)
    default:
        return nil, errors.New("unsupported format")
    }
}
```

---

## 7. Real-time Notification Service

### 7.1 WebSocket Setup

```go
type NotificationHub struct {
    clients map[uuid.UUID]*Client
    broadcast chan *Notification
    register chan *Client
    unregister chan *Client
}

type Client struct {
    EmployeeID uuid.UUID
    conn *websocket.Conn
    send chan *Notification
}

type Notification struct {
    ID uuid.UUID
    EmployeeID uuid.UUID
    Type string // 'schedule_published', 'request_approved', 'request_rejected'
    Title string
    Message string
    Data map[string]interface{}
    CreatedAt time.Time
}

func (h *NotificationHub) Run() {
    for {
        select {
        case client := <-h.register:
            h.clients[client.EmployeeID] = client
        case client := <-h.unregister:
            delete(h.clients, client.EmployeeID)
            close(client.send)
        case notification := <-h.broadcast:
            if client, ok := h.clients[notification.EmployeeID]; ok {
                select {
                case client.send <- notification:
                default:
                    close(client.send)
                    delete(h.clients, notification.EmployeeID)
                }
            }
        }
    }
}

func (h *NotificationHub) SendNotification(notification *Notification) {
    h.broadcast <- notification
}
```

### 7.2 Notification Service

```go
type NotificationService struct {
    db *gorm.DB
    hub *NotificationHub
    emailService *EmailService
}

func (ns *NotificationService) NotifySchedulePublished(ctx context.Context, scheduleID uuid.UUID) error {
    schedule := &Schedule{}
    if err := ns.db.Preload("Entries").First(schedule, "id = ?", scheduleID).Error; err != nil {
        return err
    }
    
    // Get unique employees in schedule
    employees := ns.getScheduleEmployees(schedule)
    
    for _, emp := range employees {
        notification := &Notification{
            ID: uuid.New(),
            EmployeeID: emp.ID,
            Type: "schedule_published",
            Title: "New Schedule Published",
            Message: fmt.Sprintf("Schedule for week %s is now available", schedule.WeekStartDate),
            CreatedAt: time.Now(),
        }
        
        // Send real-time notification
        ns.hub.SendNotification(notification)
        
        // Save to database
        ns.db.Create(notification)
        
        // Send email
        ns.emailService.SendScheduleNotification(emp.Email, schedule)
    }
    
    return nil
}

func (ns *NotificationService) NotifyChangeRequestApproved(ctx context.Context, requestID uuid.UUID) error {
    req := &ChangeRequest{}
    if err := ns.db.First(req, "id = ?", requestID).Error; err != nil {
        return err
    }
    
    emp := &Employee{}
    ns.db.First(emp, "id = ?", req.EmployeeID)
    
    notification := &Notification{
        ID: uuid.New(),
        EmployeeID: req.EmployeeID,
        Type: "request_approved",
        Title: "Change Request Approved",
        Message: fmt.Sprintf("Your request to change from day %d to day %d has been approved", req.CurrentDay, req.RequestedDay),
        CreatedAt: time.Now(),
    }
    
    ns.hub.SendNotification(notification)
    ns.db.Create(notification)
    ns.emailService.SendApprovalNotification(emp.Email, req)
    
    return nil
}
```

---

## 8. Performance Optimization

### 8.1 Caching Strategy

```go
type CacheManager struct {
    redis *redis.Client
}

func (cm *CacheManager) CacheSchedule(ctx context.Context, schedule *Schedule) error {
    key := fmt.Sprintf("schedule:%s", schedule.ID)
    data, _ := json.Marshal(schedule)
    return cm.redis.Set(ctx, key, data, 24*time.Hour).Err()
}

func (cm *CacheManager) GetCachedSchedule(ctx context.Context, scheduleID uuid.UUID) (*Schedule, error) {
    key := fmt.Sprintf("schedule:%s", scheduleID)
    data, err := cm.redis.Get(ctx, key).Result()
    if err != nil {
        return nil, err
    }
    
    schedule := &Schedule{}
    json.Unmarshal([]byte(data), schedule)
    return schedule, nil
}

func (cm *CacheManager) InvalidateScheduleCache(ctx context.Context, scheduleID uuid.UUID) error {
    key := fmt.Sprintf("schedule:%s", scheduleID)
    return cm.redis.Del(ctx, key).Err()
}
```

### 8.2 Database Query Optimization

```go
// Use indexes effectively
func (repo *ScheduleRepository) GetScheduleWithEntries(scheduleID uuid.UUID) (*Schedule, error) {
    schedule := &Schedule{}
    
    // Use preload to avoid N+1 queries
    err := repo.db.
        Preload("Entries").
        Preload("CreatedByUser").
        First(schedule, "id = ?", scheduleID).Error
    
    return schedule, err
}

// Use pagination for large result sets
func (repo *EmployeeRepository) GetEmployeesPaginated(page, limit int) ([]Employee, int64, error) {
    var employees []Employee
    var total int64
    
    offset := (page - 1) * limit
    
    err := repo.db.
        Model(&Employee{}).
        Count(&total).
        Offset(offset).
        Limit(limit).
        Find(&employees).Error
    
    return employees, total, err
}
```

### 8.3 Connection Pooling

```go
// Configure database connection pool
dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
    os.Getenv("DB_HOST"),
    os.Getenv("DB_PORT"),
    os.Getenv("DB_USER"),
    os.Getenv("DB_PASSWORD"),
    os.Getenv("DB_NAME"),
)

db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

sqlDB, _ := db.DB()
sqlDB.SetMaxIdleConns(10)
sqlDB.SetMaxOpenConns(100)
sqlDB.SetConnMaxLifetime(time.Hour)
```

---

## 9. New Database Migrations

### 9.1 Migration File: 003_add_phase2_tables.sql

```sql
-- Fairness Metrics
CREATE TABLE schedule_fairness_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    schedule_id UUID REFERENCES schedules(id),
    employee_id UUID REFERENCES employees(id),
    fairness_score DECIMAL(5,2),
    historical_office_days INT,
    assigned_office_days INT,
    variance DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reports
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    created_by UUID REFERENCES employees(id),
    filters JSONB,
    data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES employees(id),
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255),
    message TEXT,
    data JSONB,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bulk Change Requests
CREATE TABLE bulk_change_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by UUID REFERENCES employees(id),
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    total_requests INT,
    approved_count INT DEFAULT 0,
    rejected_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_fairness_schedule ON schedule_fairness_metrics(schedule_id);
CREATE INDEX idx_reports_created_by ON reports(created_by);
CREATE INDEX idx_reports_type ON reports(type);
CREATE INDEX idx_notifications_employee ON notifications(employee_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_bulk_requests_status ON bulk_change_requests(status);
```

---

## 10. New API Endpoints Implementation

### 10.1 Advanced Schedule Endpoints

```go
// GET /api/v1/admin/schedules/{id}/fairness
func (h *ScheduleHandler) GetFairnessMetrics(c *gin.Context) {
    scheduleID := c.Param("id")
    
    metrics, err := h.fairnessService.CalculateMetrics(scheduleID)
    if err != nil {
        c.JSON(400, gin.H{"error": err.Error()})
        return
    }
    
    c.JSON(200, metrics)
}

// POST /api/v1/admin/schedules/{id}/rollback
func (h *ScheduleHandler) RollbackSchedule(c *gin.Context) {
    scheduleID := c.Param("id")
    
    err := h.scheduleService.RollbackToVersion(scheduleID, c.Query("version"))
    if err != nil {
        c.JSON(400, gin.H{"error": err.Error()})
        return
    }
    
    c.JSON(200, gin.H{"message": "Schedule rolled back successfully"})
}
```

### 10.2 Bulk Operations Endpoints

```go
// POST /api/v1/manager/bulk-change-requests
func (h *ChangeRequestHandler) SubmitBulkRequest(c *gin.Context) {
    var input BulkChangeRequestInput
    if err := c.BindJSON(&input); err != nil {
        c.JSON(400, gin.H{"error": err.Error()})
        return
    }
    
    userID := c.GetString("user_id")
    bulkReq, err := h.bulkService.SubmitBulkRequest(c, &input, userID)
    if err != nil {
        c.JSON(400, gin.H{"error": err.Error()})
        return
    }
    
    c.JSON(201, bulkReq)
}
```

---

## 11. Testing Strategy

### 11.1 Unit Tests

```go
func TestAdvancedSchedulingAlgorithm(t *testing.T) {
    algo := &SchedulingAlgorithm{
        employees: testEmployees,
        capacity: map[int]int{0: 50, 1: 50, 2: 50, 3: 50, 4: 50},
    }
    
    schedule, err := algo.Generate()
    assert.NoError(t, err)
    assert.NotNil(t, schedule)
    
    // Validate schedule
    assert.True(t, algo.validateSchedule(schedule))
}

func TestFairnessCalculation(t *testing.T) {
    service := &FairnessService{db: testDB}
    
    metrics, err := service.CalculateMetrics(testSchedule)
    assert.NoError(t, err)
    assert.Equal(t, len(metrics), len(testEmployees))
}
```

### 11.2 Integration Tests

```go
func TestBulkChangeRequestWorkflow(t *testing.T) {
    // Create bulk request
    bulkReq, _ := bulkService.SubmitBulkRequest(ctx, input, adminID)
    
    // Approve bulk request
    err := bulkService.ApproveBulkRequest(ctx, bulkReq.ID, adminID)
    assert.NoError(t, err)
    
    // Verify all requests approved
    assert.Equal(t, bulkReq.ApprovedCount, bulkReq.TotalRequests)
}
```

---

## 12. Dependencies (Additional)

```
github.com/gorilla/websocket v1.5.0
github.com/go-echarts/go-echarts/v2 v2.2.0
github.com/xuri/excelize/v2 v2.7.0
github.com/jung-kurt/gofpdf v1.16.2
```

---

## 13. Deployment Checklist

- [ ] All advanced features implemented
- [ ] Caching layer working
- [ ] WebSocket connections stable
- [ ] Reports generating correctly
- [ ] Performance targets met
- [ ] Tests passing (70%+ coverage)
- [ ] API documentation updated
- [ ] Database migrations tested
- [ ] Error handling comprehensive
- [ ] Security review completed

---

**Document Version**: 1.0  
**Created**: [Current Date]  
**Status**: Phase 2 Backend Implementation
