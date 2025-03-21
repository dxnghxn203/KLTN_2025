#!/bin/bash

# Đảm bảo thư mục cấu hình RabbitMQ tồn tại
mkdir -p rabbitmq

# Tạo file cấu hình nếu chưa tồn tại
if [ ! -f rabbitmq/rabbitmq.conf ]; then
  echo "Tạo file cấu hình rabbitmq.conf..."
  cp rabbitmq.conf.example rabbitmq/rabbitmq.conf || echo "File mẫu không tồn tại. Kiểm tra lại cấu hình."
fi

# Kiểm tra quyền trên thư mục cấu hình
echo "Đảm bảo quyền truy cập đúng cho thư mục cấu hình..."
chmod -R 755 rabbitmq
chmod 644 rabbitmq/rabbitmq.conf

# Khởi động RabbitMQ
echo "Khởi động RabbitMQ..."
docker-compose up -d rabbitmq

# Đợi RabbitMQ khởi động
echo "Đợi RabbitMQ khởi động..."
sleep 10

# Kiểm tra trạng thái
echo "Kiểm tra trạng thái..."
docker exec tracking-rabbitmq rabbitmqctl ping 2>/dev/null
if [ $? -eq 0 ]; then
  echo "✅ RabbitMQ đã khởi động thành công"
  echo "URL kết nối: amqp://admin:kltn_2025@localhost:5672"
  
  # Hỏi người dùng có muốn bật Management UI không
  echo "Bạn có muốn bật Management UI không? (y/n)"
  read answer
  if [ "$answer" = "y" ]; then
    echo "Đang bật Management UI..."
    docker exec tracking-rabbitmq rabbitmq-plugins enable rabbitmq_management
    echo "✅ Management UI đã được bật"
    echo "Truy cập tại: http://localhost:15672"
    echo "Username: admin"
    echo "Password: kltn_2025"
  fi
else
  echo "❌ RabbitMQ khởi động không thành công."
  echo "Kiểm tra logs:"
  docker-compose logs --tail=30 rabbitmq
fi
