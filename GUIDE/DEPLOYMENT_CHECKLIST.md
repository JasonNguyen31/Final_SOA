# ✅ DEPLOYMENT CHECKLIST - Railway + Vercel

Làm theo thứ tự checklist này để deploy thành công!

---

## 📋 TRƯỚC KHI BẮT ĐẦU

- [ ] Đã có tài khoản GitHub
- [ ] Đã có thẻ sinh viên (để đăng ký GitHub Student Pack sau này)
- [ ] Đã đọc file `RAILWAY_DEPLOYMENT_GUIDE.md`

---

## 🗄️ BƯỚC 1: SETUP MONGODB ATLAS (10 phút)

### 1.1. Đăng Ký & Tạo Cluster
- [ ] Truy cập https://www.mongodb.com/cloud/atlas/register
- [ ] Đăng ký với email/Google
- [ ] Chọn plan "Shared" (FREE)
- [ ] Cloud Provider: **AWS**
- [ ] Region: **Singapore (ap-southeast-1)**
- [ ] Cluster Name: **genzmobo-cluster**
- [ ] Click "Create Cluster" → Chờ 3-5 phút

### 1.2. Tạo Database User
- [ ] Vào tab **Database Access**
- [ ] Click **Add New Database User**
- [ ] Username: `genzmobo_admin`
- [ ] Password: Tạo mật khẩu mạnh (ví dụ: `GenZMobo@2025Secure`)
- [ ] **✏️ LƯU MẬT KHẨU VÀO ĐÂY:** ___________________________
- [ ] Privileges: **Atlas admin**
- [ ] Click **Add User**

### 1.3. Whitelist IP
- [ ] Vào tab **Network Access**
- [ ] Click **Add IP Address**
- [ ] Chọn **Allow Access from Anywhere**
- [ ] IP: `0.0.0.0/0`
- [ ] Click **Confirm**

### 1.4. Lấy Connection String
- [ ] Vào tab **Database**
- [ ] Click **Connect** trên cluster
- [ ] Chọn **Connect your application**
- [ ] Driver: **Python 3.12+**
- [ ] Copy connection string
- [ ] **Thay `<password>` bằng mật khẩu thực tế**
- [ ] **✏️ LƯU CONNECTION STRING:**

```
mongodb+srv://genzmobo_admin:___________@genzmobo-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

---

## 🔴 BƯỚC 2: SETUP UPSTASH REDIS (5 phút)

### 2.1. Đăng Ký & Tạo Database
- [ ] Truy cập https://upstash.com/
- [ ] Sign up với GitHub/Google
- [ ] Click **Redis** tab
- [ ] Click **Create Database**

### 2.2. Cấu Hình Database
- [ ] Name: **genzmobo-redis**
- [ ] Type: **Regional**
- [ ] Region: **ap-southeast-1** (Singapore)
- [ ] Click **Create**

### 2.3. Lấy Redis Credentials
- [ ] Click vào database vừa tạo
- [ ] Scroll xuống section **REST API**
- [ ] **✏️ Copy REST URL:** ___________________________
- [ ] **✏️ Copy REST TOKEN:** ___________________________

### 2.4. Tạo Redis URL
- [ ] Format: `redis://default:[TOKEN]@[HOST]:6379`
- [ ] Ví dụ: `redis://default:AabBccDd123@guiding-macaw-12345.upstash.io:6379`
- [ ] **✏️ LƯU REDIS URL:**

```
redis://default:___________@___________.upstash.io:6379
```

---

## 🐙 BƯỚC 3: PUSH CODE LÊN GITHUB (5 phút)

### 3.1. Tạo Repository
- [ ] Truy cập https://github.com/new
- [ ] Repository name: **finalsoa**
- [ ] Visibility: **Public** (hoặc Private)
- [ ] **KHÔNG** check "Add README"
- [ ] Click **Create repository**
- [ ] **✏️ LƯU REPO URL:** ___________________________

### 3.2. Git Commands
```bash
cd /Users/jasonnguyen/521H0185/SOA/finalsoa

# Check git status
git status

# If not initialized:
git init

# Add all files
git add .

# Commit
git commit -m "Prepare for Railway deployment"

# Add remote (REPLACE với repo URL của bạn)
git remote add origin https://github.com/YOUR_USERNAME/finalsoa.git

# Push
git branch -M main
git push -u origin main
```

- [ ] Code đã push lên GitHub thành công
- [ ] Verify trên GitHub: Thấy tất cả files

---

## 🚂 BƯỚC 4: DEPLOY LÊN RAILWAY (20 phút)

### 4.1. Đăng Ký Railway
- [ ] Truy cập https://railway.app/
- [ ] Click **Login with GitHub**
- [ ] Authorize Railway
- [ ] Verify email

### 4.2. Deploy Auth Service

#### A. Tạo Service
- [ ] Click **New Project**
- [ ] Chọn **Deploy from GitHub repo**
- [ ] Chọn repository: **finalsoa**
- [ ] Railway tạo service → Click vào service

#### B. Cấu Hình Root Directory
- [ ] Click **Settings** tab
- [ ] **Root Directory**: `backend/auth_service`
- [ ] **Build Command**: (để trống, dùng Dockerfile)
- [ ] **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

#### C. Thêm Environment Variables
- [ ] Click **Variables** tab
- [ ] Click **New Variable** → Thêm từng biến:

```bash
MONGO_URI=[PASTE MONGODB ATLAS CONNECTION STRING]
DATABASE_NAME=ONLINE_ENTERTAINMENT_PLATFORM
REDIS_URL=[PASTE UPSTASH REDIS URL]
JWT_SECRET=[TỰ TẠO - dùng: python3 -c "import secrets; print(secrets.token_urlsafe(32))"]
JWT_ALGORITHM=HS256
JWT_ACCESS_EXPIRE_MINUTES=15
JWT_REFRESH_EXPIRE_DAYS=7
SERVICE_NAME=auth_service
```

- [ ] **✏️ LƯU JWT_SECRET:** ___________________________

#### D. Generate Domain
- [ ] Click **Settings** → **Networking**
- [ ] Click **Generate Domain**
- [ ] **✏️ LƯU AUTH SERVICE URL:**

```
https://_____________________________.up.railway.app
```

- [ ] Click **Deploy** → Chờ 2-5 phút
- [ ] Kiểm tra: `https://[YOUR-DOMAIN].up.railway.app/health`
- [ ] Response: `{"status": "ok"}` ✅

---

### 4.3. Deploy User Service

- [ ] Click **New** (trong cùng project)
- [ ] Chọn **GitHub Repo** → **finalsoa**
- [ ] Settings → Root Directory: `backend/user_service`
- [ ] Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- [ ] Variables: Copy từ auth_service, đổi `SERVICE_NAME=user_service`
- [ ] Generate Domain
- [ ] **✏️ LƯU USER SERVICE URL:**

```
https://_____________________________.up.railway.app
```

- [ ] Test: `/health` endpoint

---

### 4.4. Deploy Movie Service

- [ ] Click **New** → **GitHub Repo** → **finalsoa**
- [ ] Settings → Root Directory: `backend/movie_service`
- [ ] Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- [ ] Variables: Copy từ auth_service, đổi `SERVICE_NAME=movie_service`
- [ ] Generate Domain
- [ ] **✏️ LƯU MOVIE SERVICE URL:**

```
https://_____________________________.up.railway.app
```

- [ ] Test: `/health` endpoint

---

## 🌐 BƯỚC 5: DEPLOY FRONTEND LÊN VERCEL (10 phút)

### 5.1. Cập Nhật Frontend .env

Tạo file `.env.production` trong thư mục root:

```bash
VITE_AUTH_SERVICE_URL=[PASTE AUTH SERVICE URL]
VITE_USER_SERVICE_URL=[PASTE USER SERVICE URL]
VITE_MOVIE_SERVICE_URL=[PASTE MOVIE SERVICE URL]
VITE_BOOK_SERVICE_URL=[PASTE BOOK SERVICE URL (nếu có)]
VITE_COLLECTION_SERVICE_URL=[PASTE COLLECTION SERVICE URL (nếu có)]
```

- [ ] File `.env.production` đã tạo
- [ ] Commit và push:

```bash
git add .env.production
git commit -m "Add production environment variables"
git push
```

### 5.2. Deploy Lên Vercel

- [ ] Truy cập https://vercel.com/
- [ ] **Sign up with GitHub**
- [ ] Click **Add New Project**
- [ ] Import repository: **finalsoa**
- [ ] Framework Preset: **Vite**
- [ ] Root Directory: `.` (để mặc định)
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Click **Environment Variables** → Thêm từ `.env.production`
- [ ] Click **Deploy**
- [ ] Chờ 2-5 phút

### 5.3. Lưu Domain

- [ ] **✏️ LƯU VERCEL URL:**

```
https://_____________________________.vercel.app
```

- [ ] Test: Truy cập URL, xem trang web hoạt động

---

## 🔧 BƯỚC 6: KIỂM TRA & TEST (15 phút)

### 6.1. Test Backend APIs

```bash
# Test Auth Service
curl https://[AUTH-SERVICE-URL]/health

# Test User Service
curl https://[USER-SERVICE-URL]/health

# Test Movie Service
curl https://[MOVIE-SERVICE-URL]/health
```

- [ ] Tất cả health checks trả về `{"status": "ok"}`

### 6.2. Test Frontend

- [ ] Mở Vercel URL trong browser
- [ ] Trang chủ load thành công
- [ ] Thử đăng ký tài khoản mới
- [ ] Thử đăng nhập
- [ ] Thử tìm kiếm phim
- [ ] Kiểm tra watching history

### 6.3. Import Sample Data (Optional)

```bash
# Nếu bạn có script import data
# Cần connect tới MongoDB Atlas và import
```

---

## 📊 BƯỚC 7: MONITORING & OPTIMIZATION

### 7.1. Railway Metrics
- [ ] Vào Railway Dashboard
- [ ] Click vào từng service
- [ ] Tab **Metrics** → Xem CPU, Memory usage
- [ ] Đảm bảo không vượt quá $5/month

### 7.2. MongoDB Atlas
- [ ] Vào Atlas Dashboard
- [ ] Tab **Metrics**
- [ ] Kiểm tra storage usage (max 512MB)

### 7.3. Upstash Redis
- [ ] Vào Upstash Dashboard
- [ ] Xem requests/day (max 10,000)

---

## 🎉 HOÀN THÀNH!

Nếu tất cả checklist đều ✅, chúc mừng bạn đã deploy thành công!

### URLs Của Bạn:

```
Frontend: https://_____________________________.vercel.app
Auth API: https://_____________________________.up.railway.app
User API: https://_____________________________.up.railway.app
Movie API: https://_____________________________.up.railway.app
```

---

## 🆘 TROUBLESHOOTING

### Lỗi Build Failed trên Railway
- Kiểm tra Root Directory đã đúng chưa
- Kiểm tra Dockerfile có tồn tại không
- Xem logs trong Railway Dashboard

### Lỗi 500 Internal Server Error
- Kiểm tra Environment Variables
- Kiểm tra MONGO_URI có đúng format không
- Kiểm tra Network Access trên MongoDB Atlas

### Frontend không kết nối được backend
- Kiểm tra CORS settings trong backend
- Thêm Vercel domain vào CORS_ORIGINS
- Kiểm tra .env.production có đúng URLs không

---

## 📚 NEXT STEPS

- [ ] Đăng ký GitHub Student Developer Pack để nhận $200 DigitalOcean credit
- [ ] Mua domain .com cho professional hơn
- [ ] Setup custom domain cho Vercel và Railway
- [ ] Enable analytics và monitoring
- [ ] Setup backup cho MongoDB Atlas

---

**Good luck! 🚀**
