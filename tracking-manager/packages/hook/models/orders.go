package models

import (
	"fmt"
	"hook/statics"
)

type UpdateOrderStatusReq struct {
	OrderId             string `json:"order_id" binding:"required"`
	Status              string `json:"status" binding:"required"`
	StatusCode          string `json:"status_code" binding:"required"`
	ShipperId           string `json:"shipper_id"`
	ShipperName         string `json:"shipper_name"`
	DeliveryInstruction string `json:"delivery_instruction"`
}

type UpdateOrderStatusMReq struct {
	OrderId             string `json:"order_id" bson:"order_id"`
	Status              string `json:"status" bson:"status"`
	ShipperId           string `json:"shipper_id" bson:"shipper_id"`
	ShipperName         string `json:"shipper_name" bson:"shipper_name"`
	DeliveryInstruction string `json:"delivery_instruction" bson:"delivery_instruction"`
}

func (req *UpdateOrderStatusReq) Mapping() (*UpdateOrderStatusMReq, error) {
	model := &UpdateOrderStatusMReq{
		OrderId:             req.OrderId,
		DeliveryInstruction: req.DeliveryInstruction,
		ShipperId:           req.ShipperId,
		ShipperName:         req.ShipperName,
	}
	status := statics.StatusMapping[req.StatusCode]
	if status != req.Status {
		return nil, fmt.Errorf("status_code %s does not match status %s", req.StatusCode, req.Status)
	}
	model.Status = status

	return model, nil
}
