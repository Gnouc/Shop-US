import { Link, NavLink } from 'react-router-dom';
import { ShoppingCart, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { cartApi } from '@/api/cartApi';

export default function Header() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navLinkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 font-medium transition-colors ${
      isActive
        ? 'bg-primary-100 text-primary-700'
        : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
    }`;

  const { data: cartData } = useQuery({
    queryKey: ['cart'],
    queryFn: cartApi.getCart,
    enabled: isAuthenticated,
  });

  const cartCount = cartData?.data?.summary?.itemCount || 0;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
              US
            </div>
            <span className="text-xl font-bold text-gray-900">Health Store</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/" end className={navLinkClass}>
              Trang chủ
            </NavLink>
            <NavLink to="/products" className={navLinkClass}>
              Sản phẩm
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              Giới thiệu
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              Liên hệ
            </NavLink>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center space-x-1 text-gray-700 hover:text-primary-600"
                  >
                    <LayoutDashboard size={20} />
                    <span className="hidden md:inline">Admin</span>
                  </Link>
                )}
                
                <Link
                  to="/cart"
                  className="relative flex items-center space-x-1 text-gray-700 hover:text-primary-600"
                >
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>

                <div className="relative group">
                  <button className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
                    <User size={20} />
                    <span className="hidden md:inline">{user?.name}</span>
                  </button>
                  
                  <div className="absolute right-0 top-full hidden w-48 pt-2 group-hover:block">
                    <div className="bg-white rounded-lg shadow-lg py-2">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Tài khoản
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Đơn hàng
                      </Link>
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <LogOut size={16} />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  style={{
                    display: 'inline-flex', alignItems: 'center',
                    padding: '7px 16px', borderRadius: 8,
                    border: '1px solid #d1d5db', background: '#fff',
                    color: '#374151', fontWeight: 500, fontSize: 14,
                    textDecoration: 'none',
                  }}
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  style={{
                    display: 'inline-flex', alignItems: 'center',
                    padding: '7px 16px', borderRadius: 8,
                    background: '#0284c7', color: '#fff',
                    fontWeight: 500, fontSize: 14,
                    textDecoration: 'none',
                  }}
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
