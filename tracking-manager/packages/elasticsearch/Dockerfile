FROM docker.elastic.co/elasticsearch/elasticsearch:8.12.0

# Sao chép file cấu hình vào container
COPY elasticsearch.yml /usr/share/elasticsearch/config/elasticsearch.yml

# Cài đặt plugins nếu cần
# RUN elasticsearch-plugin install analysis-icu

# Thiết lập quyền
USER root
RUN chown -R elasticsearch:elasticsearch /usr/share/elasticsearch/config/
USER elasticsearch

# Expose các cổng mặc định
EXPOSE 9200 9300
