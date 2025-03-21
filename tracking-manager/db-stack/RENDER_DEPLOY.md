# Hướng dẫn triển khai RabbitMQ trên Render

## Các bước triển khai

1. **Đăng ký tài khoản Render**
   - Đăng ký tại [render.com](https://render.com)
   - Kết nối với GitHub nếu dự án của bạn được lưu trữ ở đó

2. **Tạo dịch vụ mới**
   - Từ Dashboard, chọn "New" -> "Web Service"
   - Kết nối với repository của bạn
   - Chọn thư mục `tracking-manager/db-stack`

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

5. **Thiết lập tài nguyên**
   - Choose **Starter** plan (hoặc cao hơn nếu cần)
   - Bật **Disk** và cấu hình như sau:
     - **Path**: /var/lib/rabbitmq
     - **Size**: 1 GB

6. **Khởi tạo dịch vụ**
   - Nhấp "Create Web Service"
   - Render sẽ xây dựng và triển khai dịch vụ của bạn

## Kết nối với RabbitMQ

Sau khi triển khai thành công, Render sẽ cung cấp cho bạn một URL để kết nối:

