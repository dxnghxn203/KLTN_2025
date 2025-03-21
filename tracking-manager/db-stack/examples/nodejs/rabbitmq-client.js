/**
 * RabbitMQ client cho Node.js
 * Cài đặt: npm install amqplib
 */
const amqp = require('amqplib');

// Cấu hình kết nối
const config = {
  url: 'amqp://admin:kltn_2025@localhost:5672',
  exchangeName: 'tracking_exchange',
  queueName: 'tracking_queue',
  routingKey: 'tracking'
};

/**
 * Gửi message đến RabbitMQ
 * @param {Object} message - Message cần gửi
 * @returns {Promise<boolean>} - Kết quả gửi
 */
async function publishMessage(message) {
  let connection;
  try {
    // Kết nối đến RabbitMQ
    connection = await amqp.connect(config.url);
    const channel = await connection.createChannel();
    
    // Tạo exchange và queue
    await channel.assertExchange(config.exchangeName, 'direct', { durable: true });
    await channel.assertQueue(config.queueName, { durable: true });
    await channel.bindQueue(config.queueName, config.exchangeName, config.routingKey);
    
    // Gửi message
    const success = channel.publish(
      config.exchangeName,
      config.routingKey,
      Buffer.from(JSON.stringify(message)),
      { persistent: true }
    );
    
    console.log(`✅ Message đã được gửi: ${JSON.stringify(message).substring(0, 100)}...`);
    
    // Đóng kết nối
    await channel.close();
    await connection.close();
    
    return success;
  } catch (error) {
    console.error('❌ Lỗi gửi message:', error.message);
    if (connection) await connection.close();
    return false;
  }
}

/**
 * Nhận message từ RabbitMQ
 * @param {Function} callback - Hàm xử lý message
 * @returns {Promise<Object>} - Kết nối RabbitMQ
 */
async function consumeMessages(callback) {
  try {
    // Kết nối đến RabbitMQ
    const connection = await amqp.connect(config.url);
    const channel = await connection.createChannel();
    
    // Tạo exchange và queue
    await channel.assertExchange(config.exchangeName, 'direct', { durable: true });
    await channel.assertQueue(config.queueName, { durable: true });
    await channel.bindQueue(config.queueName, config.exchangeName, config.routingKey);
    
    // Thiết lập prefetch
    await channel.prefetch(1);
    
    console.log('🎧 Đang chờ messages...');
    
    // Nhận và xử lý message
    await channel.consume(config.queueName, (msg) => {
      if (msg !== null) {
        try {
          const content = JSON.parse(msg.content.toString());
          callback(content);
          channel.ack(msg);
        } catch (error) {
          console.error('❌ Lỗi xử lý message:', error.message);
          channel.nack(msg, false, true);
        }
      }
    });
    
    // Xử lý đóng kết nối
    process.on('SIGINT', async () => {
      console.log('Đóng kết nối RabbitMQ...');
      await channel.close();
      await connection.close();
      process.exit(0);
    });
    
    return { connection, channel };
  } catch (error) {
    console.error('❌ Lỗi kết nối:', error.message);
    throw error;
  }
}

// Export các hàm để sử dụng
module.exports = {
  publishMessage,
  consumeMessages
};

// Chạy ví dụ nếu file được gọi trực tiếp
if (require.main === module) {
  (async () => {
    // Gửi message thử
    await publishMessage({
      type: 'example',
      timestamp: new Date().toISOString(),
      data: { value: 'Test message' }
    });
    
    // Nhận message
    await consumeMessages((message) => {
      console.log('📩 Đã nhận message:', message);
    });
    
    console.log('Nhấn Ctrl+C để thoát');
  })();
}
