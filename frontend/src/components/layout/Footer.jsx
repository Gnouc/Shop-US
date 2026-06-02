import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">US Health Store</h3>
            <p className="text-sm mb-4">
              Cung cấp sản phẩm sức khỏe và chăm sóc cá nhân chính hãng từ Mỹ với giá tốt nhất.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-white">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products" className="hover:text-white">Sản phẩm</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white">Giới thiệu</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white">Liên hệ</Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="hover:text-white">Chính sách vận chuyển</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Danh mục</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products?category=1" className="hover:text-white">Thực phẩm chức năng</Link></li>
              <li><Link to="/products?category=2" className="hover:text-white">Vitamin tổng hợp</Link></li>
              <li><Link to="/products?category=6" className="hover:text-white">Sữa dinh dưỡng</Link></li>
              <li><Link to="/products?category=9" className="hover:text-white">Chăm sóc cá nhân</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Liên hệ</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span>123 Đường ABC, Quận 1, TP. HCM</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={16} />
                <span>0123 456 789</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={16} />
                <span>support@ushealthstore.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; 2024 US Health Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
