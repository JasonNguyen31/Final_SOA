# 🧪 Cách Test Collection Feature

## ✅ Đã Setup Xong

1. ✅ Collection Service đang chạy trên port 8005
2. ✅ Database đã có collection "collections"
3. ✅ Frontend đã có nút "Add to Collection" trong MovieDetailPage
4. ✅ Modal AddToCollectionModal đã sẵn sàng

---

## 🚀 Cách Test Ngay

### Bước 1: Start Frontend (nếu chưa chạy)

```bash
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:3000`

### Bước 2: Login vào hệ thống

1. Mở browser: `http://localhost:3000`
2. Click "Login"
3. Đăng nhập bằng tài khoản của bạn

### Bước 3: Vào trang Movie Detail

1. Click vào bất kỳ movie nào
2. Bạn sẽ thấy nút **"Add to Collection"** dưới phần rating (⭐)

### Bước 4: Test Add to Collection

**Click vào nút "Add to Collection"**, modal sẽ hiện lên với 2 options:

#### Option 1: Nếu CHƯA có collection nào
- Modal sẽ hiển thị "No Collections Yet"
- Click nút **"Create New Collection"**
- Nhập:
  - **Name**: "My Favorite Movies" (max 50 chars)
  - **Description**: "Best movies I've ever watched" (max 200 chars)
  - **Privacy**: Chọn "Private" hoặc "Public"
- Click **"Create Collection"**
- Sau đó collection mới sẽ xuất hiện trong list
- Click **"Add"** để thêm movie vào collection

#### Option 2: Nếu ĐÃ có collections
- Modal sẽ hiển thị list tất cả collections của bạn
- Mỗi collection hiển thị:
  - Tên collection
  - Số lượng items
  - Privacy (Public/Private)
- Click nút **"Add"** bên cạnh collection muốn thêm
- Hoặc click **"Create New Collection"** ở trên để tạo mới

### Bước 5: Verify trong Database

Mở MongoDB để check:

```bash
# Connect to MongoDB
docker exec -it mongo mongosh

# Switch to database
use ONLINE_ENTERTAINMENT_PLATFORM

# Check collections
db.collections.find().pretty()

# Xem collection của 1 user cụ thể
db.collections.find({ userId: ObjectId("YOUR_USER_ID") }).pretty()
```

---

## 🎯 Test Các Chức Năng

### ✅ Test Create Collection

1. Click "Add to Collection"
2. Click "Create New Collection"
3. Nhập thông tin
4. Click "Create Collection"
5. **Kết quả**: Collection mới xuất hiện trong list

### ✅ Test Add Item to Collection

1. Click "Add to Collection"
2. Chọn collection từ list
3. Click "Add"
4. **Kết quả**: Thông báo "Added to collection successfully"

### ✅ Test Duplicate Prevention

1. Thêm cùng 1 movie vào collection
2. Thử thêm lại lần nữa
3. **Kết quả**: Nút "Add" sẽ đổi thành "Added" (disabled)

### ✅ Test View Collections

Kiểm tra collections đã tạo:

```bash
# API call
curl -X GET "http://localhost:8005/api/collections" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### ✅ Test Update Collection

```bash
curl -X PUT "http://localhost:8005/api/collections/COLLECTION_ID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "privacy": "public"
  }'
```

### ✅ Test Delete Collection

```bash
curl -X DELETE "http://localhost:8005/api/collections/COLLECTION_ID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🐛 Troubleshooting

### Lỗi: "Failed to load collections"

**Nguyên nhân**: Backend chưa chạy hoặc JWT token hết hạn

**Giải pháp**:
1. Check backend: `docker ps | grep collection`
2. Restart service: `docker-compose restart collection_service`
3. Login lại để lấy token mới

### Lỗi: "Maximum 20 collections per user"

**Nguyên nhân**: User đã tạo đủ 20 collections

**Giải pháp**:
1. Xóa bớt collections cũ
2. Hoặc tăng limit trong backend: `backend/collection_service/app/services/collection_service.py`

### Lỗi: "Item already in collection"

**Nguyên nhân**: Movie/Book đã có trong collection rồi

**Giải pháp**:
- Đây là expected behavior để tránh duplicate
- Chọn collection khác để add vào

---

## 📊 Test Data

### Sample Collection JSON:

```json
{
  "_id": "674a1234567890abcdef1234",
  "userId": "674a9876543210fedcba9876",
  "name": "My Favorite Anime",
  "description": "Best anime series",
  "privacy": "private",
  "items": [
    {
      "contentId": "movie_123",
      "contentType": "movie",
      "title": "Demon Slayer",
      "thumbnail": "https://...",
      "addedAt": "2025-11-17T12:00:00.000Z"
    }
  ],
  "itemCount": 1,
  "createdAt": "2025-11-17T12:00:00.000Z",
  "updatedAt": "2025-11-17T12:00:00.000Z"
}
```

---

## 🎨 UI Flow

```
Movie Detail Page
    ↓
[User clicks "Add to Collection" button]
    ↓
Modal opens
    ↓
┌─────────────────────────────────┐
│ Option 1: No collections yet    │
│ → Click "Create New Collection" │
│ → Fill form                      │
│ → Click "Create"                 │
│ → Modal shows new collection     │
│ → Click "Add"                    │
└─────────────────────────────────┘
    OR
┌─────────────────────────────────┐
│ Option 2: Has collections       │
│ → List shows all collections    │
│ → Click "Add" next to collection│
│ → Or "Create New Collection"    │
└─────────────────────────────────┘
    ↓
Success notification
    ↓
Movie added to collection!
```

---

## 🎉 Expected Results

Sau khi test thành công:

1. ✅ Collections được lưu vào MongoDB
2. ✅ Items được thêm vào collection.items[]
3. ✅ itemCount tự động update
4. ✅ Không có duplicate items
5. ✅ Modal hiển thị đúng collections
6. ✅ Create/Update/Delete hoạt động
7. ✅ Privacy settings áp dụng đúng

---

**Happy Testing! 🚀**
