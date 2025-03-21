FROM rabbitmq:3.9-alpine

# Thông tin dự án
LABEL maintainer="KLTN 2025" \
      description="RabbitMQ nhẹ dành cho tracking-manager" \
      version="1.0"

# Thiết lập môi trường và giới hạn bộ nhớ
ENV RABBITMQ_DEFAULT_USER=${RABBITMQ_DEFAULT_USER:-admin} \
    RABBITMQ_DEFAULT_PASS=${RABBITMQ_DEFAULT_PASS:-kltn_2025} \
    RABBITMQ_CONFIG_FILE=/etc/rabbitmq/rabbitmq

# Sao chép cấu hình tối ưu
COPY rabbitmq.conf /etc/rabbitmq/rabbitmq.conf

# Tối ưu thư mục dữ liệu
RUN mkdir -p /var/lib/rabbitmq /var/log/rabbitmq && \
    chown -R rabbitmq:rabbitmq /var/lib/rabbitmq /var/log/rabbitmq && \
    chmod 755 /var/lib/rabbitmq /var/log/rabbitmq

# Mở cổng chính - Render sẽ tự động định tuyến cổng
EXPOSE 5672 15672

# Thiết lập healthcheck nhẹ
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD rabbitmqctl ping || exit 1

# Sử dụng người dùng rabbitmq
USER rabbitmq

# Thư mục làm việc
WORKDIR /var/lib/rabbitmq

# Lệnh khởi động tối ưu
CMD ["rabbitmq-server"]
