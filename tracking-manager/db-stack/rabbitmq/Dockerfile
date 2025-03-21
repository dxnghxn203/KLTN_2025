FROM rabbitmq:3.9-alpine

# Thông tin dự án
LABEL maintainer="KLTN 2025" \
    description="RabbitMQ tracking-manager" \
    version="1.0"

# Thiết lập môi trường
ENV RABBITMQ_DEFAULT_USER=admin \
    RABBITMQ_DEFAULT_PASS=kltn_2025 \
    RABBITMQ_CONFIG_FILE=/etc/rabbitmq/rabbitmq

# Sao chép cấu hình
COPY rabbitmq.conf /etc/rabbitmq/rabbitmq.conf

# Thư mục dữ liệu và logs
RUN mkdir -p /var/lib/rabbitmq /var/log/rabbitmq && \
    chown -R rabbitmq:rabbitmq /var/lib/rabbitmq /var/log/rabbitmq

# Mở cổng chính
EXPOSE 5672

# Thiết lập healthcheck nhẹ
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD rabbitmqctl ping || exit 1

# Sử dụng người dùng rabbitmq
USER rabbitmq

# Thư mục làm việc
WORKDIR /var/lib/rabbitmq

# Lệnh khởi động
CMD ["rabbitmq-server"]
