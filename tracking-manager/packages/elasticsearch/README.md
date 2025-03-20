# Elasticsearch Configuration

## Các bước chạy Elasticsearch và Kibana

1. Chuyển đến thư mục chứa cấu hình
```bash
cd /Users/mac/DEVELOPMENT/Presonal/KHOALUAN_2025/tracking-manager/packages/elasticsearch
```

2. Build và khởi động container
```bash
docker-compose build
docker-compose up -d
```

3. Kiểm tra trạng thái dịch vụ
```bash
docker-compose ps
```

4. Xem logs (nếu cần)
```bash
docker-compose logs -f elasticsearch
```

## Xử lý lỗi Out of Memory

Nếu vẫn gặp lỗi out of memory:

1. Chỉ chạy Elasticsearch, tắt Kibana (comment phần kibana trong docker-compose.yml)
2. Tăng swap space trên máy host:
```bash
# Tạo file swap 1GB
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```
3. Giảm thêm bộ nhớ trong ES_JAVA_OPTS nếu cần

## Thông tin truy cập
- Elasticsearch: http://localhost:9200
- Kibana: http://localhost:5601

## Kiểm tra hoạt động của Elasticsearch
```bash
curl -XGET 'http://localhost:9200'
```

## Dừng dịch vụ
```bash
docker-compose down
```

## Lưu ý quan trọng
- Cấu hình hiện tại đã được tối ưu hóa để sử dụng ít bộ nhớ nhất có thể
- Không nên sử dụng cấu hình này cho môi trường production
- Đây là cấu hình tối thiểu chỉ để phát triển và thử nghiệm
