package models

import (
	"consumer/pkg/database"
	"context"
	"encoding/json"
	"fmt"
	"log/slog"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GetCurrentTime() time.Time {
	return time.Now()
}

type TimeRange struct {
	Session   string    `json:"session" bson:"session"`
	StartTime time.Time `json:"start_time" bson:"start_time"`
	EndTime   time.Time `json:"end_time" bson:"end_time"`
}

type addressOrderReq struct {
	Address  string `json:"address" bson:"address"`
	Ward     string `json:"ward" bson:"ward"`
	District string `json:"district" bson:"district"`
	Province string `json:"province" bson:"province"`
}

type infoAddressOrderReq struct {
	Name        string          `json:"name" bson:"name"`
	PhoneNumber string          `json:"phone_number" bson:"phone_number"`
	Email       string          `json:"email" bson:"email"`
	Address     addressOrderReq `json:"address" bson:"address"`
}

type Orders struct {
	// Id            primitive.ObjectID  `json:"_id" bson:"_id"`
	OrderId              string              `json:"order_id" bson:"order_id"`
	TrackingId           string              `json:"tracking_id" bson:"tracking_id"`
	Status               string              `json:"status" bson:"status"`
	Product              []ProductInfo       `json:"product" bson:"product"`
	PickFrom             infoAddressOrderReq `json:"pick_from" bson:"pick_from"`
	PickTo               infoAddressOrderReq `json:"pick_to" bson:"pick_to"`
	SenderProvinceCode   int                 `json:"sender_province_code" bson:"sender_province_code"`
	SenderDistrictCode   int                 `json:"sender_district_code" bson:"sender_district_code"`
	SenderCommuneCode    int                 `json:"sender_commune_code" bson:"sender_commune_code"`
	ReceiverProvinceCode int                 `json:"receiver_province_code" bson:"receiver_province_code"`
	ReceiverDistrictCode int                 `json:"receiver_district_code" bson:"receiver_district_code"`
	ReceiverCommuneCode  int                 `json:"receiver_commune_code" bson:"receiver_commune_code"`
	CreatedDate          time.Time           `json:"created_date" bson:"created_date"`
	UpdatedDate          time.Time           `json:"updated_date" bson:"updated_date"`
	CreatedBy            string              `json:"created_by" bson:"created_by"`
	DeliveryInstruction  string              `json:"delivery_instruction" bson:"delivery_instruction"`
	PaymentType          string              `json:"payment_type" bson:"payment_type"`
}

type ProductInfo struct {
	ProductId   string  `json:"product_id" bson:"product_id"`
	PriceId     string  `json:"price_id" bson:"price_id"`
	ProductName string  `json:"product_name" bson:"product_name"`
	Unit        string  `json:"unit" bson:"unit"`
	Quantity    int     `json:"quantity" bson:"quantity"`
	Price       float64 `json:"price" bson:"price"`
}

type OrderRes struct {
	Id                   primitive.ObjectID  `json:"_id" bson:"_id"`
	OrderId              string              `json:"order_id" bson:"order_id"`
	TrackingId           string              `json:"tracking_id" bson:"tracking_id"`
	Status               string              `json:"status" bson:"status"`
	Product              []ProductInfo       `json:"product" bson:"product"`
	PickFrom             infoAddressOrderReq `json:"pick_from" bson:"pick_from"`
	PickTo               infoAddressOrderReq `json:"pick_to" bson:"pick_to"`
	SenderProvinceCode   int                 `json:"sender_province_code" bson:"sender_province_code"`
	SenderDistrictCode   int                 `json:"sender_district_code" bson:"sender_district_code"`
	SenderCommuneCode    int                 `json:"sender_commune_code" bson:"sender_commune_code"`
	ReceiverProvinceCode int                 `json:"receiver_province_code" bson:"receiver_province_code"`
	ReceiverDistrictCode int                 `json:"receiver_district_code" bson:"receiver_district_code"`
	ReceiverCommuneCode  int                 `json:"receiver_commune_code" bson:"receiver_commune_code"`
	CreatedDate          time.Time           `json:"created_date" bson:"created_date"`
	UpdatedDate          time.Time           `json:"updated_date" bson:"updated_date"`
	CreatedBy            string              `json:"created_by" bson:"created_by"`
	DeliveryInstruction  string              `json:"delivery_instruction" bson:"delivery_instruction"`
}

type OrderToUpdate struct {
	OrderId             string `json:"order_id" bson:"order_id"`
	Status              string `json:"status" bson:"status"`
	DeliveryInstruction string `json:"delivery_instruction" bson:"delivery_instruction"`
}

func (o *Orders) Create(ctx context.Context) (bool, string, error) {
	js, err := json.Marshal(o)
	if err != nil {
		slog.Error("Cannot parse to object", "body", string(js), "err", err.Error())
		return false, "", err
	}

	db := database.GetDatabase()
	collection := db.Collection("orders")
	o.CreatedDate = GetCurrentTime()
	o.UpdatedDate = o.CreatedDate

	res, err := collection.InsertOne(ctx, o)
	_id := ""
	if oid, ok := res.InsertedID.(primitive.ObjectID); ok {
		_id = oid.Hex()
	}

	slog.Info("insert order has successfully", "order_id", o.OrderId, "order", o, "id", _id, "res", string(js))
	if err != nil {
		slog.Error("Insert status failed", "order_id", o.OrderId, "order", o, "err", err)
	}
	return false, _id, nil
}

func GetOrderById(ctx context.Context, id string) (*OrderRes, error) {
	db := database.GetDatabase()
	collection := db.Collection("orders")

	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		slog.Error("Cannot convert object id ", "id", id, "err", err)
		return nil, err
	}

	result := collection.FindOne(ctx, bson.M{"_id": oid})
	slog.Info("Findone order ", "res", result)
	if result.Err() != nil {
		slog.Error("Cannot get order by id ", "id", id, "err", result.Err())
		return nil, result.Err()
	}

	res := OrderRes{}
	if err := result.Decode(&res); err != nil {
		slog.Error("Cannot decode data ", "err", err)
		return nil, err
	}

	return &res, nil
}

func GetOrderByOrderId(ctx context.Context, order_id string) (*OrderRes, error) {
	db := database.GetDatabase()
	collection := db.Collection("orders")

	result := collection.FindOne(ctx, bson.M{"order_id": order_id})
	slog.Info("Findone order ", "res", result)
	if result.Err() != nil {
		slog.Error("Cannot get order by order_id ", "order_id", order_id, "err", result.Err())
		return nil, result.Err()
	}

	res := OrderRes{}
	if err := result.Decode(&res); err != nil {
		slog.Error("Cannot decode data ", "err", err)
		return nil, err
	}

	return &res, nil
}

func (order *OrderRes) DeleteOrderRedis(ctx context.Context) (bool, error) {
	err := database.DeleteOrder(ctx, order.OrderId)
	if err != nil {
		slog.Error("Không thể xóa order trong Redis", "order_id", order.OrderId, "err", err)
		return true, err
	}

	for _, product := range order.Product {
		productId := fmt.Sprintf("%s_%s", product.ProductId, product.PriceId)
		err := database.IncreaseProductSales(ctx, productId, product.Quantity)
		if err != nil {
			slog.Error("Lỗi khi tăng số lượng bán của sản phẩm", "product", productId, "err", err)
		}
	}

	slog.Info("Order deleted successfully from Redis", "order_id", order.OrderId)
	return true, nil
}

func (o *OrderToUpdate) Update(ctx context.Context, id string) (bool, string, error) {
	js, err := json.Marshal(o)
	if err != nil {
		slog.Error("Cannot parse to object", "body", string(js), "err", err.Error())
		return false, "", err
	}

	db := database.GetDatabase()
	collection := db.Collection("orders")

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		slog.Error("Invalid document ID format", "documentID", id, "err", err.Error())
		return false, "", fmt.Errorf("invalid document ID format: %w", err)
	}

	filter := bson.M{"_id": objID}
	update := bson.M{"$set": o}

	result := collection.FindOneAndUpdate(ctx, filter, update)
	if result.Err() != nil {
		slog.Error("Update failed", "documentID", id, "order", o, "err", result.Err())
		return false, "", result.Err()
	}

	var order OrderRes
	if err := result.Decode(&order); err != nil {
		slog.Error("Failed to decode updated order", "documentID", id, "order", o, "err", err)
		return false, "", err
	}

	slog.Info("Update successful", "documentID", id, "order", o, "singleResult", order)
	return true, order.Id.Hex(), nil
}
