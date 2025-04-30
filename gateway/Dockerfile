FROM kong:3.7.1

# 2. Sao chép file cấu hình Kong khai báo
COPY kong.yml /etc/kong/kong.yml

# 3. Sao chép file cấu hình Nginx tùy chỉnh cho logging
COPY nginx_custom.conf /etc/kong/nginx_custom.conf

# 4. (Không cần thiết) Biến môi trường sẽ được đặt trong render.yaml / docker-compose.yml

# 5. Expose cổng proxy mặc định của Kong
EXPOSE 8000

# 6. (Không cần thiết) User và Healthcheck - image cơ sở đã xử lý