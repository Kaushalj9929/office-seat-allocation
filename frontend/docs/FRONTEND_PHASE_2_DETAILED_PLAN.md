# Frontend Phase 2 Detailed Implementation Plan
## Office Workspace Seat Allocation System - Enhancement & Optimization

---

## 1. Overview

This document provides detailed specifications for frontend implementation in Phase 2. It covers advanced UI components, real-time features, reporting dashboards, manager interfaces, and performance optimization.

---

## 2. New Components Structure

```
frontend/src/components/
├── Common/
│   ├── Charts/
│   │   ├── BarChart.tsx
│   │   ├── LineChart.tsx
│   │   ├── PieChart.tsx
│   │   └── HeatMap.tsx
│   ├── NotificationCenter.tsx
│   ├── RealTimeIndicator.tsx
│   └── ExportButton.tsx
├── Admin/
│   ├── AdvancedScheduling/
│   │   ├── FairnessVisualization.tsx
│   │   ├── ScheduleComparison.tsx
│   │   ├── ScheduleHistory.tsx
│   │   └── ScheduleDiffViewer.tsx
│   ├── BulkOperations/
│   │   ├── BulkRequestForm.tsx
│   │   ├── BulkApprovalInterface.tsx
│   │   ├── BulkProgressTracker.tsx
│   │   └── BulkResultsSummary.tsx
│   └── Reporting/
│       ├── ReportingDashboard.tsx
│       ├── CapacityUtilizationChart.tsx
│       ├── FairnessAnalysisChart.tsx
│       ├── ChangeRequestStatsChart.tsx
│       ├── TeamBreakdownChart.tsx
│       ├── ReportFilters.tsx
│       ├── ReportScheduler.tsx
│       └── ReportExporter.tsx
├── Manager/
│   ├── TeamScheduleView.tsx
│   ├── TeamAnalytics.tsx
│   ├── TeamChangeRequests.tsx
│   ├── TeamPerformanceMetrics.tsx
│   └── TeamMemberList.tsx
├── Employee/
│   ├── RealTimeNotifications.tsx
│   ├── NotificationPreferences.tsx
│   └── NotificationHistory.tsx
└── Calendar/
    ├── CalendarIntegration.tsx
    ├── GoogleCalendarSync.tsx
    └── OutlookCalendarSync.tsx
```

---

## 3. Advanced Scheduling Components

### 3.1 FairnessVisualization Component

```typescript
interface FairnessVisualizationProps {
    schedule: Schedule;
    fairnessMetrics: FairnessMetrics[];
    isLoading: boolean;
}

// Features:
// - Display fairness score for each employee
// - Show historical vs assigned office days
// - Highlight outliers
// - Color coding (green=fair, yellow=warning, red=unfair)
// - Sortable by fairness score
// - Export fairness report

export const FairnessVisualization: React.FC<FairnessVisualizationProps> = ({
    schedule,
    fairnessMetrics,
    isLoading,
}) => {
    const [sortBy, setSortBy] = useState<'score' | 'variance'>('score');
    
    const sortedMetrics = useMemo(() => {
        return [...fairnessMetrics].sort((a, b) => {
            if (sortBy === 'score') {
                return b.fairness_score - a.fairness_score;
            }
            return Math.abs(b.variance) - Math.abs(a.variance);
        });
    }, [fairnessMetrics, sortBy]);
    
    return (
        <div className="fairness-visualization">
            <h2>Schedule Fairness Analysis</h2>
            <div className="controls">
                <button onClick={() => setSortBy('score')}>Sort by Score</button>
                <button onClick={() => setSortBy('variance')}>Sort by Variance</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Employee</th>
                        <th>Fairness Score</th>
                        <th>Historical Days</th>
                        <th>Assigned Days</th>
                        <th>Variance</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedMetrics.map(metric => (
                        <tr key={metric.employee_id}>
                            <td>{metric.employee_name}</td>
                            <td>
                                <span className={`score score-${getFairnessLevel(metric.fairness_score)}`}>
                                    {metric.fairness_score.toFixed(2)}
                                </span>
                            </td>
                            <td>{metric.historical_office_days}</td>
                            <td>{metric.assigned_office_days}</td>
                            <td>{metric.variance.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
```

### 3.2 ScheduleComparison Component

```typescript
interface ScheduleComparisonProps {
    schedule1: Schedule;
    schedule2: Schedule;
}

// Features:
// - Side-by-side schedule comparison
// - Highlight differences
// - Show change summary
// - Diff statistics

export const ScheduleComparison: React.FC<ScheduleComparisonProps> = ({
    schedule1,
    schedule2,
}) => {
    const differences = useMemo(() => {
        const diffs: ScheduleDiff[] = [];
        
        schedule1.entries.forEach(entry1 => {
            const entry2 = schedule2.entries.find(
                e => e.employee_id === entry1.employee_id && 
                     e.day_of_week === entry1.day_of_week
            );
            
            if (entry2 && entry1.work_type !== entry2.work_type) {
                diffs.push({
                    employee_id: entry1.employee_id,
                    day_of_week: entry1.day_of_week,
                    from: entry1.work_type,
                    to: entry2.work_type,
                });
            }
        });
        
        return diffs;
    }, [schedule1, schedule2]);
    
    return (
        <div className="schedule-comparison">
            <h2>Schedule Comparison</h2>
            <div className="comparison-stats">
                <p>Total Changes: {differences.length}</p>
                <p>Affected Employees: {new Set(differences.map(d => d.employee_id)).size}</p>
            </div>
            <div className="comparison-grid">
                <div className="schedule-column">
                    <h3>Schedule 1</h3>
                    {/* Schedule 1 display */}
                </div>
                <div className="schedule-column">
                    <h3>Schedule 2</h3>
                    {/* Schedule 2 display */}
                </div>
            </div>
            <div className="differences">
                <h3>Changes</h3>
                {differences.map(diff => (
                    <div key={`${diff.employee_id}-${diff.day_of_week}`} className="diff-item">
                        <span>{diff.employee_id}</span>
                        <span>Day {diff.day_of_week}: {diff.from} → {diff.to}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
```

---

## 4. Bulk Operations Components

### 4.1 BulkRequestForm Component

```typescript
interface BulkRequestFormProps {
    onSubmit: (data: BulkChangeRequestInput) => Promise<void>;
    isLoading: boolean;
}

export const BulkRequestForm: React.FC<BulkRequestFormProps> = ({
    onSubmit,
    isLoading,
}) => {
    const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
    const [currentDay, setCurrentDay] = useState<number>(0);
    const [requestedDay, setRequestedDay] = useState<number>(1);
    const [reason, setReason] = useState('');
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        await onSubmit({
            employee_ids: selectedEmployees,
            current_day: currentDay,
            requested_day: requestedDay,
            reason,
        });
    };
    
    return (
        <form onSubmit={handleSubmit} className="bulk-request-form">
            <div className="form-group">
                <label>Select Employees</label>
                <EmployeeMultiSelect
                    selected={selectedEmployees}
                    onChange={setSelectedEmployees}
                />
            </div>
            
            <div className="form-group">
                <label>Current Day</label>
                <DaySelector value={currentDay} onChange={setCurrentDay} />
            </div>
            
            <div className="form-group">
                <label>Requested Day</label>
                <DaySelector value={requestedDay} onChange={setRequestedDay} />
            </div>
            
            <div className="form-group">
                <label>Reason</label>
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Reason for bulk change"
                />
            </div>
            
            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Submitting...' : 'Submit Bulk Request'}
            </button>
        </form>
    );
};
```

### 4.2 BulkProgressTracker Component

```typescript
interface BulkProgressTrackerProps {
    bulkRequest: BulkChangeRequest;
}

export const BulkProgressTracker: React.FC<BulkProgressTrackerProps> = ({
    bulkRequest,
}) => {
    const approvalRate = (bulkRequest.approved_count / bulkRequest.total_requests) * 100;
    const rejectionRate = (bulkRequest.rejected_count / bulkRequest.total_requests) * 100;
    
    return (
        <div className="bulk-progress-tracker">
            <h3>Bulk Request Progress</h3>
            
            <div className="progress-stats">
                <div className="stat">
                    <span>Total Requests:</span>
                    <strong>{bulkRequest.total_requests}</strong>
                </div>
                <div className="stat">
                    <span>Approved:</span>
                    <strong className="approved">{bulkRequest.approved_count}</strong>
                </div>
                <div className="stat">
                    <span>Rejected:</span>
                    <strong className="rejected">{bulkRequest.rejected_count}</strong>
                </div>
            </div>
            
            <div className="progress-bars">
                <div className="progress-bar">
                    <div className="bar-label">Approval Rate</div>
                    <div className="bar-container">
                        <div className="bar-fill approved" style={{ width: `${approvalRate}%` }}>
                            {approvalRate.toFixed(0)}%
                        </div>
                    </div>
                </div>
                
                <div className="progress-bar">
                    <div className="bar-label">Rejection Rate</div>
                    <div className="bar-container">
                        <div className="bar-fill rejected" style={{ width: `${rejectionRate}%` }}>
                            {rejectionRate.toFixed(0)}%
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
```

---

## 5. Reporting Components

### 5.1 ReportingDashboard Component

```typescript
interface ReportingDashboardProps {
    isLoading: boolean;
}

export const ReportingDashboard: React.FC<ReportingDashboardProps> = ({
    isLoading,
}) => {
    const [reportType, setReportType] = useState<'capacity' | 'fairness' | 'change_requests' | 'team_breakdown'>('capacity');
    const [filters, setFilters] = useState<ReportFilters>({});
    const [report, setReport] = useState<Report | null>(null);
    
    const handleGenerateReport = async () => {
        const data = await reportService.generateReport(reportType, filters);
        setReport(data);
    };
    
    return (
        <div className="reporting-dashboard">
            <h1>Reports & Analytics</h1>
            
            <div className="report-controls">
                <div className="report-type-selector">
                    <button
                        className={reportType === 'capacity' ? 'active' : ''}
                        onClick={() => setReportType('capacity')}
                    >
                        Capacity Utilization
                    </button>
                    <button
                        className={reportType === 'fairness' ? 'active' : ''}
                        onClick={() => setReportType('fairness')}
                    >
                        Fairness Analysis
                    </button>
                    <button
                        className={reportType === 'change_requests' ? 'active' : ''}
                        onClick={() => setReportType('change_requests')}
                    >
                        Change Requests
                    </button>
                    <button
                        className={reportType === 'team_breakdown' ? 'active' : ''}
                        onClick={() => setReportType('team_breakdown')}
                    >
                        Team Breakdown
                    </button>
                </div>
                
                <ReportFilters filters={filters} onChange={setFilters} />
                
                <button onClick={handleGenerateReport} disabled={isLoading}>
                    {isLoading ? 'Generating...' : 'Generate Report'}
                </button>
            </div>
            
            {report && (
                <div className="report-content">
                    {reportType === 'capacity' && <CapacityUtilizationChart report={report} />}
                    {reportType === 'fairness' && <FairnessAnalysisChart report={report} />}
                    {reportType === 'change_requests' && <ChangeRequestStatsChart report={report} />}
                    {reportType === 'team_breakdown' && <TeamBreakdownChart report={report} />}
                    
                    <div className="report-actions">
                        <ExportButton report={report} format="csv" />
                        <ExportButton report={report} format="pdf" />
                        <ExportButton report={report} format="excel" />
                    </div>
                </div>
            )}
        </div>
    );
};
```

### 5.2 Chart Components

```typescript
// CapacityUtilizationChart.tsx
export const CapacityUtilizationChart: React.FC<{ report: Report }> = ({ report }) => {
    const data = report.data as CapacityUtilizationReport[];
    
    const chartData = {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        datasets: [
            {
                label: 'Occupied Seats',
                data: data.map(d => d.occupied_seats),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
            {
                label: 'Available Seats',
                data: data.map(d => d.total_seats - d.occupied_seats),
                backgroundColor: 'rgba(201, 203, 207, 0.6)',
            },
        ],
    };
    
    return (
        <div className="chart-container">
            <h3>Capacity Utilization</h3>
            <Bar data={chartData} options={{ responsive: true }} />
        </div>
    );
};

// FairnessAnalysisChart.tsx
export const FairnessAnalysisChart: React.FC<{ report: Report }> = ({ report }) => {
    const data = report.data as FairnessAnalysisReport;
    
    const chartData = {
        labels: data.employee_metrics.map(m => m.employee_name),
        datasets: [
            {
                label: 'Fairness Score',
                data: data.employee_metrics.map(m => m.fairness_score),
                backgroundColor: data.employee_metrics.map(m => 
                    m.fairness_score > 80 ? 'green' : m.fairness_score > 60 ? 'yellow' : 'red'
                ),
            },
        ],
    };
    
    return (
        <div className="chart-container">
            <h3>Fairness Analysis</h3>
            <Bar data={chartData} options={{ responsive: true }} />
        </div>
    );
};
```

---

## 6. Manager Dashboard Components

### 6.1 TeamScheduleView Component

```typescript
interface TeamScheduleViewProps {
    teamId: string;
    isLoading: boolean;
}

export const TeamScheduleView: React.FC<TeamScheduleViewProps> = ({
    teamId,
    isLoading,
}) => {
    const [schedule, setSchedule] = useState<Schedule | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    
    useEffect(() => {
        const fetchTeamSchedule = async () => {
            const data = await managerService.getTeamSchedule(teamId);
            setSchedule(data);
        };
        
        fetchTeamSchedule();
    }, [teamId]);
    
    return (
        <div className="team-schedule-view">
            <h2>Team Schedule</h2>
            
            <div className="view-controls">
                <button
                    className={viewMode === 'grid' ? 'active' : ''}
                    onClick={() => setViewMode('grid')}
                >
                    Grid View
                </button>
                <button
                    className={viewMode === 'list' ? 'active' : ''}
                    onClick={() => setViewMode('list')}
                >
                    List View
                </button>
            </div>
            
            {isLoading ? (
                <LoadingSpinner />
            ) : schedule ? (
                viewMode === 'grid' ? (
                    <TeamScheduleGrid schedule={schedule} />
                ) : (
                    <TeamScheduleList schedule={schedule} />
                )
            ) : null}
        </div>
    );
};
```

### 6.2 TeamAnalytics Component

```typescript
interface TeamAnalyticsProps {
    teamId: string;
}

export const TeamAnalytics: React.FC<TeamAnalyticsProps> = ({ teamId }) => {
    const [analytics, setAnalytics] = useState<TeamAnalytics | null>(null);
    
    useEffect(() => {
        const fetchAnalytics = async () => {
            const data = await managerService.getTeamAnalytics(teamId);
            setAnalytics(data);
        };
        
        fetchAnalytics();
    }, [teamId]);
    
    return (
        <div className="team-analytics">
            <h2>Team Analytics</h2>
            
            <div className="analytics-grid">
                <div className="metric-card">
                    <h3>Average Fairness Score</h3>
                    <p className="metric-value">{analytics?.avg_fairness_score.toFixed(2)}</p>
                </div>
                
                <div className="metric-card">
                    <h3>Total Team Members</h3>
                    <p className="metric-value">{analytics?.total_members}</p>
                </div>
                
                <div className="metric-card">
                    <h3>Pending Requests</h3>
                    <p className="metric-value">{analytics?.pending_requests}</p>
                </div>
                
                <div className="metric-card">
                    <h3>Approval Rate</h3>
                    <p className="metric-value">{analytics?.approval_rate.toFixed(0)}%</p>
                </div>
            </div>
            
            <div className="analytics-charts">
                <TeamFairnessChart analytics={analytics} />
                <TeamCapacityChart analytics={analytics} />
            </div>
        </div>
    );
};
```

---

## 7. Real-time Notification Components

### 7.1 NotificationCenter Component

```typescript
export const NotificationCenter: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const ws = useRef<WebSocket | null>(null);
    
    useEffect(() => {
        // Connect to WebSocket
        ws.current = new WebSocket(`ws://localhost:8080/ws/notifications`);
        
        ws.current.onmessage = (event) => {
            const notification = JSON.parse(event.data);
            setNotifications(prev => [notification, ...prev]);
            
            // Play notification sound
            playNotificationSound();
        };
        
        return () => {
            ws.current?.close();
        };
    }, []);
    
    const handleMarkAsRead = async (notificationId: string) => {
        await notificationService.markAsRead(notificationId);
        setNotifications(prev =>
            prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
        );
    };
    
    const unreadCount = notifications.filter(n => !n.read).length;
    
    return (
        <div className="notification-center">
            <button
                className="notification-bell"
                onClick={() => setIsOpen(!isOpen)}
            >
                🔔
                {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
            </button>
            
            {isOpen && (
                <div className="notification-panel">
                    <h3>Notifications</h3>
                    <div className="notification-list">
                        {notifications.map(notification => (
                            <div
                                key={notification.id}
                                className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                            >
                                <div className="notification-content">
                                    <h4>{notification.title}</h4>
                                    <p>{notification.message}</p>
                                    <small>{formatTime(notification.created_at)}</small>
                                </div>
                                <button
                                    onClick={() => handleMarkAsRead(notification.id)}
                                    className="mark-read-btn"
                                >
                                    ✓
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
```

---

## 8. Calendar Integration

### 8.1 CalendarIntegration Component

```typescript
export const CalendarIntegration: React.FC = () => {
    const [connectedCalendars, setConnectedCalendars] = useState<string[]>([]);
    
    const handleGoogleCalendarConnect = async () => {
        const result = await calendarService.connectGoogleCalendar();
        if (result.success) {
            setConnectedCalendars(prev => [...prev, 'google']);
            await calendarService.syncScheduleToGoogle();
        }
    };
    
    const handleOutlookCalendarConnect = async () => {
        const result = await calendarService.connectOutlookCalendar();
        if (result.success) {
            setConnectedCalendars(prev => [...prev, 'outlook']);
            await calendarService.syncScheduleToOutlook();
        }
    };
    
    return (
        <div className="calendar-integration">
            <h2>Calendar Integration</h2>
            
            <div className="calendar-options">
                <div className="calendar-option">
                    <h3>Google Calendar</h3>
                    {connectedCalendars.includes('google') ? (
                        <p className="connected">✓ Connected</p>
                    ) : (
                        <button onClick={handleGoogleCalendarConnect}>
                            Connect Google Calendar
                        </button>
                    )}
                </div>
                
                <div className="calendar-option">
                    <h3>Outlook Calendar</h3>
                    {connectedCalendars.includes('outlook') ? (
                        <p className="connected">✓ Connected</p>
                    ) : (
                        <button onClick={handleOutlookCalendarConnect}>
                            Connect Outlook Calendar
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
```

---

## 9. Mobile Responsiveness

### 9.1 Responsive Design Strategy

```css
/* Mobile-first approach */
@media (max-width: 768px) {
    /* Stack layouts vertically */
    .comparison-grid {
        display: flex;
        flex-direction: column;
    }
    
    /* Adjust table display */
    table {
        font-size: 0.875rem;
    }
    
    /* Simplify navigation */
    .sidebar {
        position: fixed;
        left: -100%;
        transition: left 0.3s;
    }
    
    .sidebar.open {
        left: 0;
    }
    
    /* Optimize charts */
    .chart-container {
        height: 300px;
    }
}

@media (max-width: 480px) {
    /* Further optimization for small screens */
    .metric-card {
        padding: 1rem;
    }
    
    button {
        width: 100%;
        margin-bottom: 0.5rem;
    }
}
```

---

## 10. Performance Optimization

### 10.1 Code Splitting

```typescript
// pages/ReportingPage.tsx
const ReportingDashboard = lazy(() => import('../components/Admin/Reporting/ReportingDashboard'));

export const ReportingPage: React.FC = () => {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <ReportingDashboard />
        </Suspense>
    );
};
```

### 10.2 Memoization

```typescript
export const FairnessVisualization = memo(
    ({ schedule, fairnessMetrics, isLoading }: FairnessVisualizationProps) => {
        // Component implementation
    },
    (prevProps, nextProps) => {
        return (
            prevProps.schedule.id === nextProps.schedule.id &&
            prevProps.isLoading === nextProps.isLoading
        );
    }
);
```

---

## 11. New Redux Slices

### 11.1 Reporting Slice

```typescript
// store/slices/reportingSlice.ts
const reportingSlice = createSlice({
    name: 'reporting',
    initialState: initialReportingState,
    reducers: {
        setReports: (state, action) => { /* ... */ },
        setCurrentReport: (state, action) => { /* ... */ },
        setReportLoading: (state, action) => { /* ... */ },
        setReportError: (state, action) => { /* ... */ },
    },
});
```

### 11.2 Notification Slice

```typescript
// store/slices/notificationSlice.ts
const notificationSlice = createSlice({
    name: 'notifications',
    initialState: initialNotificationState,
    reducers: {
        addNotification: (state, action) => { /* ... */ },
        markAsRead: (state, action) => { /* ... */ },
        clearNotifications: (state) => { /* ... */ },
    },
});
```

---

## 12. New Services

### 12.1 Report Service

```typescript
// services/reportService.ts
export const reportService = {
    generateReport: async (type: string, filters: ReportFilters): Promise<Report> => {
        // POST /api/v1/admin/reports/generate
    },
    exportReport: async (reportId: string, format: 'csv' | 'pdf' | 'excel'): Promise<Blob> => {
        // POST /api/v1/admin/reports/{id}/export
    },
    scheduleReport: async (reportId: string, schedule: ReportSchedule): Promise<void> => {
        // POST /api/v1/admin/reports/{id}/schedule
    },
};
```

### 12.2 Calendar Service

```typescript
// services/calendarService.ts
export const calendarService = {
    connectGoogleCalendar: async (): Promise<{ success: boolean }> => {
        // OAuth flow for Google Calendar
    },
    syncScheduleToGoogle: async (): Promise<void> => {
        // POST /api/v1/calendar/google/sync
    },
    connectOutlookCalendar: async (): Promise<{ success: boolean }> => {
        // OAuth flow for Outlook
    },
    syncScheduleToOutlook: async (): Promise<void> => {
        // POST /api/v1/calendar/outlook/sync
    },
};
```

---

## 13. Testing Strategy

### 13.1 Component Tests

```typescript
describe('FairnessVisualization', () => {
    it('should render fairness metrics', () => {
        const { getByText } = render(
            <FairnessVisualization
                schedule={mockSchedule}
                fairnessMetrics={mockMetrics}
                isLoading={false}
            />
        );
        
        expect(getByText('Schedule Fairness Analysis')).toBeInTheDocument();
    });
});
```

---

## 14. Deployment Checklist

- [ ] All new components built and tested
- [ ] Real-time features working
- [ ] Charts rendering correctly
- [ ] Mobile-responsive on all pages
- [ ] Calendar integration working
- [ ] Performance optimized
- [ ] Tests passing
- [ ] Documentation updated

---

**Document Version**: 1.0  
**Created**: [Current Date]  
**Status**: Phase 2 Frontend Implementation
