# RabbitMQ Ví dụ

Thư mục này chứa các ví dụ về cách sử dụng RabbitMQ.

## Node.js

### Cài đặt thư viện

```bash
npm install amqplib
```

### Sử dụng

```javascript
const { publishMessage, consumeMessages } = require('./nodejs/rabbitmq-client');

// Gửi message
publishMessage({
  type: 'tracking',
  data: {
    deviceId: 'device-001',
    timestamp: new Date().toISOString(),
    location: {
      lat: 10.762622,
      lng: 106.660172
    }
  }
});

// Nhận message
consumeMessages(message => {
  console.log('Đã nhận:', message);
});
```

## Python

### Cài đặt thư viện

```bash
pip install pika
```

### Sử dụng

```python
# Xem ví dụ trong thư mục python/
```

## Mô hình Pub/Sub

RabbitMQ hỗ trợ nhiều mô hình, bao gồm:

1. **Simple queue**: Gửi và nhận trực tiếp qua queue
2. **Work queues**: Phân phối tác vụ giữa nhiều worker
3. **Publish/Subscribe**: Phát hành message đến nhiều subscriber
4. **Routing**: Phát hành có chọn lọc theo routing key
5. **Topics**: Phát hành theo pattern matching
6. **RPC**: Remote procedure call

Xem các ví dụ tương ứng trong thư mục này.
