package database

import (
	"context"
	"fmt"
	"log/slog"
	"os"
	"strconv"
	"time"

	"github.com/redis/go-redis/v9"
)

var (
	// RedisClient là biến toàn cục để quản lý kết nối Redis
	RedisClient *redis.Client
)

// ConnectRedis khởi tạo kết nối đến Redis
func ConnectRedis() error {
	host := os.Getenv("REDIS_HOST")
	port := os.Getenv("REDIS_PORT")
	password := os.Getenv("REDIS_PASSWORD")

	if port == "" {
		port = "6379"
	}
	addr := fmt.Sprintf("%s:%s", host, port)

	RedisClient = redis.NewClient(&redis.Options{
		Addr:         addr,
		Password:     password,
		DB:           0,
		DialTimeout:  5 * time.Second,
		ReadTimeout:  3 * time.Second,
		WriteTimeout: 3 * time.Second,
		PoolSize:     50,
	})

	// Kiểm tra kết nối
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := RedisClient.Ping(ctx).Result()
	if err != nil {
		return fmt.Errorf("không thể kết nối đến Redis: %v", err)
	}

	slog.Info("Kết nối Redis thành công!")
	return nil
}

// GetRedisClient trả về client Redis để sử dụng
func GetRedisClient() *redis.Client {
	return RedisClient
}

// CloseRedis đóng kết nối đến Redis
func CloseRedis() {
	if RedisClient != nil {
		err := RedisClient.Close()
		if err != nil {
			slog.Error("Lỗi khi đóng kết nối Redis:", "err", err)
		} else {
			slog.Info("Đã đóng kết nối Redis.")
		}
	}
}

func GetOrderKey(orderID string) string {
	return fmt.Sprintf("order:%s", orderID)
}

func DeleteOrder(ctx context.Context, orderID string) error {
	key := GetOrderKey(orderID)
	_, err := RedisClient.Del(ctx, key).Result()
	return err
}

func GetProductKey(productID string) string {
	return fmt.Sprintf("product:%s", productID)
}

func GetProductTransaction(ctx context.Context, productID string) (map[string]int, error) {
	key := GetProductKey(productID)
	data, err := RedisClient.HGetAll(ctx, key).Result()
	if err != nil {
		return nil, err
	}

	result := map[string]int{
		"ton": parseIntWithDefault(data["ton"], 0),
		"ban": parseIntWithDefault(data["ban"], 0),
	}
	return result, nil
}

func parseInt(value string) (int, error) {
	if value == "" {
		return 0, nil
	}
	return strconv.Atoi(value)
}

func parseIntWithDefault(value string, defaultValue int) int {
	result, err := parseInt(value)
	if err != nil {
		return defaultValue
	}
	return result
}

func IncreaseProductSales(ctx context.Context, productID string, quantity int) error {
	productKey := GetProductKey(productID)
	_, err := RedisClient.HIncrBy(ctx, productKey, "ban", int64(quantity)).Result()
	if err != nil {
		slog.Error("Không thể cập nhật số lượng bán của sản phẩm", "product_id", productID, "err", err)
		return err
	}

	slog.Info("Cập nhật số lượng bán thành công", "product_id", productID, "quantity", quantity)
	return nil
}
