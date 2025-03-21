# Hướng dẫn triển khai RabbitMQ trên Render (512MB RAM)

## Các bước triển khai

1. **Đăng ký tài khoản Render**
   - Đăng ký tại [render.com](https://render.com)
   - Kết nối với GitHub nếu dự án của bạn được lưu trữ ở đó

2. **Tạo dịch vụ mới**
   - Từ Dashboard, chọn "New" -> "Web Service"
   - Kết nối với repository của bạn
   - Chọn thư mục gốc của dự án

3. **Cấu hình dịch vụ**
   - **Name**: tracking-rabbitmq
   - **Environment**: Docker
   - **Branch**: main (hoặc branch của bạn)
   - **Root Directory**: ./tracking-manager/db-stack
   - **Dockerfile Path**: ./rabbitmq/Dockerfile
   - **Build Command**: không cần điền
   - **Start Command**: không cần điền

4. **Thiết lập môi trường**
   - Thêm biến môi trường:
     - `RABBITMQ_DEFAULT_USER`: admin
     - `RABBITMQ_DEFAULT_PASS`: [mật khẩu bảo mật]
     - `RABBITMQ_SERVER_ADDITIONAL_ERL_ARGS`: "+MMscs 400 +MMhcs 400"

5. **Thiết lập tài nguyên**
   - Mặc định Render Starter có 512MB RAM
   - Bật **Disk** và cấu hình:
     - **Path**: /var/lib/rabbitmq
     - **Size**: 1 GB

6. **Khởi tạo dịch vụ**
   - Nhấp "Create Web Service"
   - Render sẽ xây dựng và triển khai dịch vụ của bạn

## Giám sát sử dụng bộ nhớ

RabbitMQ sẽ sử dụng tối đa 150MB RAM (theo cấu hình), nhưng có thể tăng tạm thời trong quá trình xử lý. Render Starter cung cấp 512MB là đủ cho:
- RabbitMQ core (khoảng 150-200MB)
- Hệ điều hành và container overhead (khoảng 100MB)
- Buffer cho hoạt động nhận/gửi message (khoảng 150-200MB)

## Xử lý sự cố Out-of-Memory

Nếu gặp lỗi OOM (Out of Memory) trên Render:

1. Kiểm tra logs trên dashboard Render
2. Nếu bạn thấy thông báo liên quan đến OOM, hãy điều chỉnh:
   - Giảm `vm_memory_high_watermark.absolute` xuống 120MB
   - Giảm `connection_max` và `channel_max` xuống 50
   - Thêm biến môi trường `RABBITMQ_SERVER_ADDITIONAL_ERL_ARGS` với giá trị "+MMscs 300 +MMhcs 300"

## Kết nối với RabbitMQ

Sau khi triển khai thành công, Render sẽ cung cấp cho bạn một URL để kết nối:

