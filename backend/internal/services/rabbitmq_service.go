package services

import (
	"encoding/json"
	"log"
	"office-seat-allocation/backend/internal/config"

	"github.com/streadway/amqp"
)

type NotificationMessage struct {
	Type      string                 `json:"type"`
	To        string                 `json:"to"`
	Data      map[string]interface{} `json:"data"`
	Timestamp string                 `json:"timestamp"`
}

type RabbitMQService struct {
	conn    *amqp.Connection
	channel *amqp.Channel
	queue   string
}

func NewRabbitMQService() (*RabbitMQService, error) {
	conn, err := amqp.Dial(config.AppConfig.RabbitMQURL)
	if err != nil {
		return nil, err
	}

	ch, err := conn.Channel()
	if err != nil {
		return nil, err
	}

	queueName := "notifications"
	_, err = ch.QueueDeclare(
		queueName,
		true,  // durable
		false, // delete when unused
		false, // exclusive
		false, // no-wait
		nil,   // arguments
	)
	if err != nil {
		return nil, err
	}

	return &RabbitMQService{
		conn:    conn,
		channel: ch,
		queue:   queueName,
	}, nil
}

func (r *RabbitMQService) PublishNotification(msg NotificationMessage) error {
	body, err := json.Marshal(msg)
	if err != nil {
		return err
	}

	return r.channel.Publish(
		"",      // exchange
		r.queue, // routing key
		false,   // mandatory
		false,   // immediate
		amqp.Publishing{
			ContentType: "application/json",
			Body:        body,
		},
	)
}

func (r *RabbitMQService) ConsumeNotifications(emailService *EmailService) {
	msgs, err := r.channel.Consume(
		r.queue,
		"",    // consumer
		true,  // auto-ack
		false, // exclusive
		false, // no-local
		false, // no-wait
		nil,   // args
	)
	if err != nil {
		log.Printf("Failed to register consumer: %v", err)
		return
	}

	go func() {
		for msg := range msgs {
			var notification NotificationMessage
			if err := json.Unmarshal(msg.Body, &notification); err != nil {
				log.Printf("Error unmarshaling message: %v", err)
				continue
			}

			r.processNotification(notification, emailService)
		}
	}()

	log.Println("RabbitMQ consumer started")
}

func (r *RabbitMQService) processNotification(msg NotificationMessage, emailService *EmailService) {
	switch msg.Type {
	case "schedule_published":
		emailService.SendSchedulePublishedEmail(
			msg.To,
			msg.Data["employee_name"].(string),
			msg.Data["week_start"].(string),
			msg.Data["week_end"].(string),
		)
	case "change_request_approved":
		emailService.SendChangeRequestApprovedEmail(
			msg.To,
			msg.Data["employee_name"].(string),
			msg.Data["current_day"].(string),
			msg.Data["requested_day"].(string),
		)
	case "change_request_rejected":
		emailService.SendChangeRequestRejectedEmail(
			msg.To,
			msg.Data["employee_name"].(string),
			msg.Data["reason"].(string),
		)
	}
}

func (r *RabbitMQService) Close() {
	if r.channel != nil {
		r.channel.Close()
	}
	if r.conn != nil {
		r.conn.Close()
	}
}
