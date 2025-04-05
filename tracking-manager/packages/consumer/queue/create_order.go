package queue

import (
	"consumer/models"
	"consumer/statics"
	"context"
	"encoding/json"
	"log/slog"

	"github.com/streadway/amqp"
)

// ExampleQueue ExampleQueue
type CreateOrderQueue struct {
}

func (e *CreateOrderQueue) process(msg []byte, ch *amqp.Channel, ctx context.Context) (bool, error) {
	var raw models.Orders
	err := json.Unmarshal(msg, &raw)
	if err != nil {
		return false, err
	}

	model := raw

	res, _id, err := model.Create(ctx)
	if err != nil {
		return res, err
	}

	if _id != "" {
		order, err := models.GetOrderById(ctx, _id)
		if err != nil {
			slog.Error("Cannot get order by id", "id", _id, "err", err)
			return res, nil
		}
		res, err = order.DeleteOrderRedis(ctx)
		if err != nil {
			slog.Error("Failed to delete order from redis", "id", _id, "err", err)
			return res, nil
		}
	}
	return res, err
}

func (e *CreateOrderQueue) queueName() string {
	return statics.CreateOrderQueueName
}
func (e *CreateOrderQueue) queueRetry() string {
	return statics.CreateOrderQueueNameRetry
}

func (e *CreateOrderQueue) numberOfWorker() int {
	return 10
}

// NewExampleQueue NewExampleQueue
func NewCreateOrderQueue() Queue {
	return &CreateOrderQueue{}
}
