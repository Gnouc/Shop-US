# US Health Store - Frontend

Frontend application cho website bán sản phẩm sức khỏe và chăm sóc cá nhân từ Mỹ.

## 🚀 Công nghệ

- **React 18** - UI Library
- **Vite** - Build tool & Dev server
- **React Router** - Routing
- **TanStack Query** (React Query) - Server state management
- **Zustand** - Client state management
- **Axios** - HTTP client
- **React Hook Form** + **Zod** - Form validation
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

## 📁 Cấu trúc thư mục

```
frontend/
├── src/
│   ├── api/              # API clients
│   │   ├── axiosClient.js
│   │   ├── authApi.js
│   │   ├── productApi.js
│   │   ├── categoryApi.js
│   │   ├── cartApi.js
│   │   ├── orderApi.js
│   │   └── adminApi.js
│   ├── components/       # React components
│   │   ├── common/       # Shared components
│   │   └── layout/       # Layout components
│   ├── hooks/            # Custom hooks
│   │   └── useAuth.js
│   ├── pages/            # Page components
│   │   ├── client/       # Client pages
│   │   ├── admin/        # Admin pages
│   │   └── auth/         # Auth pages
│   ├── routes/           # Routing config
│   │   ├── AppRoutes.jsx
│   │   └── ProtectedRoute.jsx
│   ├── stores/           # Zustand stores
│   │   ├── useAuthStore.js
│   │   └── useCartStore.js
│   ├── utils/            # Utility functions
│   │   └── format.js
│   ├── App.jsx           # Root component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
└── package.json
```

## 🛠️ Cài đặt

### 1. Cài dependencies

```bash
cd frontend
npm install
```

### 2. Cấu hình môi trường

Tạo file `.env` từ `.env.example`:

```bash
copy .env.example .env
```

Sửa nội dung file `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Chạy development server

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: `http://localhost:5173`

### 4. Build production

```bash
npm run build
```

Build files sẽ được tạo trong thư mục `dist/`

### 5. Preview production build

```bash
npm run preview
```

## 📄 Pages đã triển khai

### Client Pages
- ✅ Trang chủ (`/`)
- ✅ Danh sách sản phẩm (`/products`)
- ⏳ Chi tiết sản phẩm (`/products/:slug`)
- ✅ Giỏ hàng (`/cart`)
- ⏳ Đặt hàng (`/checkout`)
- ⏳ Lịch sử đơn hàng (`/orders`)
- ⏳ Tài khoản (`/profile`)

### Auth Pages
- ✅ Đăng nhập (`/login`)
- ✅ Đăng ký (`/register`)

### Admin Pages
- ⏳ Dashboard (`/admin/dashboard`)
- ⏳ Quản lý sản phẩm (`/admin/products`)
- ⏳ Quản lý danh mục (`/admin/categories`)
- ⏳ Quản lý đơn hàng (`/admin/orders`)
- ⏳ Quản lý người dùng (`/admin/users`)

## 🔑 Features đã triển khai

### Authentication
- Đăng nhập / Đăng ký
- JWT token management
- Protected routes
- Auto redirect khi token hết hạn

### Products
- Danh sách sản phẩm với pagination
- Filter theo category
- Search sản phẩm
- Sort (giá, tên, ngày tạo)
- Hiển thị giá sale và discount %

### Shopping Cart
- Thêm / xóa / cập nhật số lượng
- Tính tổng tiền tự động
- Sync với backend
- Hiển thị số lượng items trên header

### UI/UX
- Responsive design
- Loading states
- Error handling
- Toast notifications
- Form validation với Zod

## 🎨 Tailwind CSS Classes

Custom classes được định nghĩa trong `src/index.css`:

- `.btn` - Base button style
- `.btn-primary` - Primary button
- `.btn-secondary` - Secondary button
- `.btn-outline` - Outlined button
- `.btn-danger` - Danger button
- `.input` - Input field style
- `.card` - Card container
- `.badge` - Badge styles
- `.badge-success`, `.badge-warning`, `.badge-danger`, `.badge-info`

## 📦 State Management

### Zustand Stores

**useAuthStore** - Authentication state
- `user`: Current user object
- `token`: JWT token
- `setAuth()`: Set user and token
- `logout()`: Clear auth state
- `isAuthenticated()`: Check if logged in
- `isAdmin()`: Check if admin

**useCartStore** - Cart count (local)
- `cartCount`: Number of items
- `setCartCount()`: Set count
- `incrementCart()`: Increase count
- `decrementCart()`: Decrease count
- `resetCart()`: Reset to 0

### React Query

Toàn bộ server state được quản lý bởi TanStack Query:
- Products listing
- Product details
- Categories
- Cart items
- Orders
- Admin data

## 🔧 Utils

### format.js

- `formatPrice(price)` - Format giá VNĐ
- `formatDate(date)` - Format datetime
- `formatDateShort(date)` - Format date only
- `getOrderStatusText(status)` - Text hiển thị trạng thái đơn
- `getOrderStatusBadge(status)` - Badge class cho trạng thái
- `truncateText(text, maxLength)` - Cắt text dài
- `calculateDiscount(price, salePrice)` - Tính % giảm giá

## 🚧 TODO - Pages cần hoàn thiện

1. **Product Detail Page** - Trang chi tiết sản phẩm
2. **Checkout Page** - Trang đặt hàng
3. **Orders Page** - Lịch sử đơn hàng
4. **Profile Page** - Trang tài khoản
5. **Admin Dashboard** - Thống kê tổng quan
6. **Admin Products Management** - CRUD sản phẩm
7. **Admin Categories Management** - CRUD danh mục
8. **Admin Orders Management** - Quản lý đơn hàng
9. **Admin Users Management** - Quản lý người dùng

## 📝 Lưu ý

- Đảm bảo backend API đang chạy tại `http://localhost:5000`
- Token được lưu trong localStorage
- Các routes admin yêu cầu role ADMIN
- Interceptor tự động redirect về login khi 401

## 🐛 Debug

### Check API connection
```javascript
// In browser console
console.log(import.meta.env.VITE_API_URL);
```

### Clear auth state
```javascript
localStorage.removeItem('token');
localStorage.removeItem('user');
```

### View React Query cache
Install React Query Devtools nếu cần debug:

```bash
npm install @tanstack/react-query-devtools
```

## 📄 License

MIT
