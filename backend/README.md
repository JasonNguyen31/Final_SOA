Cấu trúc các thư mục service:

[name]_service/
│
├── app/
│   ├── main.py
│   ├── core/
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── limiter.py
│   │   ├── otp_limiter.py
│   │   ├── response.py
│   │   └── token_blacklist.py
│   │
│   ├── middlewares/
│   │   └── jwt_middleware.py
│   │
│   ├── routes/
│   │   └── [name]_routes.py
│   │
│   ├── controllers/
│   │   └── [name]_controller.py
│   │
│   ├── services/
│   │   ├── [name]_service.py
│   │   └── __init__.py (tùy chọn)
│   │
│   ├── schemas/
│   │   └── [name]_dto.py
│   │
│   ├── utils/
│   │   └── email_sender.py
│   │
│   └── security.py
│
├── .env
├── requirements.txt
└── Dockerfile

Thay [name] bằng tên của service đó.
Các service yêu cầu:
- admin_service
- auth_service
- book_service
- collection_service
- comment_service
- movie_service
- notification_service
- payment_service
- user_service
- wallet_service

Vai trò các file:

1. app/main.py:
    Entry point của service.
    Khởi tạo ứng dụng FastAPI và gắn middleware, router, limiter ở đây.
2. core/
    Chứa lõi hệ thống, bao gồm:
    + config.py: quản lý biến môi trường (.env) qua pydantic.BaseSettings
    + database.py: kết nối đến MongoDB
    + limiter.py: cấu hình Rate Limiting để tránh spam
    + otp_limiter.py: giới hạn riêng cho OTP endpoints, chỉ dùng nếu service này cần OTP
    + response.py: chuẩn hóa cấu trúc response trả về từ các API.
    + token_blacklist.py: lưu trữ hoặc kiểm tra danh sách JWT bị thu hồi.
3. middlewares:
    + jwt_middleware.py: kiểm tra JWT trong mỗi request, ngăn truy cập API khi chưa login hoặc token sai/hết hạn.
4. routes/
    + [name]_routes.py: định nghĩa các endpoint API, import từ controllers, chỉ xử lý logic routing, không chứa nghiệp vụ.
5. controllers/
    + [name]_controller.py: lớp trung gian giữa route và service, xử lý logic nghiệp vụ tổng hợp, gọi service tương ứng.
6. services/
    + [name]_service.py: xử lý nghiệp vụ cốt lõi (business logic), đây là nơi trực tiếp giao tiếp với DB.
    + __init__.py: tùy chọn, cho phép import theo module.
7. schemas/
    + [name]_dto.py: khai báo các model dữ liệu (Data Transfer Object), dùng pydantic.BaseModel để validate input/output.
8. utils/
    + email_sender.py: tiện ích gửi email xác thực, OTP, khôi phục mật khẩu.
    + security.py: chứa các hàm bảo mật như hash mật khẩu, sinh và giải mã JWT, sinh OTP, ..... Được dùng trong service và middleware.
9. .env:
    Lưu biến môi trường dùng trong config.py
10. requirements.txt:
    Danh sách các thư viện cần cài khi build docker
11. Dockerfile:
    Cấu hình image Docker cho service này, nó đóng gói service thành container độc lập.

Trong backend có 1 file docker-compose.yml duy nhất làm tệp cấu hình điều phối cho các container Docker trong hệ thống này.
Nó giúp chạy, dừng, build, liên kết và cấu hình mạng giữa các service chỉ bằng một lệnh duy nhất.
