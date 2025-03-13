package models

import (
	"context"
	"encoding/json"
	"log/slog"
	"time"
	"tracking-consumer/pkg/database"

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

type Orders struct {
	// Id            primitive.ObjectID  `json:"_id" bson:"_id"`
	OrderId     string        `json:"order_id" bson:"order_id"`
	TrackingId  string        `json:"tracking_id" bson:"tracking_id"`
	Status      string        `json:"status" bson:"status"`
	Product     []ProductInfo `json:"product" bson:"product"`
	CreatedDate time.Time     `json:"created_date" bson:"created_date"`
	UpdatedDate time.Time     `json:"updated_date" bson:"updated_date"`
	CreatedBy   string        `json:"created_by" bson:"created_by"`
}

type ProductInfo struct {
	ProductId string  `json:"product_id" bson:"product_id"`
	Name      string  `json:"name" bson:"name"`
	Quantity  int     `json:"quantity" bson:"quantity"`
	Price     float64 `json:"price" bson:"price"`
}

type OrderRes struct {
	Id          primitive.ObjectID `json:"_id" bson:"_id"`
	OrderId     string             `json:"order_id" bson:"order_id"`
	TrackingId  string             `json:"tracking_id" bson:"tracking_id"`
	Status      string             `json:"status" bson:"status"`
	Product     []ProductInfo      `json:"product" bson:"product"`
	CreatedDate time.Time          `json:"created_date" bson:"created_date"`
	UpdatedDate time.Time          `json:"updated_date" bson:"updated_date"`
	CreatedBy   string             `json:"created_by" bson:"created_by"`
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
	// res.InsertedID
	_id := ""
	if oid, ok := res.InsertedID.(primitive.ObjectID); ok {
		_id = oid.Hex()
	}

	slog.Info("insert order has successfully", "order_code", o.OrderId, "order", o, "id", _id, "res", string(js))
	if err != nil {
		slog.Error("Insert status failed", "order_code", o.OrderId, "order", o, "err", err)
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

func (order *OrderRes) DeleteOrderRedis(ctx context.Context) (bool, error) {

	err := database.DeleteOrder(ctx, order.OrderId)
	if err != nil {
		slog.Error("Không thể xóa order trong Redis", "order_id", order.OrderId, "err", err)
		return true, err
	}

	for _, product := range order.Product {
		err := database.IncreaseProductSales(ctx, product.ProductId, product.Quantity)
		if err != nil {
			slog.Error("Lỗi khi tăng số lượng bán của sản phẩm", "product_id", product.ProductId, "err", err)
		}
	}

	slog.Info("Order deleted successfully from Redis", "order_id", order.OrderId)
	return true, nil
}
