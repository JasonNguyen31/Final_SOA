# 🚀 RAILWAY QUICK START - TÓM TẮT NHANH

## 📝 Checklist 5 Phút

### Bước 1: MongoDB Atlas (3 phút)
1. ➡️ https://www.mongodb.com/cloud/atlas/register
2. Tạo cluster FREE ở Singapore
3. Tạo user: `genzmobo_admin` / `[mật khẩu mạnh]`
4. Network: Allow `0.0.0.0/0`
5. Copy connection string → Lưu lại!

### Bước 2: Upstash Redis (2 phút)
1. ➡️ https://upstash.com
2. Tạo database ở Singapore
3. Copy REST URL & TOKEN → Lưu lại!

### Bước 3: GitHub (3 phút)
```bash
cd /Users/jasonnguyen/521H0185/SOA/finalsoa
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Bước 4: Railway (15 phút)
1. ➡️ https://railway.app → Login với GitHub
2. New Project → Deploy from GitHub → Chọn `finalsoa`
3. Deploy 3 services:
   - `backend/auth_service`
   - `backend/user_service`
   - `backend/movie_service`
4. Mỗi service: Add env vars + Generate Domain

### Bước 5: Vercel (5 phút)
1. ➡️ https://vercel.com → Login với GitHub
2. Import `finalsoa` → Framework: Vite
3. Add env vars → Deploy!

---

## 🔑 Environment Variables Template

Copy vào Railway cho mỗi service:

```env
MONGO_URI=mongodb+srv://genzmobo_admin:PASSWORD@cluster.xxxxx.mongodb.net/
DATABASE_NAME=ONLINE_ENTERTAINMENT_PLATFORM
REDIS_URL=redis://default:TOKEN@xxx.upstash.io:6379
JWT_SECRET=[run: python3 -c "import secrets; print(secrets.token_urlsafe(32))"]
JWT_ALGORITHM=HS256
JWT_ACCESS_EXPIRE_MINUTES=15
JWT_REFRESH_EXPIRE_DAYS=7
SERVICE_NAME=auth_service
```

**Lưu ý**: Đổi `SERVICE_NAME` cho mỗi service (auth_service, user_service, movie_service)

---

## 📊 Chi Phí Dự Kiến

| Service | Free Tier | Limit |
|---------|-----------|-------|
| MongoDB Atlas | ✅ FREE | 512MB |
| Upstash Redis | ✅ FREE | 10K req/day |
| Railway | ✅ $5/mo | 3 services |
| Vercel | ✅ FREE | 100GB/mo |

**Tổng: $0/tháng** nếu traffic thấp!

---

## 🔗 Quick Links

- **Full Guide**: `RAILWAY_DEPLOYMENT_GUIDE.md`
- **Checklist**: `DEPLOYMENT_CHECKLIST.md`
- **Env Template**: `backend/.env.railway.template`

---

## ⚡ Generate JWT Secret

```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

Copy output vào `JWT_SECRET`

---

## 🧪 Test Commands

```bash
# Test health endpoints
curl https://your-auth-service.up.railway.app/health
curl https://your-user-service.up.railway.app/health
curl https://your-movie-service.up.railway.app/health
```

Expected: `{"status": "ok"}`

---

## 🆘 Common Issues

**Build Failed**
→ Check Root Directory in Settings

**500 Error**
→ Check Environment Variables

**CORS Error**
→ Add Vercel domain to backend CORS settings

---

## 📞 Support Resources

- Railway Docs: https://docs.railway.app
- MongoDB Atlas: https://docs.atlas.mongodb.com
- Vercel Docs: https://vercel.com/docs

---

**Ready? Start with `DEPLOYMENT_CHECKLIST.md`! 🎯**
