FROM rabbitmq:3.9-alpine

# Thông tin dự án
LABEL maintainer="KLTN 2025" \
      description="RabbitMQ nhẹ dành cho tracking-manager" \
      version="1.0"

# Thiết lập môi trường và giới hạn bộ nhớ
ENV RABBITMQ_DEFAULT_USER=${RABBITMQ_DEFAULT_USER:-admin} \
    RABBITMQ_DEFAULT_PASS=${RABBITMQ_DEFAULT_PASS:-kltn_2025} \
    RABBITMQ_CONFIG_FILE=/etc/rabbitmq/rabbitmq

# Tạo cấu hình tối ưu trực tiếp
RUN echo '# Giới hạn bộ nhớ tuyệt đối - tối đa 150MB để giữ dưới mức 512MB của Render\n\
vm_memory_high_watermark.absolute = 150MB\n\
\n\
# Thiết lập paging khi bộ nhớ cao để giải phóng RAM\n\
vm_memory_high_watermark_paging_ratio = 0.5\n\
\n\
# Giảm kết nối và kênh để tiết kiệm tài nguyên\n\
connection_max = 100\n\
channel_max = 100\n\
\n\
# Vô hiệu hóa cơ chế log nặng\n\
log.file.level = warning\n\
log.console = false\n\
\n\
# Vô hiệu hóa các thống kê không cần thiết\n\
collect_statistics = none\n\
collect_statistics_interval = 120000\n\
\n\
# Tối ưu hóa hiệu suất disk\n\
disk_free_limit.absolute = 100MB\n\
queue_index_embed_msgs_below = 1000\n\
\n\
# Tối ưu hóa thông lượng I/O\n\
io_thread_pool_size = 2' > /etc/rabbitmq/rabbitmq.conf

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
