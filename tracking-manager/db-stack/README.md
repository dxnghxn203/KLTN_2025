# Database Stack cho Tracking Manager

## RabbitMQ

RabbitMQ được cấu hình nhẹ, sử dụng dưới 100MB bộ nhớ.

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

### Kiểm tra trạng thái

```bash
docker exec tracking-rabbitmq rabbitmqctl ping
docker exec tracking-rabbitmq rabbitmqctl status
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

### Bật Management UI

RabbitMQ Management là plugin hữu ích để quản lý và giám sát hàng đợi. Để bật nó:

1. Cài đặt plugin:
```bash
docker exec tracking-rabbitmq rabbitmq-plugins enable rabbitmq_management
```

2. Cập nhật docker-compose.yml để mở port 15672:
```yaml
ports:
  - "5672:5672"
  - "15672:15672"
```

3. Khởi động lại container:
```bash
docker-compose restart rabbitmq
```

4. Truy cập Management UI tại: http://localhost:15672
   - Username: admin
   - Password: kltn_2025

### Lưu ý về phiên bản

RabbitMQ 3.9.29 hiện đã hết hạn hỗ trợ theo nhà phát triển. Cân nhắc nâng cấp lên phiên bản mới hơn trong môi trường sản xuất.

### Kiểm tra logs

```bash
docker exec tracking-rabbitmq cat /var/log/rabbitmq/rabbit@$(docker exec tracking-rabbitmq hostname).log
```

### Tắt RabbitMQ

```bash
docker-compose stop rabbitmq
```

## Giám sát sử dụng tài nguyên

```bash
docker stats tracking-rabbitmq
```
