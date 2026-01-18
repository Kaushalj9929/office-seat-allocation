package utils

const (
	RoleEmployee  = "employee"
	RoleTeamLead  = "team_lead"
	RoleManager   = "manager"
	RoleAdmin     = "admin"

	StatusActive   = "active"
	StatusInactive = "inactive"
	StatusOnLeave  = "on_leave"

	ScheduleStatusDraft     = "draft"
	ScheduleStatusPublished = "published"
	ScheduleStatusArchived  = "archived"

	WorkTypeOffice = "office"
	WorkTypeWFH    = "wfh"

	EntryStatusAssigned  = "assigned"
	EntryStatusCancelled = "cancelled"
	EntryStatusSwapped   = "swapped"

	RequestStatusPending   = "pending"
	RequestStatusApproved  = "approved"
	RequestStatusRejected  = "rejected"
	RequestStatusCancelled = "cancelled"

	AuditActionCreate = "create"
	AuditActionUpdate = "update"
	AuditActionDelete = "delete"
	AuditActionApprove = "approve"
	AuditActionReject = "reject"

	AdvanceNoticeDays = 2
	OfficeDaysPerWeek = 3
	WFHDaysPerWeek    = 2
)
