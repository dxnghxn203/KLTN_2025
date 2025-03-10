package queue

import (
	"context"
	"encoding/json"
	"log/slog"
	"tracking-consumer/models"
	"tracking-consumer/statics"

	"github.com/streadway/amqp"
)

// ExampleQueue ExampleQueue
type CreateQueue struct {
}

func (e *CreateQueue) process(msg []byte, ch *amqp.Channel, ctx context.Context) (bool, error) {
	var raw models.Orders
	err := json.Unmarshal(msg, &raw)
	if err != nil {
		return false, err
	}
	slog.Info("New order received", "order", raw)
	return true, nil

	// model := raw

	// res, _id, err := model.Create(ctx)
	// if err != nil {
	// 	return res, err
	// }

	// if _id != "" {
	// 	order, err := models.GetOrderById(ctx, _id)
	// 	if err != nil {
	// 		slog.Error("Cannot get order by id", "id", _id, "err", err)
	// 		return res, nil
	// 	}
	// 	slog.Info("Order by id", "id", _id, "order", order)
	// }
	// return res, err
}

func (e *CreateQueue) queueName() string {
	return statics.CreateQueueName
}
func (e *CreateQueue) queueRetry() string {
	return statics.CreateQueueNameRetry
}

func (e *CreateQueue) numberOfWorker() int {
	return 10
}

// NewExampleQueue NewExampleQueue
func NewCreateQueue() Queue {
	return &CreateQueue{}
}
