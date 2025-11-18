# 📋 API ENDPOINTS DOCUMENTATION

## Base URLs
- **Auth Service**: `http://localhost:8001`
- **User Service**: `http://localhost:8002`
- **Movie Service**: `http://localhost:8003`
- **Book Service**: `http://localhost:8004`
- **Collection Service**: `http://localhost:8005`

---

## 🔐 AUTH SERVICE (Port 8001)

### Health Check
```
GET /health
Auth: None
```

### Register
```
POST /api/auth/register
Auth: None
Body: {
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

### Verify OTP
```
POST /api/auth/verify-otp
Auth: None
Body: {
  "email": "user@example.com",
  "otp": "123456"
}
```

### Login
```
POST /api/auth/login
Auth: None
Body: {
  "email": "user@example.com",
  "password": "password123"
}
Response: Sets refresh_token in httpOnly cookie, returns access_token
```

### Refresh Token
```
POST /api/auth/refresh
Auth: Refresh token in cookie
Body: None (token must be in cookie)
```

### Forgot Password
```
POST /api/auth/forgot-password
Auth: None
Body: {
  "email": "user@example.com"
}
```

### Reset Password
```
POST /api/auth/reset-password
Auth: None
Body: {
  "token": "reset_token_from_email",
  "newPassword": "newpassword123"
}
```

### Logout
```
POST /api/auth/logout
Auth: Bearer Token
```

---

## 👤 USER SERVICE (Port 8002)

### Get Profile
```
GET /api/users/profile
Auth: Bearer Token
```

### Update Profile
```
PUT /api/users/profile
Auth: Bearer Token
Body: {
  "fullName": "John Doe Updated",
  "phone": "+1234567890",
  "avatar": "https://example.com/avatar.jpg"
}
```

### Change Password
```
POST /api/users/change-password
Auth: Bearer Token
Body: {
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

### Get Notifications
```
GET /api/users/notifications?unreadOnly=false&page=1&limit=20
Auth: Bearer Token
```

### Mark Notification as Read
```
PATCH /api/users/notifications/{notif_id}/read
Auth: Bearer Token
```

### Delete Notification
```
DELETE /api/users/notifications/{notif_id}
Auth: Bearer Token
```

### Get Wallet
```
GET /api/users/wallet?page=1&limit=20
Auth: Bearer Token
```

### Get View History
```
GET /api/users/view-history?page=1&limit=20
Auth: Bearer Token
```

### Clear View History
```
DELETE /api/users/view-history
Auth: Bearer Token
```

### Upgrade Premium
```
POST /api/users/premium/upgrade
Auth: Bearer Token
Body: {
  "duration": 30
}
```

---

## 🎬 MOVIE SERVICE (Port 8003)

### Health Check
```
GET /health
Auth: None
```

### List Movies (with filters)
```
GET /api/movies?page=1&limit=20&genre=Action&year=2024&sortBy=rating&order=desc
Auth: Optional Bearer Token
Query Params:
  - page: number (default: 1)
  - limit: number (default: 20)
  - genre: string
  - year: number
  - isPremium: boolean
  - isFeatured: boolean
  - sortBy: "viewCount" | "rating" | "releaseYear"
  - order: "asc" | "desc"
  - type: "movie" | "series"
```

### Search Movies
```
GET /api/movies/search?q=Parasite&page=1&limit=5
Auth: Optional Bearer Token
```

### Get Trending Movies
```
GET /api/movies/trending?page=1&limit=20
Auth: Optional Bearer Token
```

### Get Random Movies (for guests)
```
GET /api/movies/random?limit=5
Auth: None
```

### Get Recommended Movies (for logged-in users)
```
GET /api/movies/recommended?limit=5
Auth: Bearer Token
```

### Get Continue Watching
```
GET /api/movies/continue-watching?limit=10
Auth: Bearer Token
```

### Get Movie of the Week
```
GET /api/movies/special/movie-of-week
Auth: None
```

### Get All Genres
```
GET /api/movies/genres
Auth: None
```

### Get Movie Details
```
GET /api/movies/{movie_id}
Auth: Optional Bearer Token
```

### Start Watching Movie
```
POST /api/movies/{movie_id}/watch
Auth: Bearer Token
```

### Update Watch Progress
```
PUT /api/movies/{movie_id}/progress
Auth: Bearer Token
Body: {
  "watchedSeconds": 120,
  "totalSeconds": 7200
}
Rate Limit: 60 requests per minute
```

### Rate Movie
```
POST /api/movies/{movie_id}/rate
Auth: Bearer Token
Body: {
  "rating": 4.5
}
```

### Get Movie Comments
```
GET /api/movies/{movie_id}/comments?page=1&limit=20
Auth: Optional Bearer Token
```

### Add Comment
```
POST /api/movies/{movie_id}/comments
Auth: Bearer Token
Body: {
  "content": "Great movie!",
  "parentId": "optional_parent_comment_id"
}
```

### Update Comment
```
PUT /api/comments/{comment_id}
Auth: Bearer Token
Body: {
  "content": "Updated comment"
}
```

### Delete Comment
```
DELETE /api/comments/{comment_id}
Auth: Bearer Token
```

---

## 📚 BOOK SERVICE (Port 8004)

*Similar structure to Movie Service*

### Health Check
```
GET /health
Auth: None
```

### List Books
```
GET /api/books?page=1&limit=20
Auth: Optional Bearer Token
```

### Search Books
```
GET /api/books/search?q=keyword&page=1&limit=5
Auth: Optional Bearer Token
```

### Get Book Details
```
GET /api/books/{book_id}
Auth: Optional Bearer Token
```

---

## 📁 COLLECTION SERVICE (Port 8005)

### Health Check
```
GET /health
Auth: None
```

### Get User Collections
```
GET /api/collections?page=1&limit=20
Auth: Bearer Token
```

### Create Collection
```
POST /api/collections
Auth: Bearer Token
Body: {
  "name": "My Favorites",
  "description": "My favorite movies",
  "isPublic": true
}
```

### Get Collection Details
```
GET /api/collections/{collection_id}
Auth: Optional Bearer Token
```

### Add Item to Collection
```
POST /api/collections/{collection_id}/items
Auth: Bearer Token
Body: {
  "contentType": "movie",
  "contentId": "movie_id_here"
}
```

### Remove Item from Collection
```
DELETE /api/collections/{collection_id}/items/{item_id}
Auth: Bearer Token
```

### Delete Collection
```
DELETE /api/collections/{collection_id}
Auth: Bearer Token
```

---

## 🔑 Authentication

### For Protected Endpoints:
Add header:
```
Authorization: Bearer <your_access_token>
```

### Token Expiry:
- Access Token: 15 minutes
- Refresh Token: 7 days

### Refresh Flow:
1. When access token expires (401 error)
2. Call `POST /api/auth/refresh` (refresh token in cookie)
3. Get new access token
4. Retry original request

---

## 📊 Response Format

### Success Response:
```json
{
  "success": true,
  "data": { ... },
  "message": null
}
```

### Error Response:
```json
{
  "success": false,
  "error": "Error message here"
}
```

### Paginated Response:
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 20,
      "totalPages": 5
    }
  }
}
```

---

## 🧪 Testing Tips

### 1. Get Auth Token First:
```bash
# Login
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"kiliangill@example.com","password":"admin@123"}'

# Copy the access_token from response
```

### 2. Use Token in Requests:
```bash
curl http://localhost:8003/api/movies/recommended \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 3. Test in Postman:
- Import this file as documentation
- Set environment variable `{{baseUrl}}` = `http://localhost`
- Set environment variable `{{token}}` after login
- Use `{{token}}` in Authorization header

---

## 🚀 Health Check All Services:
```bash
curl http://localhost:8001/health  # Auth
curl http://localhost:8002/health  # User
curl http://localhost:8003/health  # Movie
curl http://localhost:8004/health  # Book
curl http://localhost:8005/health  # Collection
```
