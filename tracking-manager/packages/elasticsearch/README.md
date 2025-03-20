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

## Thông tin truy cập
- Elasticsearch: http://localhost:9200
- Kibana: http://localhost:5601

## Kiểm tra hoạt động của Elasticsearch
```bash
curl -XGET 'http://localhost:9200'
curl -XGET 'http://localhost:9200/_cluster/health?pretty'
```

## Dừng dịch vụ
```bash
docker-compose down
```

## Xóa toàn bộ dữ liệu (volume)
```bash
docker-compose down -v
```

## Lưu ý quan trọng
- Phiên bản Elasticsearch-OSS không hỗ trợ tính năng X-Pack và bảo mật
- Cấu hình này phù hợp cho môi trường phát triển, không nên dùng cho production
- Nếu muốn sử dụng chức năng bảo mật, hãy quay lại phiên bản Elasticsearch đầy đủ
