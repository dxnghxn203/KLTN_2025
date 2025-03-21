# Database Stack cho Tracking Manager

## RabbitMQ

RabbitMQ được cấu hình nhẹ, sử dụng dưới 100MB bộ nhớ.

### Cách chạy Dockerfile

#### Cách 1: Sử dụng docker-compose (Khuyến nghị)

```bash
# Di chuyển đến thư mục db-stack
cd /Users/mac/DEVELOPMENT/Presonal/KHOALUAN_2025/tracking-manager/db-stack

# Build image từ Dockerfile
docker-compose build rabbitmq

# Khởi động container
docker-compose up -d rabbitmq

# Kiểm tra trạng thái
docker-compose ps rabbitmq
```

#### Cách 2: Sử dụng Docker trực tiếp

```bash
# Di chuyển đến thư mục chứa Dockerfile
cd /Users/mac/DEVELOPMENT/Presonal/KHOALUAN_2025/tracking-manager/db-stack/rabbitmq

# Build image
docker build -t tracking-rabbitmq:latest .

# Chạy container
docker run -d --name tracking-rabbitmq \
  -p 5672:5672 \
  -v rabbitmq-data:/var/lib/rabbitmq \
  --memory=100m \
  --cpus=0.3 \
  tracking-rabbitmq:latest

# Kiểm tra trạng thái
docker ps | grep tracking-rabbitmq
```

### Kiểm tra RabbitMQ đã chạy thành công

```bash
# Kiểm tra logs
docker logs tracking-rabbitmq

# Kiểm tra kết nối
docker exec tracking-rabbitmq rabbitmqctl ping

# Hiển thị thông tin chi tiết
docker exec tracking-rabbitmq rabbitmqctl status
```

### Dừng và xóa container

```bash
# Nếu sử dụng docker-compose
docker-compose stop rabbitmq
docker-compose rm rabbitmq

# Nếu sử dụng Docker trực tiếp
docker stop tracking-rabbitmq
docker rm tracking-rabbitmq
```

### Trạng thái

✅ **RabbitMQ đã cài đặt và chạy thành công!**

### Khởi động RabbitMQ

```bash
cd /Users/mac/DEVELOPMENT/Presonal/KHOALUAN_2025/tracking-manager/db-stack
./start-rabbitmq.sh
```

Hoặc nếu chỉ muốn chạy không cần script:

```bash
docker-compose up -d rabbitmq
```

### Thông tin kết nối

- Host: localhost
- Port: 5672
- Username: admin
- Password: kltn_2025
- URL: amqp://admin:kltn_2025@localhost:5672

### Kiểm tra plugins đã cài đặt

```bash
docker exec tracking-rabbitmq rabbitmq-plugins list
```

### Bật Management UI (Khuyến nghị)

```bash
# Bật Management UI
docker exec tracking-rabbitmq rabbitmq-plugins enable rabbitmq_management

# Thêm port vào docker-compose.yml
# ports:
#   - "5672:5672"
#   - "15672:15672"

# Khởi động lại container
docker-compose restart rabbitmq

# Truy cập UI tại: http://localhost:15672
# Username: admin
# Password: kltn_2025
```

### Ví dụ sử dụng RabbitMQ từ Node.js

```javascript
// Sử dụng thư viện amqplib
const amqp = require('amqplib');

async function connectRabbitMQ() {
  try {
    // Kết nối đến RabbitMQ
    const connection = await amqp.connect('amqp://admin:kltn_2025@localhost:5672');
    const channel = await connection.createChannel();
    
    // Tạo queue
    const queue = 'tracking_data';
    await channel.assertQueue(queue, { durable: true });
    
    // Gửi message
    const message = { type: 'location', data: { lat: 10.762622, lng: 106.660172 } };
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
    console.log("Đã gửi message:", message);
    
    // Đóng kết nối sau 1 giây
    setTimeout(() => {
      connection.close();
    }, 1000);
  } catch (error) {
    console.error("Lỗi kết nối RabbitMQ:", error);
  }
}

connectRabbitMQ();
```

### Ví dụ nhận message từ Python

```python
import pika
import json

# Thông tin kết nối
credentials = pika.PlainCredentials('admin', 'kltn_2025')
parameters = pika.ConnectionParameters('localhost', 5672, '/', credentials)

# Kết nối đến RabbitMQ
connection = pika.BlockingConnection(parameters)
channel = connection.channel()

# Tạo queue
queue_name = 'tracking_data'
channel.queue_declare(queue=queue_name, durable=True)

# Callback khi nhận message
def callback(ch, method, properties, body):
    message = json.loads(body)
    print(f" [x] Nhận được: {message}")
    # Xác nhận đã xử lý message
    ch.basic_ack(delivery_tag=method.delivery_tag)

# Thiết lập consumer
channel.basic_qos(prefetch_count=1)
channel.basic_consume(queue=queue_name, on_message_callback=callback)

print(' [*] Đang chờ messages. Nhấn CTRL+C để thoát')
channel.start_consuming()
```

### Các lệnh hữu ích cho RabbitMQ

```bash
# Kiểm tra trạng thái
docker exec tracking-rabbitmq rabbitmqctl ping
docker exec tracking-rabbitmq rabbitmqctl status

# Liệt kê queues
docker exec tracking-rabbitmq rabbitmqctl list_queues

# Liệt kê exchanges
docker exec tracking-rabbitmq rabbitmqctl list_exchanges

# Kiểm tra logs
docker exec tracking-rabbitmq cat /var/log/rabbitmq/rabbit@$(docker exec tracking-rabbitmq hostname).log

# Xem thông tin tài nguyên sử dụng
docker stats tracking-rabbitmq
```

### Tắt RabbitMQ

```bash
docker-compose stop rabbitmq
```

## Hiệu năng và phiên bản

- Phiên bản RabbitMQ: 3.9.29
- Erlang: 25.3.2.9 [jit]
- Giới hạn bộ nhớ: 100MB
- Trạng thái hỗ trợ: Hết hạn hỗ trợ (cân nhắc nâng cấp trong môi trường sản xuất)
