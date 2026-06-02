# US Health Store - Backend API

Backend API cho website bán sản phẩm sức khỏe và chăm sóc cá nhân từ Mỹ.

## 🚀 Công nghệ

- **Node.js** + **Express.js** - Web framework
- **MySQL** - Database
- **Prisma ORM** - Database toolkit
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Request validation
- **multer** - File upload
- **helmet** - Security headers
- **cors** - Cross-origin resource sharing

## 📁 Cấu trúc thư mục

```
backend/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.js            # Seed data
├── src/
│   ├── config/            # Configuration files
│   ├── database/          # Database connection
│   ├── middlewares/       # Express middlewares
│   ├── modules/           # Feature modules
│   │   ├── auth/          # Authentication
│   │   ├── categories/    # Categories management
│   │   ├── products/      # Products management
│   │   ├── carts/         # Shopping cart
│   │   ├── orders/        # Orders management
│   │   └── admin/         # Admin features
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   ├── app.js             # Express app setup
│   └── server.js          # Server entry point
├── uploads/               # Uploaded files
├── .env                   # Environment variables
└── package.json
```

## 🛠️ Cài đặt

### 1. Cài dependencies

```bash
cd backend
npm install
```

### 2. Cấu hình môi trường

Tạo file `.env` hoặc sửa file có sẵn:

```env
NODE_ENV=development
PORT=5000

# Database - Thay đổi thông tin phù hợp với MySQL của bạn
DATABASE_URL="mysql://root:your_password@localhost:3306/us_health_store"

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Upload
UPLOAD_PATH=uploads/products
MAX_FILE_SIZE=5242880
```

### 3. Tạo database MySQL

```bash
mysql -u root -p
```

```sql
CREATE DATABASE us_health_store CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 4. Chạy migration

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 5. Seed data mẫu

```bash
npm run prisma:seed
```

### 6. Chạy server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server sẽ chạy tại: `http://localhost:5000`

## 📚 API Endpoints

### Authentication

```
POST   /api/auth/register     # Đăng ký
POST   /api/auth/login        # Đăng nhập
GET    /api/auth/me           # Lấy thông tin user (Auth required)
PUT    /api/auth/profile      # Cập nhật profile (Auth required)
```

### Categories

```
GET    /api/categories        # Danh sách categories
GET    /api/categories/:id    # Chi tiết category
POST   /api/categories        # Tạo category (Admin)
PUT    /api/categories/:id    # Cập nhật category (Admin)
DELETE /api/categories/:id    # Xóa category (Admin)
```

### Products

```
GET    /api/products                # Danh sách sản phẩm (có filter, search, pagination)
GET    /api/products/:id            # Chi tiết sản phẩm theo ID
GET    /api/products/slug/:slug     # Chi tiết sản phẩm theo slug
POST   /api/products                # Tạo sản phẩm (Admin)
PUT    /api/products/:id            # Cập nhật sản phẩm (Admin)
PATCH  /api/products/:id/status     # Cập nhật trạng thái (Admin)
DELETE /api/products/:id            # Xóa sản phẩm (Admin)
```

Query params cho GET /api/products:
- `page`: Trang hiện tại (default: 1)
- `limit`: Số sản phẩm mỗi trang (default: 12)
- `categoryId`: Lọc theo danh mục
- `search`: Tìm kiếm theo tên, mô tả, brand
- `minPrice`, `maxPrice`: Lọc theo giá
- `sortBy`: Sắp xếp (createdAt, price, name)
- `order`: Thứ tự (asc, desc)

### Cart

```
GET    /api/cart              # Lấy giỏ hàng (Auth required)
POST   /api/cart/items        # Thêm sản phẩm vào giỏ (Auth required)
PUT    /api/cart/items/:id    # Cập nhật số lượng (Auth required)
DELETE /api/cart/items/:id    # Xóa sản phẩm khỏi giỏ (Auth required)
DELETE /api/cart/clear         # Xóa toàn bộ giỏ hàng (Auth required)
```

### Orders

```
POST   /api/orders                    # Tạo đơn hàng (Auth required)
GET    /api/orders/my-orders          # Lịch sử đơn hàng (Auth required)
GET    /api/orders/:id                # Chi tiết đơn hàng (Auth required)
PATCH  /api/orders/:id/cancel         # Hủy đơn hàng (Auth required)
```

### Admin

```
GET    /api/admin/dashboard           # Dashboard thống kê (Admin)
GET    /api/admin/orders              # Danh sách tất cả đơn hàng (Admin)
PATCH  /api/admin/orders/:id/status   # Cập nhật trạng thái đơn (Admin)
GET    /api/admin/users               # Danh sách users (Admin)
PATCH  /api/admin/users/:id/role      # Cập nhật role user (Admin)
```

## 🔐 Authentication

API sử dụng JWT Bearer token. Sau khi login, client nhận token và gửi trong header:

```
Authorization: Bearer <token>
```

## 👤 Tài khoản mẫu

Sau khi seed data:

**Admin:**
- Email: `admin@healthstore.com`
- Password: `admin123`

**User:**
- Email: `user@example.com`
- Password: `user123`

## 🗃️ Database Models

### User
- Quản lý thông tin người dùng
- Phân quyền USER/ADMIN

### Category
- Danh mục sản phẩm
- Có slug để SEO-friendly

### Product
- Thông tin sản phẩm chi tiết
- Quản lý tồn kho
- Hỗ trợ giá sale

### ProductImage
- Nhiều ảnh cho mỗi sản phẩm
- Đánh dấu ảnh chính (isPrimary)

### Cart & CartItem
- Giỏ hàng của từng user
- Quản lý số lượng sản phẩm

### Order & OrderItem
- Đơn hàng với các trạng thái
- Lưu snapshot giá và tên sản phẩm

### InventoryLog
- Lịch sử nhập xuất kho
- Theo dõi biến động tồn kho

## 📊 Order Status Flow

```
PENDING → CONFIRMED → PROCESSING → SHIPPING → DELIVERED
   ↓
CANCELLED
```

## 🛠️ Prisma Commands

```bash
# Generate Prisma Client
npm run prisma:generate

# Create migration
npm run prisma:migrate

# Seed database
npm run prisma:seed

# Open Prisma Studio (Database GUI)
npm run prisma:studio
```

## 📝 Notes

- Tất cả price được lưu dưới dạng Decimal(10,2)
- Images chưa có upload thực tế, đang dùng path mẫu
- Payment chưa được tích hợp, tất cả đơn đều COD
- Validation sử dụng express-validator
- Error handling tập trung qua middleware

## 🚧 TODO

- [ ] Implement file upload với multer
- [ ] Add image optimization
- [ ] Rate limiting
- [ ] API documentation với Swagger
- [ ] Unit tests
- [ ] Integration tests
- [ ] Email notification cho orders
- [ ] Payment gateway integration

## 📄 License

MIT
