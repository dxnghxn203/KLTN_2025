# Elasticsearch Configuration

## Khởi động Elasticsearch

```bash
cd /Users/mac/DEVELOPMENT/Presonal/KHOALUAN_2025/tracking-manager/packages/elasticsearch
docker-compose up -d
```

## Thông tin truy cập
- Elasticsearch: http://localhost:9200
- Kibana: http://localhost:5601

## Tài khoản mặc định
- Username: elastic
- Password: changeme (nên thay đổi trong production)

## Kiểm tra trạng thái

```bash
curl -XGET 'http://localhost:9200/_cluster/health?pretty' -u elastic:changeme
```

## Cấu hình bổ sung

Bạn có thể sửa đổi các tham số trong file `elasticsearch.yml` và `docker-compose.yml` để điều chỉnh cấu hình theo nhu cầu.
