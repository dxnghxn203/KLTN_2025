# ...existing code...

## Elasticsearch

Elasticsearch được cấu hình nhẹ, sử dụng dưới 100MB bộ nhớ.

### Build và khởi động

```bash
# Build Docker image
docker-compose build elasticsearch

# Khởi động service
docker-compose up -d elasticsearch
```

### Thông tin kết nối

- URL: http://localhost:9200

### Kiểm tra trạng thái

```bash
# Kiểm tra sức khỏe cluster
curl -X GET http://localhost:9200/_cluster/health

# Liệt kê tất cả indices
curl -X GET http://localhost:9200/_cat/indices

# Kiểm tra thông tin nút
curl -X GET http://localhost:9200
```

### Ví dụ cơ bản

**Tạo index:**
```bash
curl -X PUT "localhost:9200/tracking" -H 'Content-Type: application/json' -d'
{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 0
  }
}
'
```

**Thêm dữ liệu:**
```bash
curl -X POST "localhost:9200/tracking/_doc" -H 'Content-Type: application/json' -d'
{
  "timestamp": "2023-03-21T12:00:00",
  "device_id": "device-001",
  "location": {
    "lat": 10.762622, 
    "lon": 106.660172
  }
}
'
```

**Tìm kiếm dữ liệu:**
```bash
curl -X GET "localhost:9200/tracking/_search" -H 'Content-Type: application/json' -d'
{
  "query": {
    "match_all": {}
  }
}
'
```

### Giám sát bộ nhớ

```bash
# Xem thông tin bộ nhớ
docker stats tracking-elasticsearch
```