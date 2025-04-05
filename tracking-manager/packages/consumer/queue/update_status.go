package queue

import (
	"consumer/models"
	"consumer/statics"
	"context"
	"encoding/json"
	"log/slog"

	"github.com/streadway/amqp"
)

type UpdateStatusQueue struct {
}

func (e *UpdateStatusQueue) process(msg []byte, ch *amqp.Channel, ctx context.Context) (bool, error) {
	var trackingReq models.TrackingReq
	err := json.Unmarshal(msg, &trackingReq)
	if err != nil {
		slog.Error("Failed to unmarshal tracking request", "err", err)
		return false, err
	}

	orderRes, err := models.GetOrderByOrderId(ctx, trackingReq.OrderId)
	if err != nil {
		slog.Error("Failed to get order by orderId", "orderId", trackingReq.OrderId, "err", err)
		return false, err
	}

	newTracking := trackingReq.Mapping(trackingReq.TrackingId)

	res, _, err := newTracking.Create(ctx)
	if err != nil {
		return res, err
	}

	orderToUpdate := &models.OrderToUpdate{
		OrderId:             orderRes.OrderId,
		Status:              trackingReq.Status,
		DeliveryInstruction: trackingReq.DeliveryInstruction,
	}

	res, id, err := orderToUpdate.Update(ctx, orderRes.Id.Hex())
	if err != nil {
		slog.Error("Failed to update order", "orderId", orderRes.OrderId, "err", err)
		return false, err
	}
	slog.Info("Successfully updated order from hook", "order_id", id, "status", trackingReq.Status)
	return res, err
}

func (e *UpdateStatusQueue) queueName() string {
	return statics.UpdateQueueName
}
func (e *UpdateStatusQueue) queueRetry() string {
	return statics.UpdateQueueNameRetry
}

func (e *UpdateStatusQueue) numberOfWorker() int {
	return 10
}

// NewExampleQueue NewExampleQueue
func NewUpdateStatusQueue() Queue {
	return &UpdateStatusQueue{}
}
