# 🚀 HƯỚNG DẪN DEPLOY LÊN RAILWAY.APP (MIỄN PHÍ)

## Tổng Quan

Dự án này sẽ được deploy theo kiến trúc:
- **MongoDB Atlas**: Free 512MB (Database)
- **Upstash Redis**: Free tier (Cache)
- **Railway.app**: 3 services chính (Backend)
- **Vercel**: Frontend (React)

**Chi phí**: $0/tháng nếu traffic < giới hạn free tier

---

## BƯỚC 1: TẠO MONGODB ATLAS (5 PHÚT)

### 1.1. Đăng Ký MongoDB Atlas

```
🔗 https://www.mongodb.com/cloud/atlas/register

1. Truy cập link trên
2. Sign up với Google/Email
3. Chọn "Shared" (FREE)
4. Chọn Cloud Provider: AWS
5. Region: Singapore (ap-southeast-1) - gần VN nhất
6. Cluster Name: genzmobo-cluster
7. Click "Create Cluster" (chờ 3-5 phút)
```

### 1.2. Tạo Database User

```
1. Vào tab "Database Access" (menu bên trái)
2. Click "Add New Database User"
3. Authentication Method: Password
   - Username: genzmobo_admin
   - Password: [TỰ TẠO MẬT KHẨU MẠNH] (lưu lại!)
   - Ví dụ: GenZMobo@2025SecurePass
4. Database User Privileges: "Atlas admin"
5. Click "Add User"
```

### 1.3. Whitelist IP Address

```
1. Vào tab "Network Access" (menu bên trái)
2. Click "Add IP Address"
3. Chọn "Allow Access from Anywhere"
   - IP Address: 0.0.0.0/0
   (Railway có IP động nên phải cho phép tất cả)
4. Click "Confirm"
```

### 1.4. Lấy Connection String

```
1. Vào tab "Database" (menu bên trái)
2. Click nút "Connect" trên cluster của bạn
3. Chọn "Connect your application"
4. Driver: Python, Version: 3.12 or later
5. Copy Connection String:

mongodb+srv://genzmobo_admin:<password>@genzmobo-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority

6. Thay <password> bằng mật khẩu thực tế:

mongodb+srv://genzmobo_admin:GenZMobo@2025SecurePass@genzmobo-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**✅ LƯU LẠI CONNECTION STRING NÀY!**

---

## BƯỚC 2: TẠO UPSTASH REDIS (3 PHÚT)

### 2.1. Đăng Ký Upstash

```
🔗 https://upstash.com/

1. Truy cập link trên
2. Sign up với GitHub/Google
3. Vào "Redis" tab
4. Click "Create Database"
```

### 2.2. Tạo Redis Database

```
1. Name: genzmobo-redis
2. Type: Regional
3. Region: ap-southeast-1 (Singapore)
4. Click "Create"
```

### 2.3. Lấy Redis URL

```
1. Click vào database vừa tạo
2. Scroll xuống "REST API" section
3. Copy "UPSTASH_REDIS_REST_URL":

https://guiding-macaw-12345.upstash.io

4. Copy "UPSTASH_REDIS_REST_TOKEN":

AabBccDd...xyz123

5. Tạo Redis URL format chuẩn:

redis://default:[UPSTASH_REDIS_REST_TOKEN]@guiding-macaw-12345.upstash.io:6379
```

**✅ LƯU LẠI REDIS URL NÀY!**

---

## BƯỚC 3: PUSH CODE LÊN GITHUB

### 3.1. Tạo Repository Mới

```bash
# Truy cập: https://github.com/new
# Tạo repo mới tên: finalsoa
# Visibility: Public hoặc Private (tùy bạn)
```

### 3.2. Push Code

```bash
cd /Users/jasonnguyen/521H0185/SOA/finalsoa

# Initialize git nếu chưa có
git init

# Add all files
git add .

# Commit
git commit -m "Prepare for Railway deployment"

# Add remote
git remote add origin https://github.com/[YOUR_USERNAME]/finalsoa.git

# Push
git branch -M main
git push -u origin main
```

---

## BƯỚC 4: DEPLOY LÊN RAILWAY

### 4.1. Đăng Ký Railway

```
🔗 https://railway.app/

1. Sign up với GitHub account
2. Authorize Railway to access GitHub
3. Verify email
```

### 4.2. Tạo Project Mới

```
1. Click "New Project"
2. Chọn "Deploy from GitHub repo"
3. Chọn repository: finalsoa
4. Railway sẽ tự động detect và deploy
```

### 4.3. Deploy Auth Service

```
1. Click "New" → "GitHub Repo" → Chọn "finalsoa"
2. Click vào service vừa tạo
3. Settings → Environment:
   - Root Directory: backend/auth_service
   - Custom Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
4. Variables tab → Add variables:

MONGO_URI=mongodb+srv://genzmobo_admin:GenZMobo@2025SecurePass@genzmobo-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
DATABASE_NAME=ONLINE_ENTERTAINMENT_PLATFORM
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_ALGORITHM=HS256
JWT_ACCESS_EXPIRE_MINUTES=15
JWT_REFRESH_EXPIRE_DAYS=7
REDIS_URL=redis://default:[TOKEN]@guiding-macaw-12345.upstash.io:6379
PORT=8001

5. Click "Deploy"
6. Sau khi deploy xong, vào Settings → Networking → Generate Domain
7. Lưu lại URL: https://auth-service-production-xxxx.up.railway.app
```

### 4.4. Deploy User Service

```
Lặp lại bước 4.3 với:
- Root Directory: backend/user_service
- PORT=8002
- Các biến môi trường tương tự (MONGO_URI, REDIS_URL, etc.)
```

### 4.5. Deploy Movie Service

```
Lặp lại bước 4.3 với:
- Root Directory: backend/movie_service
- PORT=8003
- Các biến môi trường tương tự
```

---

## BƯỚC 5: DEPLOY FRONTEND LÊN VERCEL

### 5.1. Cập Nhật Frontend .env

Trước khi deploy, cập nhật file `.env` ở frontend:

```bash
VITE_API_BASE_URL=https://auth-service-production-xxxx.up.railway.app
VITE_AUTH_SERVICE_URL=https://auth-service-production-xxxx.up.railway.app
VITE_USER_SERVICE_URL=https://user-service-production-xxxx.up.railway.app
VITE_MOVIE_SERVICE_URL=https://movie-service-production-xxxx.up.railway.app
VITE_BOOK_SERVICE_URL=https://book-service-production-xxxx.up.railway.app
VITE_COLLECTION_SERVICE_URL=https://collection-service-production-xxxx.up.railway.app
```

### 5.2. Deploy Lên Vercel

```
🔗 https://vercel.com/

1. Sign up với GitHub
2. Click "Add New Project"
3. Import repository: finalsoa
4. Framework Preset: Vite
5. Root Directory: . (để trống hoặc chọn root)
6. Build Command: npm run build
7. Output Directory: dist
8. Environment Variables: Thêm các biến từ .env
9. Click "Deploy"
10. Domain: https://finalsoa.vercel.app (hoặc custom domain)
```

---

## BƯỚC 6: CUSTOM DOMAIN (TÙY CHỌN)

### Nếu Bạn Có Domain genzmobo.com:

#### 6.1. Vercel (Frontend)

```
1. Vào Vercel Project Settings
2. Domains → Add Domain
3. Nhập: www.genzmobo.com
4. Vercel sẽ cho bạn DNS records cần add:

   CNAME: www → cname.vercel-dns.com

5. Vào domain registrar (Namecheap/GoDaddy) add DNS record
```

#### 6.2. Railway (Backend)

```
1. Vào mỗi service Settings → Networking
2. Custom Domain → Add Domain
3. Nhập: api.genzmobo.com
4. Railway sẽ cho DNS records:

   CNAME: api → xxx.up.railway.app
```

---

## TROUBLESHOOTING

### Lỗi: MongoDB Connection Failed

```bash
# Kiểm tra:
1. IP Address đã whitelist 0.0.0.0/0 chưa?
2. Username/Password có đúng không?
3. Connection string có thay <password> chưa?
```

### Lỗi: Railway Out of Memory

```bash
# Giảm số workers trong Railway:
# Thay vì: uvicorn app.main:app --workers 2
# Dùng: uvicorn app.main:app --workers 1
```

### Lỗi: CORS khi gọi API

```bash
# Cập nhật CORS origins trong backend:
# Thêm Vercel domain vào allowed origins
```

---

## CHI PHÍ DỰ KIẾN

| Service | Chi Phí | Giới Hạn Free |
|---------|---------|---------------|
| MongoDB Atlas | $0 | 512MB storage |
| Upstash Redis | $0 | 10,000 requests/day |
| Railway | $0-5 | $5 credit/month |
| Vercel | $0 | 100GB bandwidth/month |
| **TỔNG** | **$0/tháng** | Traffic thấp-trung bình |

---

## MONITORING

### Railway Metrics

```
1. Vào Railway Dashboard
2. Click vào service
3. Metrics tab → xem CPU, Memory, Network usage
4. Nếu gần vượt $5/month: cân nhắc tắt service ít dùng
```

### MongoDB Atlas Metrics

```
1. Vào Atlas Dashboard
2. Metrics tab → xem Connections, Operations, Storage
3. Alert: Nếu gần 512MB → cần clean data
```

---

## NEXT STEPS

1. ✅ Test tất cả API endpoints
2. ✅ Import sample data vào MongoDB Atlas
3. ✅ Test frontend với backend mới
4. ✅ Setup monitoring alerts
5. ✅ (Optional) Mua domain và setup custom domain

---

## SUPPORT

Nếu gặp vấn đề:
- Railway Docs: https://docs.railway.app
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com
- Vercel Docs: https://vercel.com/docs

---

**Chúc bạn deploy thành công! 🚀**
