FROM docker.elastic.co/elasticsearch/elasticsearch-oss:7.10.2

# Thông tin dự án
LABEL maintainer="KLTN 2025" \
      description="Elasticsearch tracking-manager" \
      version="1.0"

# Sao chép cấu hình tối ưu
COPY elasticsearch.yml /usr/share/elasticsearch/config/elasticsearch.yml

# Thiết lập biến môi trường cho bộ nhớ thấp
ENV ES_JAVA_OPTS="-Xms64m -Xmx64m" \
    bootstrap.memory_lock=false \
    discovery.type=single-node \
    xpack.security.enabled=false \
    xpack.ml.enabled=false \
    xpack.graph.enabled=false \
    xpack.watcher.enabled=false \
    xpack.monitoring.enabled=false

# Cài đặt quyền
USER root
RUN chown -R elasticsearch:elasticsearch /usr/share/elasticsearch/config/
USER elasticsearch

# Thiết lập healthcheck
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD curl -f http://localhost:9200/_cluster/health || exit 1

# Mở cổng
EXPOSE 9200

# Điểm vào container
CMD ["elasticsearch"]
