# US Health Store - Ecommerce Platform

Website bán hàng sản phẩm sức khỏe và chăm sóc cá nhân từ Mỹ. Xây dựng với ReactJS (Frontend) và NodeJS + Express (Backend).

## 📋 Tổng quan

Hệ thống bao gồm:
- **Frontend**: React 18 + Vite + TailwindCSS
- **Backend**: Node.js + Express + Prisma ORM
- **Database**: MySQL
- **Authentication**: JWT
- **State Management**: React Query + Zustand

## 🎯 Tính năng chính

### Khách hàng
- ✅ Xem danh sách sản phẩm với filter, search, sort
- ✅ Chi tiết sản phẩm
- ✅ Thêm vào giỏ hàng
- ✅ Quản lý giỏ hàng (thêm/sửa/xóa)
- ✅ Đặt hàng (COD)
- ✅ Xem lịch sử đơn hàng
- ✅ Quản lý tài khoản

### Admin
- ✅ Dashboard thống kê
- ✅ Quản lý sản phẩm (CRUD)
- ✅ Quản lý danh mục (CRUD)
- ✅ Quản lý đơn hàng
- ✅ Quản lý người dùng
- ✅ Cập nhật trạng thái đơn hàng

## 🏗️ Cấu trúc Project

```
.
├── backend/           # Backend API (Node.js + Express)
│   ├── prisma/       # Database schema & migrations
│   ├── src/
│   │   ├── config/
│   │   ├── database/
│   │   ├── middlewares/
│   │   ├── modules/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env
│   └── package.json
│
├── frontend/          # Frontend App (React + Vite)
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── stores/
│   │   ├── utils/
│   │   └── App.jsx
│   ├── .env
│   └── package.json
│
└── README.md
```

## 🚀 Hướng dẫn cài đặt

### 1. Yêu cầu hệ thống

- Node.js >= 18.x
- MySQL >= 8.0
- npm hoặc yarn

### 2. Clone repository

```bash
git clone <repository-url>
cd us-health-store
```

### 3. Cài đặt Backend

```bash
cd backend
npm install
```

Tạo database MySQL:
```sql
CREATE DATABASE us_health_store CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Cấu hình file `.env`:
```env
NODE_ENV=development
PORT=5000
DATABASE_URL="mysql://root:your_password@localhost:3306/us_health_store"
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
```

Chạy migration và seed:
```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

Chạy backend:
```bash
npm run dev
```

Backend chạy tại: `http://localhost:5000`

### 4. Cài đặt Frontend

```bash
cd frontend
npm install
```

Tạo file `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Chạy frontend:
```bash
npm run dev
```

Frontend chạy tại: `http://localhost:5173`

## 👤 Tài khoản test

Sau khi seed database:

**Admin**
- Email: `admin@healthstore.com`
- Password: `admin123`

**User**
- Email: `user@example.com`
- Password: `user123`

## 📊 Database Schema

### Bảng chính

- **users** - Người dùng (USER/ADMIN)
- **categories** - Danh mục sản phẩm
- **products** - Sản phẩm
- **product_images** - Hình ảnh sản phẩm
- **carts** - Giỏ hàng
- **cart_items** - Items trong giỏ
- **orders** - Đơn hàng
- **order_items** - Items trong đơn
- **inventory_logs** - Lịch sử nhập xuất kho

### Trạng thái đơn hàng

```
PENDING → CONFIRMED → PROCESSING → SHIPPING → DELIVERED
   ↓
CANCELLED
```

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
PUT    /api/auth/profile
```

### Products
```
GET    /api/products
GET    /api/products/:id
GET    /api/products/slug/:slug
POST   /api/products          (Admin)
PUT    /api/products/:id      (Admin)
DELETE /api/products/:id      (Admin)
```

### Categories
```
GET    /api/categories
POST   /api/categories        (Admin)
PUT    /api/categories/:id    (Admin)
DELETE /api/categories/:id    (Admin)
```

### Cart
```
GET    /api/cart
POST   /api/cart/items
PUT    /api/cart/items/:id
DELETE /api/cart/items/:id
```

### Orders
```
POST   /api/orders
GET    /api/orders/my-orders
PATCH  /api/orders/:id/cancel
```

### Admin
```
GET    /api/admin/dashboard
GET    /api/admin/orders
PATCH  /api/admin/orders/:id/status
GET    /api/admin/users
PATCH  /api/admin/users/:id/role
```

## 🛠️ Tech Stack

### Backend
- Express.js - Web framework
- Prisma ORM - Database toolkit
- MySQL - Database
- JWT - Authentication
- bcryptjs - Password hashing
- express-validator - Validation
- helmet - Security
- cors - CORS handling
- morgan - Logging

### Frontend
- React 18 - UI library
- Vite - Build tool
- React Router - Routing
- TanStack Query - Server state
- Zustand - Client state
- Axios - HTTP client
- React Hook Form - Forms
- Zod - Validation
- Tailwind CSS - Styling
- Lucide React - Icons

## 📝 Ghi chú

### Chưa triển khai
- Upload ảnh thực tế (đang dùng mock paths)
- Tích hợp payment gateway
- Email notifications
- Forgot password
- Admin image upload UI
- Advanced search filters
- Product reviews
- Wishlist

### Để phát triển tiếp
1. Implement file upload với multer
2. Tích hợp VNPay/MoMo payment
3. Email service (SendGrid, AWS SES)
4. Image optimization (Sharp)
5. Rate limiting
6. API documentation (Swagger)
7. Unit & Integration tests
8. Docker containerization
9. CI/CD pipeline

## 🐛 Troubleshooting

### Backend không kết nối được MySQL
- Kiểm tra MySQL service đang chạy
- Kiểm tra DATABASE_URL trong `.env`
- Kiểm tra username/password MySQL

### Frontend không gọi được API
- Kiểm tra backend đang chạy tại port 5000
- Kiểm tra VITE_API_URL trong `.env`
- Kiểm tra CORS settings

### Token hết hạn liên tục
- Tăng JWT_EXPIRES_IN trong backend `.env`
- Clear localStorage trong browser

## 📄 License

MIT License

## 👨‍💻 Contact

Email: support@ushealthstore.com

---

**Note**: Đây là project mẫu cho mục đích học tập và demo. Cần bổ sung thêm các tính năng bảo mật và tối ưu hóa trước khi deploy production.
