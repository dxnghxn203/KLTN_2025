#!/bin/bash

echo "🚀 Khởi động Elasticsearch nhẹ, giới hạn 100MB..."

# Build image
echo "🔨 Build Docker image..."
docker-compose build elasticsearch

# Khởi động container
echo "🔄 Khởi động container..."
docker-compose up -d elasticsearch

# Đợi Elasticsearch khởi động
echo "⏳ Đợi Elasticsearch khởi động..."
sleep 20

# Kiểm tra trạng thái
echo "🔍 Kiểm tra trạng thái..."
if curl -s http://localhost:9200/_cluster/health | grep -q '"status":"green"'; then
  echo "✅ Elasticsearch đã khởi động thành công (status: green)!"
  echo "📊 Sử dụng bộ nhớ:"
  docker stats tracking-elasticsearch --no-stream --format "{{.MemUsage}}"
  echo "🔌 URL: http://localhost:9200"
else
  echo "⚠️ Elasticsearch đã khởi động nhưng có thể không ổn định!"
  curl -s http://localhost:9200/_cluster/health
  echo "📜 Logs:"
  docker-compose logs --tail=20 elasticsearch
fi

# Hiển thị thông tin cấu hình
echo "ℹ️ Thông tin nút Elasticsearch:"
curl -s http://localhost:9200 | jq
