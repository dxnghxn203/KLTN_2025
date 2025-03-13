package queue

import (
	"context"
	"encoding/json"
	"tracking-consumer/models"
	"tracking-consumer/statics"

	"github.com/streadway/amqp"
)

// ExampleQueue ExampleQueue
type CreateTrackingQueue struct {
}

func (e *CreateTrackingQueue) process(msg []byte, ch *amqp.Channel, ctx context.Context) (bool, error) {
	var raw models.Tracking
	err := json.Unmarshal(msg, &raw)
	if err != nil {
		return false, err
	}

	model := raw

	res, _, err := model.Create(ctx)
	if err != nil {
		return res, err
	}

	return res, err
}

func (e *CreateTrackingQueue) queueName() string {
	return statics.CreateTrackingQueueName
}
func (e *CreateTrackingQueue) queueRetry() string {
	return statics.CreateTrackingQueueNameRetry
}

func (e *CreateTrackingQueue) numberOfWorker() int {
	return 10
}

// NewExampleQueue NewExampleQueue
func NewCreateTrackingQueue() Queue {
	return &CreateTrackingQueue{}
}
