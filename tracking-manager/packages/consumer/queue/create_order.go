package queue

import (
	"consumer/helper"
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
		slog.Warn("Lỗi sản phẩm, vẫn tạo đơn với trạng thái canceled", "err", err)
	}

	res, _id, err := orderRaw.Create(ctx)
	if err != nil {
		return res, err
	}

	if _id != "" && orderRaw.Status != "canceled" {
		err = models.UpdateProductCount(ctx, orderRaw.Product, "sell", 1)
		if err != nil {
			slog.Error("Lỗi cập nhật số lượng đã bán sau khi tạo đơn hàng", "err", err)
		}

		file, err := helper.ExportInvoiceToPDF(orderRaw)
		if err != nil {
			slog.Error("Lỗi xuất hóa đơn", "err", err)
			return false, err
		}

		err = helper.SendInvoiceEmail(orderRaw.PickTo.Email, file, orderRaw.OrderId)
		if err != nil {
			slog.Error("Lỗi gửi email hóa đơn", "err", err)
		}
		is_remove := models.RemoveItemCartByOrder(ctx, orderRaw)
		if is_remove == false {
			slog.Error("Lỗi xóa sản phẩm trong giỏ hàng", "err", err)
		}
	} else {
		trackingRaw.Status = orderRaw.Status
		trackingRaw.DeliveryInstruction = orderRaw.DeliveryInstruction
	}

	err = orderRaw.DeleteOrderRedis(ctx)
	if err != nil {
		slog.Error("Failed to delete order from redis", "id", _id, "err", err)
	}

	res, _, err = trackingRaw.Create(ctx)
	if err != nil {
		return res, err
	}
	return true, nil
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
