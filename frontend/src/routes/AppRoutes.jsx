import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ClientLayout from '@/components/layout/ClientLayout';
import AdminLayout from '@/components/layout/AdminLayout';
import ProtectedRoute from './ProtectedRoute';

// Client Pages
import HomePage from '@/pages/client/HomePage';
import ProductsPage from '@/pages/client/ProductsPage';
import CartPage from '@/pages/client/CartPage';

// Auth Pages
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';

// Admin Pages
import DashboardPage from '@/pages/admin/DashboardPage';
import AdminProductsPage from '@/pages/admin/AdminProductsPage';
import AdminCategoriesPage from '@/pages/admin/AdminCategoriesPage';
import AdminOrdersPage from '@/pages/admin/AdminOrdersPage';
import AdminUsersPage from '@/pages/admin/AdminUsersPage';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Client Routes */}
        <Route element={<ClientLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:slug" element={<div className="container mx-auto px-4 py-16 text-center text-gray-500">Product Detail - Coming Soon</div>} />

          <Route path="/cart" element={
            <ProtectedRoute><CartPage /></ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute><div className="container mx-auto px-4 py-16 text-center text-gray-500">Checkout - Coming Soon</div></ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute><div className="container mx-auto px-4 py-16 text-center text-gray-500">Orders - Coming Soon</div></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><div className="container mx-auto px-4 py-16 text-center text-gray-500">Profile - Coming Soon</div></ProtectedRoute>
          } />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="users" element={<AdminUsersPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
