package services

import (
	"bytes"
	"fmt"
	"html/template"
	"net/smtp"
	"office-seat-allocation/backend/internal/config"
)

type EmailService struct {
	smtpHost string
	smtpPort string
	smtpUser string
	smtpPass string
	from     string
}

func NewEmailService() *EmailService {
	return &EmailService{
		smtpHost: config.AppConfig.SMTPHost,
		smtpPort: config.AppConfig.SMTPPort,
		smtpUser: config.AppConfig.SMTPUser,
		smtpPass: config.AppConfig.SMTPPassword,
		from:     config.AppConfig.SMTPUser,
	}
}

func (s *EmailService) SendEmail(to, subject, body string) error {
	auth := smtp.PlainAuth("", s.smtpUser, s.smtpPass, s.smtpHost)

	msg := []byte(fmt.Sprintf("From: %s\r\nTo: %s\r\nSubject: %s\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n%s",
		s.from, to, subject, body))

	addr := fmt.Sprintf("%s:%s", s.smtpHost, s.smtpPort)
	return smtp.SendMail(addr, auth, s.from, []string{to}, msg)
}

func (s *EmailService) SendSchedulePublishedEmail(to, employeeName, weekStart, weekEnd string) error {
	tmpl := `
<!DOCTYPE html>
<html>
<body>
	<h2>Schedule Published</h2>
	<p>Hi {{.Name}},</p>
	<p>Your work schedule for the week of <strong>{{.WeekStart}}</strong> to <strong>{{.WeekEnd}}</strong> has been published.</p>
	<p>Please log in to the system to view your schedule.</p>
	<p>Best regards,<br>Office Seat Allocation System</p>
</body>
</html>
`
	t, _ := template.New("schedule").Parse(tmpl)
	var body bytes.Buffer
	t.Execute(&body, map[string]string{
		"Name":      employeeName,
		"WeekStart": weekStart,
		"WeekEnd":   weekEnd,
	})

	return s.SendEmail(to, "Schedule Published", body.String())
}

func (s *EmailService) SendChangeRequestApprovedEmail(to, employeeName, currentDay, requestedDay string) error {
	tmpl := `
<!DOCTYPE html>
<html>
<body>
	<h2>Change Request Approved</h2>
	<p>Hi {{.Name}},</p>
	<p>Your change request has been <strong>approved</strong>.</p>
	<p>Change: Day {{.CurrentDay}} → Day {{.RequestedDay}}</p>
	<p>Best regards,<br>Office Seat Allocation System</p>
</body>
</html>
`
	t, _ := template.New("approved").Parse(tmpl)
	var body bytes.Buffer
	t.Execute(&body, map[string]string{
		"Name":         employeeName,
		"CurrentDay":   currentDay,
		"RequestedDay": requestedDay,
	})

	return s.SendEmail(to, "Change Request Approved", body.String())
}

func (s *EmailService) SendChangeRequestRejectedEmail(to, employeeName, reason string) error {
	tmpl := `
<!DOCTYPE html>
<html>
<body>
	<h2>Change Request Rejected</h2>
	<p>Hi {{.Name}},</p>
	<p>Your change request has been <strong>rejected</strong>.</p>
	<p>Reason: {{.Reason}}</p>
	<p>Best regards,<br>Office Seat Allocation System</p>
</body>
</html>
`
	t, _ := template.New("rejected").Parse(tmpl)
	var body bytes.Buffer
	t.Execute(&body, map[string]string{
		"Name":   employeeName,
		"Reason": reason,
	})

	return s.SendEmail(to, "Change Request Rejected", body.String())
}
