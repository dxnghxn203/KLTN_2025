#!/bin/bash

echo "🚀 Khởi động RabbitMQ nhẹ, giới hạn 100MB..."

# Build image
echo "🔨 Build Docker image..."
docker-compose build rabbitmq

# Khởi động container
echo "🔄 Khởi động container..."
docker-compose up -d rabbitmq

# Đợi RabbitMQ khởi động
echo "⏳ Đợi RabbitMQ khởi động..."
sleep 10

# Kiểm tra trạng thái
echo "🔍 Kiểm tra trạng thái..."
if docker exec tracking-rabbitmq rabbitmqctl ping > /dev/null 2>&1; then
  echo "✅ RabbitMQ đã khởi động thành công!"
  echo "📊 Sử dụng bộ nhớ:"
  docker stats tracking-rabbitmq --no-stream --format "{{.MemUsage}}"
  echo "🔌 URL kết nối: amqp://admin:kltn_2025@localhost:5672"
else
  echo "❌ RabbitMQ khởi động không thành công!"
  echo "📜 Logs:"
  docker-compose logs --tail=20 rabbitmq
fi
