import { Link } from 'react-router-dom';
import { Phone, MapPin, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: '#111827', color: '#d1d5db' }}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 18, marginBottom: 14 }}>US Health Store</h3>
            <p style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>
              Cung cấp sản phẩm sức khỏe và chăm sóc cá nhân chính hãng từ Mỹ với giá tốt nhất thị trường.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <a
                href="https://www.facebook.com/Gnouc.08/"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: '#1877f2', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  color: '#fff', textDecoration: 'none',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                title="Facebook"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
              </a>
              <a
                href="https://zalo.me/0834464618"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: '#0068ff', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  color: '#fff', textDecoration: 'none',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                title="Zalo"
              >
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 14 }}>Liên kết nhanh</h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <li><Link to="/products" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: 14 }}>Sản phẩm</Link></li>
              <li><Link to="/about" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: 14 }}>Giới thiệu</Link></li>
              <li><Link to="/contact" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: 14 }}>Liên hệ</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 14 }}>Danh mục</h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <li><Link to="/products?categoryId=1" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: 14 }}>Thực phẩm chức năng</Link></li>
              <li><Link to="/products?categoryId=2" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: 14 }}>Vitamin tổng hợp</Link></li>
              <li><Link to="/products?categoryId=6" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: 14 }}>Sữa dinh dưỡng</Link></li>
              <li><Link to="/products?categoryId=9" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: 14 }}>Chăm sóc cá nhân</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 14 }}>Liên hệ tư vấn</h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Phone size={16} style={{ color: '#38bdf8', flexShrink: 0 }} />
                <a href="tel:0834464618" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: 14 }}>
                  0834 464 618
                </a>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#38bdf8" style={{ flexShrink: 0 }}>
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
                <a href="https://www.facebook.com/Gnouc.08/" target="_blank" rel="noreferrer" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: 14 }}>
                  facebook.com/Gnouc.08
                </a>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <MapPin size={16} style={{ color: '#38bdf8', flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 14 }}>TP. Đà Nẵng, Việt Nam</span>
              </li>
            </ul>

            {/* Hotline nổi bật */}
            <div style={{
              marginTop: 16, padding: '10px 14px',
              background: 'rgba(56,189,248,0.1)',
              border: '1px solid rgba(56,189,248,0.3)',
              borderRadius: 8,
            }}>
              <p style={{ fontSize: 12, color: '#7dd3fc', marginBottom: 4 }}>Hotline tư vấn:</p>
              <a href="tel:0834464618" style={{
                fontSize: 18, fontWeight: 700, color: '#38bdf8',
                textDecoration: 'none',
              }}>
                📞 0834 464 618
              </a>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid #1f2937',
          marginTop: 32, paddingTop: 24,
          textAlign: 'center', fontSize: 13, color: '#6b7280',
        }}>
          <p>© 2026 US Health Store. All rights reserved. 🇺🇸 🇻🇳</p>
        </div>
      </div>
    </footer>
  );
}
