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
	var orderRaw models.Orders
	err := json.Unmarshal(msg, &orderRaw)
	if err != nil {
		return false, err
	}

	var trackingRaw models.Tracking
	err = json.Unmarshal(msg, &trackingRaw)
	if err != nil {
		return false, err
	}

	err = models.CheckInventoryAndUpdateOrder(ctx, &orderRaw)
	if err != nil {
		slog.Warn("Inventory không đủ, vẫn tạo đơn với trạng thái canceled", "err", err)
	}

	res, _id, err := orderRaw.Create(ctx)
	if err != nil {
		return res, err
	}

	if _id != "" && orderRaw.Status != "canceled" {
		err = models.UpdateProductSellCount(ctx, orderRaw.Product)
		if err != nil {
			slog.Error("Lỗi cập nhật số lượng đã bán sau khi tạo đơn hàng", "err", err)
		}
		err = orderRaw.DeleteOrderRedis(ctx)
		if err != nil {
			slog.Error("Failed to delete order from redis", "id", _id, "err", err)
		}
	} else {
		trackingRaw.Status = orderRaw.Status
		trackingRaw.DeliveryInstruction = orderRaw.DeliveryInstruction
	}
	res, _, err = trackingRaw.Create(ctx)
	if err != nil {
		return res, err
	}
	return res, nil
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
