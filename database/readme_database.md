# Entertainment Platform Database - Import Guide

## 📦 Files

- `entertainment_platform_backup.archive` - Database backup (MongoDB dump)

## 🗄️ Database Information

- **Database Name**: `ONLINE_ENTERTAINMENT_PLATFORM`
- **MongoDB Version**: 8.0+
- **Collections**: 12 (users, movies, books, comments, ratings, transactions, etc.)
- **Total Documents**: 45+ documents with full relationships

## 📥 How to Import

### Prerequisites

1. MongoDB must be installed and running
2. MongoDB version 8.0 or higher

### Quick Start (One Command)

```bash
mongorestore --archive=entertainment_platform_backup.archive --gzip
```

### Verify Import

```bash
# Connect to MongoDB
mongosh

# Switch to database
use ONLINE_ENTERTAINMENT_PLATFORM

# Check collections
show collections

# Count documents in users collection
db.users.countDocuments()
# Should return: 4

# Exit
exit
```

## 🔗 Connection String

```
mongodb://localhost:27017/ONLINE_ENTERTAINMENT_PLATFORM
```

## 📊 Collections Schema & Indexes

### **1. users**

**Description:** User accounts, authentication, wallet, premium status

**Schema:**

```javascript
{
  _id: ObjectId,
  email: String (required, unique),
  username: String (required, unique),
  passwordHash: String (required),
  fullName: String (required),
  displayName: String,
  avatar: String,
  role: String (required, default: 'user', enum: ['user', 'admin', 'moderator']),
  language: String (default: 'vi'),
  isVerified: Boolean (required, default: false),
  otpCode: String,
  otpExpiresAt: Date,
  resetPasswordToken: String,
  resetPasswordExpiresAt: Date,
  isPremium: Boolean (required, default: false),
  premiumExpiresAt: Date,
  wallet: {
    balance: Number (default: 0),
    currency: String (default: 'VND'),
    totalDeposited: Number (default: 0),
    totalSpent: Number (default: 0),
    lastTransactionAt: Date
  },
  stats: {
    totalMoviesWatched: Number (default: 0),
    totalBooksRead: Number (default: 0),
    totalComments: Number (default: 0),
    totalRatings: Number (default: 0)
  },
  violationCount: Number (default: 0),
  status: String (required, default: 'active', enum: ['active', 'inactive', 'banned', 'deleted']),
  lastLoginAt: Date,
  createdAt: Date (required),
  updatedAt: Date (required)
}
```

**Indexes:**

- `{ email: 1 }` - **Unique**
- `{ username: 1 }` - **Unique**
- `{ status: 1 }`
- `{ role: 1, status: 1 }` - **Compound**

**Sample Count:** 4 documents

---

### **2. books**

**Description:** Book catalog with PDF links, adapted movies

**Schema:**

```javascript
{
  _id: ObjectId,
  movieAdaptations: [ObjectId] (ref: movies._id),
  title: String (required),
  author: String (required),
  description: String,
  coverImageUrl: String (required),
  pdfUrl: String,
  categories: [String] (required),
  publishYear: Number,
  publisher: String,
  language: String,
  totalPages: Number (required),
  rating: Number (default: 0),
  totalRatings: Number (default: 0),
  totalReads: Number (default: 0),
  totalComments: Number (default: 0),
  createdBy: ObjectId (ref: users._id),
  isActive: Boolean (required, default: true),
  isDeleted: Boolean (required, default: false),
  createdAt: Date (required),
  updatedAt: Date (required)
}
```

**Indexes:**

- `{ isActive: 1, isDeleted: 1 }` - **Compound**
- `{ categories: 1 }`
- `{ author: 1 }`
- `{ title: "text", author: "text", description: "text" }` - **Text Search**

**Sample Count:** 4 documents

---

### **3. movies**

**Description:** Movie catalog with metadata, ratings, premium status

**Schema:**

```javascript
{
  _id: ObjectId,
  adaptedFromBookId: ObjectId (ref: books._id, nullable),
  title: String (required),
  description: String,
  thumbnailUrl: String (required),
  videoUrl: String (required),
  duration: Number (required, in seconds),
  releaseYear: Number,
  director: String,
  cast: [String],
  genres: [String] (required),
  country: String,
  language: String,
  isPremium: Boolean (required, default: false),
  isFeatured: Boolean (default: false),
  featuredRank: Number,
  rating: Number (default: 0),
  totalRatings: Number (default: 0),
  totalViews: Number (default: 0),
  totalComments: Number (default: 0),
  createdBy: ObjectId (ref: users._id),
  isActive: Boolean (required, default: true),
  isDeleted: Boolean (required, default: false),
  createdAt: Date (required),
  updatedAt: Date (required)
}
```

**Indexes:**

- `{ isPremium: 1, isActive: 1, isDeleted: 1 }` - **Compound**
- `{ genres: 1 }`
- `{ isFeatured: 1, featuredRank: 1 }` - **Compound**
- `{ releaseYear: -1 }`
- `{ title: "text", description: "text", director: "text" }` - **Text Search**

**Sample Count:** 5 documents

---

### **4. transactions**

**Description:** Payment transactions for deposits and premium purchases

**Schema:**

```javascript
{
  _id: ObjectId,
  userId: ObjectId (required, ref: users._id),
  type: String (required, enum: ['deposit', 'premium_purchase', 'refund']),
  amount: Number (required),
  balanceBefore: Number,
  balanceAfter: Number,
  description: String,
  metadata: {
    paymentMethod: String (enum: ['momo', 'vnpay', 'onepay', 'wallet']),
    paymentGateway: String,
    transactionId: String,
    planType: String (enum: ['monthly', 'quarterly', 'yearly']),
    gatewayResponse: Object
  },
  status: String (required, enum: ['pending', 'completed', 'failed', 'cancelled']),
  idempotencyKey: String (required, unique),
  completedAt: Date,
  createdAt: Date (required),
  updatedAt: Date (required)
}
```

**Indexes:**

- `{ userId: 1 }`
- `{ idempotencyKey: 1 }` - **Unique**
- `{ status: 1, createdAt: -1 }` - **Compound**
- `{ type: 1, userId: 1 }` - **Compound**

**Sample Count:** 3 documents

---

### **5. premiumSubscriptions**

**Description:** Active premium subscriptions

**Schema:**

```javascript
{
  _id: ObjectId,
  userId: ObjectId (required, ref: users._id),
  transactionId: ObjectId (required, ref: transactions._id),
  planType: String (required, enum: ['monthly', 'quarterly', 'yearly']),
  amount: Number (required),
  startDate: Date (required),
  endDate: Date (required),
  status: String (required, enum: ['active', 'expired', 'cancelled']),
  isAutoRenew: Boolean (default: false),
  createdAt: Date (required),
  updatedAt: Date (required)
}
```

**Indexes:**

- `{ userId: 1, status: 1 }` - **Compound**
- `{ endDate: 1 }`
- `{ status: 1, endDate: 1 }` - **Compound**

**Sample Count:** 1 document

---

### **6. comments**

**Description:** User comments on movies and books with moderation

**Schema:**

```javascript
{
  _id: ObjectId,
  userId: ObjectId (required, ref: users._id),
  userDetails: {
    displayName: String,
    avatar: String
  },
  contentType: String (required, enum: ['movie', 'book']),
  contentId: ObjectId (required, ref: movies._id or books._id),
  text: String (required, max: 1000),
  status: String (required, enum: ['approved', 'rejected'], default: 'approved'),
  rejectionReason: String (enum: ['bad_words', 'spam', 'external_link', 'user_behavior']),
  reportCount: Number (default: 0),
  reportedBy: [ObjectId] (ref: users._id),
  isRemoved: Boolean (default: false),
  removedBy: ObjectId (ref: users._id),
  removalReason: String,
  removedAt: Date,
  createdAt: Date (required)
}
```

**Indexes:**

- `{ contentType: 1, contentId: 1, status: 1 }` - **Compound**
- `{ userId: 1 }`
- `{ status: 1, isRemoved: 1 }` - **Compound**
- `{ createdAt: -1 }`

**Sample Count:** 5 documents

---

### **7. reports**

**Description:** User reports on inappropriate comments

**Schema:**

```javascript
{
  _id: ObjectId,
  reporterId: ObjectId (required, ref: users._id),
  commentId: ObjectId (required, ref: comments._id),
  reason: String (required, enum: ['spam', 'harassment', 'inappropriate', 'other']),
  description: String (max: 200),
  status: String (required, default: 'pending', enum: ['pending', 'reviewed', 'resolved']),
  reviewedBy: ObjectId (ref: users._id - admin),
  action: String (enum: ['dismiss', 'remove_comment', 'ban_user']),
  reviewedAt: Date,
  createdAt: Date (required)
}
```

**Indexes:**

- `{ commentId: 1 }`
- `{ status: 1, createdAt: -1 }` - **Compound**
- `{ reporterId: 1 }`

**Sample Count:** 3 documents

---

### **8. ratings**

**Description:** User ratings for movies and books (1-5 stars)

**Schema:**

```javascript
{
  _id: ObjectId,
  userId: ObjectId (required, ref: users._id),
  contentType: String (required, enum: ['movie', 'book']),
  contentId: ObjectId (required, ref: movies._id or books._id),
  rating: Number (required, min: 1, max: 5),
  createdAt: Date (required),
  updatedAt: Date (required)
}
```

**Indexes:**

- `{ userId: 1, contentType: 1, contentId: 1 }` - **Unique Compound** (one rating per user per content)
- `{ contentType: 1, contentId: 1 }` - **Compound**

**Sample Count:** 4 documents

---

### **9. watching_progress**

**Description:** Movie watching progress tracking

**Schema:**

```javascript
{
  _id: ObjectId,
  userId: ObjectId (required, ref: users._id),
  movieId: ObjectId (required, ref: movies._id),
  currentTime: Number (required, in seconds),
  duration: Number (total movie duration in seconds),
  percentage: Number (0-100),
  isCompleted: Boolean (required, default: false),
  completedAt: Date,
  viewedAt: Date (required),
  sessionDuration: Number (in minutes),
  createdAt: Date (required),
  updatedAt: Date (required)
}
```

**Indexes:**

- `{ userId: 1, movieId: 1 }` - **Unique Compound**
- `{ isCompleted: 1, viewedAt: -1 }` - **Compound**
- `{ userId: 1, isCompleted: 1 }` - **Compound**

**Sample Count:** 3 documents

---

### **10. reading_progress**

**Description:** Book reading progress tracking

**Schema:**

```javascript
{
  _id: ObjectId,
  userId: ObjectId (required, ref: users._id),
  bookId: ObjectId (required, ref: books._id),
  currentPage: Number (required),
  totalPages: Number,
  percentage: Number (0-100),
  isCompleted: Boolean (required, default: false),
  completedAt: Date,
  lastReadAt: Date (required),
  createdAt: Date (required),
  updatedAt: Date (required)
}
```

**Indexes:**

- `{ userId: 1, bookId: 1 }` - **Unique Compound**
- `{ isCompleted: 1, lastReadAt: -1 }` - **Compound**
- `{ userId: 1, isCompleted: 1 }` - **Compound**

**Sample Count:** 3 documents

---

### **11. collections** (User Playlists)

**Description:** User-created collections of movies and books

**Schema:**

```javascript
{
  _id: ObjectId,
  userId: ObjectId (required, ref: users._id),
  name: String (required, max: 50),
  description: String (max: 200),
  items: [{
    contentType: String (enum: ['movie', 'book']),
    contentId: ObjectId (ref: movies._id or books._id),
    addedAt: Date
  }],
  itemCount: Number (default: 0, denormalized),
  isPublic: Boolean (required, default: false),
  createdAt: Date (required),
  updatedAt: Date (required)
}
```

**Indexes:**

- `{ userId: 1 }`
- `{ isPublic: 1 }`
- `{ userId: 1, isPublic: 1 }` - **Compound**

**Sample Count:** 3 documents

---

### **12. notifications**

**Description:** User notifications for system events

**Schema:**

```javascript
{
  _id: ObjectId,
  userId: ObjectId (required, ref: users._id),
  type: String (required, enum: ['violation', 'transaction', 'premium', 'system']),
  title: String (required, max: 100),
  body: String (required, max: 500),
  data: {
    commentId: ObjectId (ref: comments._id),
    transactionId: ObjectId (ref: transactions._id),
    subscriptionId: ObjectId (ref: premiumSubscriptions._id),
    rejectionReason: String,
    actionUrl: String
  },
  isRead: Boolean (required, default: false),
  readAt: Date,
  priority: String (enum: ['low', 'normal', 'high']),
  createdAt: Date (required)
}
```

**Indexes:**

- `{ userId: 1 }`
- `{ isRead: 1, createdAt: -1 }` - **Compound**
- `{ userId: 1, isRead: 1, createdAt: -1 }` - **Compound**
- `{ type: 1, userId: 1 }` - **Compound**

**Sample Count:** 6 documents

---

## 🔗 Relationships Summary

```
users (1) ←─── (many) transactions
users (1) ←─── (many) premiumSubscriptions
users (1) ←─── (many) comments
users (1) ←─── (many) reports
users (1) ←─── (many) ratings
users (1) ←─── (many) watching_progress
users (1) ←─── (many) reading_progress
users (1) ←─── (many) collections
users (1) ←─── (many) notifications

books (1) ←─── (many) movies.adaptedFromBookId
books (1) ───→ (many) books.movieAdaptations[]

movies (1) ←─── (many) watching_progress
books (1) ←─── (many) reading_progress

comments (1) ←─── (many) reports
transactions (1) ←─── (1) premiumSubscriptions
```

---

## ✅ What's Included

- ✅ All 12 collections with sample data
- ✅ All indexes (unique, compound, text search)
- ✅ Proper ObjectId references between collections
- ✅ Sample data covering main user flows:
  - User registration & authentication
  - Premium subscription purchase
  - Content viewing & rating
  - Comment moderation (approved/rejected/removed)
  - Violation reporting & handling

---

## 🧪 Test Accounts

| Email                   | Role  | Premium | Status | Password (bcrypt hashed) |
| ----------------------- | ----- | ------- | ------ | ------------------------ |
| admin@entertainment.com | admin | Yes     | active | (hashed in database)     |
| jason@example.com       | user  | Yes     | active | (hashed in database)     |
| mai.tran@example.com    | user  | No      | active | (hashed in database)     |
| john.spam@example.com   | user  | No      | banned | (hashed in database)     |

---

## 🛠️ Troubleshooting

### Error: "mongorestore: command not found"

**Solution**: Install MongoDB Database Tools

```bash
# macOS
brew install mongodb-database-tools

# Ubuntu/Debian
sudo apt-get install mongodb-database-tools

# Windows
# Download from: https://www.mongodb.com/try/download/database-tools
```

### Error: "Failed to connect to MongoDB"

**Solution**: Make sure MongoDB is running

```bash
# Check if MongoDB is running
ps aux | grep mongod

# Start MongoDB (macOS with Homebrew)
brew services start mongodb-community@8.0

# Start MongoDB (Linux)
sudo systemctl start mongod

# Start MongoDB (Windows)
net start MongoDB
```

### Error: "namespace exists with different options"

**Solution**: Drop existing database first

```bash
mongosh ONLINE_ENTERTAINMENT_PLATFORM --eval "db.dropDatabase()"
mongorestore --archive=entertainment_platform_backup.archive --gzip
```

### Error: "E11000 duplicate key error"

**Solution**: Database already contains data

```bash
# Option 1: Drop and restore
mongosh ONLINE_ENTERTAINMENT_PLATFORM --eval "db.dropDatabase()"
mongorestore --archive=entertainment_platform_backup.archive --gzip

# Option 2: Restore with --drop flag (drops collections before restoring)
mongorestore --drop --archive=entertainment_platform_backup.archive --gzip
```

---

## 📝 Notes

1. **ObjectId References**: All foreign key relationships use ObjectId type. Use `.populate()` in Mongoose or `$lookup` in aggregation pipelines to join collections.

2. **Indexes**: All indexes are already created. No need to create them manually.

3. **Validation**: Schema validation is not enforced at database level. Implement validation in your application code.

4. **Timestamps**: `createdAt` and `updatedAt` fields are included in most collections. Use Mongoose timestamps option or manage manually.

5. **Nested Objects**: Collections like `users`, `transactions`, and `notifications` contain nested objects (`wallet`, `stats`, `metadata`, `data`). Access nested fields using dot notation: `wallet.balance`, `metadata.paymentMethod`.

6. **Arrays**: Some collections contain arrays (`cast`, `genres`, `categories`, `movieAdaptations`, `items`). Use array operators (`$push`, `$pull`, `$addToSet`) for updates.

7. **Text Search**: Text search indexes are created on `title`, `description`, `author`, and `director` fields. Use `$text` operator for full-text search:

   ```javascript
   db.movies.find({ $text: { $search: "harry potter" } });
   ```

8. **Unique Constraints**:
   - `users.email` and `users.username` are unique
   - `transactions.idempotencyKey` is unique
   - Compound unique indexes exist on ratings and progress collections
