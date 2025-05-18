package models

import (
	"consumer/pkg/database"
	"context"
	"encoding/json"
	"fmt"
	"log/slog"
	"os"
	"strconv"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GetCurrentTime() time.Time {
	offsetStr := os.Getenv("TIMEZONE_OFFSET_HOURS")
	offset := 0
	if offsetStr != "" {
		if val, err := strconv.Atoi(offsetStr); err == nil {
			offset = val
		}
	}
	return time.Now().Add(time.Duration(offset) * time.Hour)
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
	ShipperId            string              `json:"shipper_id" bson:"shipper_id"`
	ShipperName          string              `json:"shipper_name" bson:"shipper_name"`
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
	DeliveryTime         time.Time           `json:"delivery_time" bson:"delivery_time"`
	DeliveryInstruction  string              `json:"delivery_instruction" bson:"delivery_instruction"`
	PaymentType          string              `json:"payment_type" bson:"payment_type"`
	PaymentStatus        string              `json:"payment_status" bson:"payment_status"`
	Weight               float64             `json:"weight" bson:"weight"`
	ShippingFee          float64             `json:"shipping_fee" bson:"shipping_fee"`
	ProductFee           float64             `json:"product_fee" bson:"product_fee"`
	TotalFee             float64             `json:"total_fee" bson:"total_fee"`
}

type ProductInfo struct {
	ProductId     string    `json:"product_id" bson:"product_id"`
	PriceId       string    `json:"price_id" bson:"price_id"`
	ProductName   string    `json:"product_name" bson:"product_name"`
	Unit          string    `json:"unit" bson:"unit"`
	Quantity      int       `json:"quantity" bson:"quantity"`
	Price         float64   `json:"price" bson:"price"`
	Weight        float64   `json:"weight" bson:"weight"`
	OriginalPrice float64   `json:"original_price" bson:"original_price"`
	Discount      float64   `json:"discount" bson:"discount"`
	ImagesPrimary string    `json:"images_primary" bson:"images_primary"`
	ExpiredDate   time.Time `json:"expired_date" bson:"expired_date"`
}

type ProductRes struct {
	ProductId string `json:"product_id" bson:"product_id"`
	PriceId   string `json:"price_id" bson:"price_id"`
	Inventory int    `json:"inventory" bson:"inventory"`
	Sell      int    `json:"sell" bson:"sell"`
	Delivery  int    `json:"delivery" bson:"delivery"`
}

type OrderRes struct {
	Id                   primitive.ObjectID  `json:"_id" bson:"_id"`
	OrderId              string              `json:"order_id" bson:"order_id"`
	TrackingId           string              `json:"tracking_id" bson:"tracking_id"`
	Status               string              `json:"status" bson:"status"`
	ShipperId            string              `json:"shipper_id" bson:"shipper_id"`
	ShipperName          string              `json:"shipper_name" bson:"shipper_name"`
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
	DeliveryTime         time.Time           `json:"delivery_time" bson:"delivery_time"`
	DeliveryInstruction  string              `json:"delivery_instruction" bson:"delivery_instruction"`
	PaymentType          string              `json:"payment_type" bson:"payment_type"`
	PaymentStatus        string              `json:"payment_status" bson:"payment_status"`
	Weight               float64             `json:"weight" bson:"weight"`
	ShippingFee          float64             `json:"shipping_fee" bson:"shipping_fee"`
	ProductFee           float64             `json:"product_fee" bson:"product_fee"`
	TotalFee             float64             `json:"total_fee" bson:"total_fee"`
}

type OrderToUpdate struct {
	OrderId             string `json:"order_id" bson:"order_id"`
	Status              string `json:"status" bson:"status"`
	ShipperId           string `json:"shipper_id" bson:"shipper_id"`
	ShipperName         string `json:"shipper_name" bson:"shipper_name"`
	PaymentStatus       string `json:"payment_status" bson:"payment_status"`
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
	if o.PaymentType == "COD" {
		o.PaymentStatus = "UNPAID"
	} else {
		o.PaymentStatus = "PAID"
	}

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

func getProductInventory(productId string, priceId string, ctx context.Context) (ProductRes, error) {
	db := database.GetDatabase()
	collection := db.Collection("products_inventory")

	result := collection.FindOne(ctx, bson.M{"product_id": productId, "price_id": priceId})
	if result.Err() != nil {
		slog.Error("Không tìm thấy kho sản phẩm", "product_id", productId, "price_id", priceId, "err", result.Err())
		return ProductRes{}, result.Err()
	}

	var product ProductRes
	if err := result.Decode(&product); err != nil {
		slog.Error("Lỗi giải mã khi tìm thấy kho sản phẩm", "product_id", productId, "price_id", priceId, "err", err)
		return ProductRes{}, err
	}
	slog.Info("Tìm thấy kho sản phẩm", "product_id", productId, "price_id", priceId, "result", product)
	return product, nil
}

func CheckInventoryAndUpdateOrder(ctx context.Context, order *Orders) error {
	var insufficientProducts []string
	var expiredProducts []string

	for i := range order.Product {
		p := &order.Product[i]
		result, err := getProductInventory(p.ProductId, p.PriceId, ctx)
		if err != nil {
			slog.Error("Lỗi khi lấy thông tin kho sản phẩm", "product_id", p.ProductId, "price_id", p.PriceId, "err", err)
			continue
		}

		if result.Inventory-result.Sell < p.Quantity {
			insufficientProducts = append(insufficientProducts, p.ProductName)
			continue
		}

		if !p.ExpiredDate.IsZero() && p.ExpiredDate.Before(GetCurrentTime()) {
			expiredProducts = append(expiredProducts, p.ProductName)
			p.Discount = 0
			p.Price = p.OriginalPrice
		}
	}
	if len(insufficientProducts) > 0 || len(expiredProducts) > 0 {
		order.Status = "canceled"

		var reasons []string
		if len(insufficientProducts) > 0 {
			reasons = append(reasons, fmt.Sprintf("không đủ hàng: %s", stringJoin(insufficientProducts, ", ")))
		}
		if len(expiredProducts) > 0 {
			reasons = append(reasons, fmt.Sprintf("hết hạn giảm giá: %s", stringJoin(expiredProducts, ", ")))
		}

		message := "Đơn hàng bị hủy do " + stringJoin(reasons, "; ")
		order.DeliveryInstruction = message

		slog.Info("Đơn hàng bị hủy", "order_id", order.OrderId, "lý do", message)
		return fmt.Errorf("%s", message)
	}

	return nil
}

func stringJoin(items []string, sep string) string {
	if len(items) == 0 {
		return ""
	}
	result := items[0]
	for i := 1; i < len(items); i++ {
		result += sep + items[i]
	}
	return result
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

func UpdateProductCount(ctx context.Context, products []ProductInfo, field string, modifier int) error {
	db := database.GetDatabase()
	productCol := db.Collection("products")
	inventoryCol := db.Collection("products_inventory")

	for _, p := range products {
		quantityChange := p.Quantity * modifier

		// Cập nhật trong collection "products"
		filter := bson.M{
			"product_id": p.ProductId,
			"prices": bson.M{
				"$elemMatch": bson.M{
					"price_id": p.PriceId,
				},
			},
		}
		update := bson.M{
			"$inc": bson.M{
				fmt.Sprintf("prices.$.%s", field): quantityChange,
			},
		}

		if _, err := productCol.UpdateOne(ctx, filter, update); err != nil {
			slog.Error("Không thể cập nhật sản phẩm", "field", field, "product_id", p.ProductId, "err", err)
			return fmt.Errorf("lỗi cập nhật %s cho sản phẩm %s: %w", field, p.ProductId, err)
		}

		// Cập nhật trong inventory
		inventoryFilter := bson.M{
			"product_id": p.ProductId,
			"price_id":   p.PriceId,
		}
		inventoryUpdate := bson.M{
			"$inc": bson.M{
				field: quantityChange,
			},
		}

		if _, err := inventoryCol.UpdateOne(ctx, inventoryFilter, inventoryUpdate); err != nil {
			slog.Error("Không thể cập nhật inventory", "field", field, "product_id", p.ProductId, "err", err)
			return fmt.Errorf("lỗi cập nhật %s trong inventory cho sản phẩm %s: %w", field, p.ProductId, err)
		}

		slog.Info("Cập nhật thành công", "product_id", p.ProductId, "field", field, "quantity", quantityChange)
	}

	return nil
}

func (order *Orders) DeleteOrderRedis(ctx context.Context) error {
	err := database.DeleteOrder(ctx, order.OrderId)
	if err != nil {
		slog.Error("Không thể xóa order trong Redis", "order_id", order.OrderId, "err", err)
		return err
	}
	slog.Info("Order deleted successfully from Redis", "order_id", order.OrderId)
	return nil
}

func (o *OrderToUpdate) Update(ctx context.Context) (bool, string, error) {
	js, err := json.Marshal(o)
	if err != nil {
		slog.Error("Cannot parse to object", "body", string(js), "err", err.Error())
		return false, "", err
	}

	db := database.GetDatabase()
	collection := db.Collection("orders")

	filter := bson.M{"order_id": o.OrderId}
	update := bson.M{"$set": o}

	result := collection.FindOneAndUpdate(ctx, filter, update)
	if result.Err() != nil {
		slog.Error("Update failed", "order_id", o.OrderId, "order", o, "err", result.Err())
		return false, "", result.Err()
	}

	var order OrderRes
	if err := result.Decode(&order); err != nil {
		slog.Error("Failed to decode updated order", "order_id", o.OrderId, "order", o, "err", err)
		return false, "", err
	}

	slog.Info("Update successful", "order_id", o.OrderId, "order", o, "singleResult", order)
	return true, order.Id.Hex(), nil
}

func RemoveItemCartByOrder(ctx context.Context, orders Orders) bool {
	db := database.GetDatabase()
	collection := db.Collection("users")
	var userInfo bson.M

	userID, err := primitive.ObjectIDFromHex(orders.CreatedBy)
	if err == nil {
		err = collection.FindOne(ctx, bson.M{"_id": userID}).Decode(&userInfo)
	}

	if err == nil && userInfo != nil {
		userIDStr := userID.Hex()
		for _, product := range orders.Product {
			err := RemoveProductFromCart(ctx, userIDStr, product.ProductId, product.PriceId)
			if err != nil {
				slog.Error("Failed to remove product from cart in MongoDB", "error", err)
				return false
			}
		}
		return true
	} else {
		for _, product := range orders.Product {
			database.RemoveCartItem(orders.CreatedBy, fmt.Sprintf("%s_%s", product.ProductId, product.PriceId))
		}
		return true
	}
}

func RemoveProductFromCart(ctx context.Context, userID string, productID string, priceID string) error {
	db := database.GetDatabase()
	collection := db.Collection("cart")

	var cartData bson.M
	err := collection.FindOne(ctx, bson.M{"user_id": userID}).Decode(&cartData)
	if err != nil {
		return fmt.Errorf("cart not found: %w", err)
	}

	products, ok := cartData["products"].(primitive.A)
	if !ok {
		return fmt.Errorf("invalid products format")
	}

	var newProducts []bson.M
	for _, p := range products {
		item, ok := p.(bson.M)
		if !ok {
			continue
		}
		if item["product_id"] == productID && item["price_id"] == priceID {
			continue
		}
		newProducts = append(newProducts, item)
	}

	_, err = collection.UpdateOne(ctx, bson.M{"user_id": userID}, bson.M{"$set": bson.M{"products": newProducts}})
	if err != nil {
		return fmt.Errorf("failed to update cart: %w", err)
	}

	return nil
}
