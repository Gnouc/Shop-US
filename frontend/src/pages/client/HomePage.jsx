import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { productApi } from '@/api/productApi';
import { categoryApi } from '@/api/categoryApi';
import ProductCard from '@/components/common/ProductCard';
import Loading from '@/components/common/Loading';
import { ArrowRight, Package, Shield, Truck, HeadphonesIcon, Sparkles } from 'lucide-react';

// Animated Flag Component (CSS animation)
function AnimatedFlags() {
  return (
    <div className="flags-container">
      {/* US Flag */}
      <div className="flag flag-us">
        <svg viewBox="0 0 60 40" width="60" height="40" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
          <rect width="60" height="40" fill="#B22234"/>
          <rect y="3.08" width="60" height="3.08" fill="#fff"/>
          <rect y="9.23" width="60" height="3.08" fill="#fff"/>
          <rect y="15.38" width="60" height="3.08" fill="#fff"/>
          <rect y="21.54" width="60" height="3.08" fill="#fff"/>
          <rect y="27.69" width="60" height="3.08" fill="#fff"/>
          <rect y="33.85" width="60" height="3.08" fill="#fff"/>
          <rect width="24" height="21.54" fill="#3C3B6E"/>
          <g fill="#fff" fontSize="2.5">
            {[...Array(5)].map((_, row) => (
              [...Array(6)].map((_, col) => (
                <circle key={`s1-${row}-${col}`} cx={2 + col * 4} cy={1.8 + row * 4.3} r="0.8"/>
              ))
            ))}
          </g>
        </svg>
      </div>
      
      {/* VN Flag */}
      <div className="flag flag-vn">
        <svg viewBox="0 0 60 40" width="60" height="40" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
          <rect width="60" height="40" fill="#da251d"/>
          <polygon points="30,6 34.5,18.5 48,18.5 37,26 41,38 30,30 19,38 23,26 12,18.5 25.5,18.5" fill="#ffff00"/>
        </svg>
      </div>

      <style>{`
        .flags-container {
          position: fixed;
          top: 80px;
          right: 16px;
          z-index: 40;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .flag {
          animation: flagWave 3s ease-in-out infinite;
          transform-origin: left center;
          border-radius: 3px;
          overflow: hidden;
        }
        .flag-us { animation-delay: 0s; }
        .flag-vn { animation-delay: 0.5s; }
        @keyframes flagWave {
          0%, 100% { transform: rotate(0deg) skewY(0deg); }
          25% { transform: rotate(1.5deg) skewY(-1deg); }
          50% { transform: rotate(-0.5deg) skewY(0.5deg); }
          75% { transform: rotate(1deg) skewY(-0.5deg); }
        }
        @media (max-width: 768px) {
          .flags-container {
            top: 70px;
            right: 8px;
          }
          .flags-container svg {
            width: 40px;
            height: 26px;
          }
        }
      `}</style>
    </div>
  );
}

export default function HomePage() {
  const { data: productsData, isLoading: loadingProducts } = useQuery({
    queryKey: ['products', { page: 1, limit: 8 }],
    queryFn: () => productApi.getAll({ page: 1, limit: 8, sortBy: 'createdAt', order: 'desc' }),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryApi.getAll,
  });

  if (loadingProducts) return <Loading fullScreen />;

  const products = productsData?.data?.products || [];
  const categories = categoriesData?.data || [];

  return (
    <div>
      {/* Animated Flags */}
      <AnimatedFlags />

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #0369a1 0%, #0284c7 30%, #0ea5e9 70%, #38bdf8 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative elements */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.1,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        
        {/* Floating animated circles */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div className="float-circle c1" />
          <div className="float-circle c2" />
          <div className="float-circle c3" />
        </div>

        <div className="container mx-auto px-4 py-24" style={{ position: 'relative', zIndex: 2 }}>
          <div className="max-w-3xl">
            {/* Tag */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
              borderRadius: 20, padding: '6px 14px', marginBottom: 20,
              color: '#fff', fontSize: 13, fontWeight: 500,
            }}>
              <Sparkles size={14} />
              Chính hãng USA 🇺🇸 · Giao hàng toàn quốc 🇻🇳
            </div>

            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              fontWeight: 800, color: '#fff',
              lineHeight: 1.15, marginBottom: 16,
            }}>
              Sản phẩm sức khỏe<br />
              <span style={{ color: '#bae6fd' }}>chính hãng từ Mỹ</span>
            </h1>
            <p style={{ fontSize: 18, color: '#e0f2fe', marginBottom: 32, maxWidth: 520, lineHeight: 1.7 }}>
              Vitamin, thực phẩm chức năng, sữa dinh dưỡng và các sản phẩm chăm sóc sức khỏe hàng đầu được nhập khẩu trực tiếp.
            </p>
            <Link
              to="/products"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '14px 28px', background: '#fff', color: '#0284c7',
                borderRadius: 10, fontWeight: 700, fontSize: 16,
                textDecoration: 'none', boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.15)'; }}
            >
              Khám phá ngay
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Package, title: 'Chính hãng USA', desc: '100% nhập khẩu từ Mỹ', color: '#3b82f6' },
              { icon: Shield, title: 'Đảm bảo chất lượng', desc: 'Cam kết hoàn tiền 100%', color: '#10b981' },
              { icon: Truck, title: 'Ship toàn quốc', desc: 'Free ship đơn trên 500k', color: '#f59e0b' },
              { icon: HeadphonesIcon, title: 'Hỗ trợ 24/7', desc: 'Tư vấn nhiệt tình', color: '#8b5cf6' },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} style={{
                  textAlign: 'center', padding: '24px 16px',
                  borderRadius: 12, transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%',
                    background: `${feature.color}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 12px',
                  }}>
                    <Icon size={26} style={{ color: feature.color }} />
                  </div>
                  <h3 style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{feature.title}</h3>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-14" style={{ background: '#f8fafc' }}>
          <div className="container mx-auto px-4">
            <h2 style={{ fontSize: 28, fontWeight: 700, textAlign: 'center', marginBottom: 32 }}>
              Danh mục sản phẩm
            </h2>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
              {categories.slice(0, 10).map((category) => (
                <Link
                  key={category.id}
                  to={`/products?categoryId=${category.id}`}
                  style={{
                    display: 'block', textAlign: 'center',
                    padding: '20px 12px', background: '#fff',
                    borderRadius: 12, textDecoration: 'none', color: '#111',
                    border: '1px solid #e5e7eb',
                    transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(2,132,199,0.12)'; e.currentTarget.style.borderColor = '#0284c7'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#e5e7eb'; }}
                >
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%',
                    background: '#e0f2fe', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 10px',
                  }}>
                    <Package size={22} style={{ color: '#0284c7' }} />
                  </div>
                  <h3 style={{ fontWeight: 500, fontSize: 13, marginBottom: 2 }}>{category.name}</h3>
                  <p style={{ fontSize: 11, color: '#9ca3af' }}>
                    {category._count?.products || 0} sản phẩm
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-14">
        <div className="container mx-auto px-4">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
            <h2 style={{ fontSize: 28, fontWeight: 700 }}>Sản phẩm mới nhất</h2>
            <Link
              to="/products"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                color: '#0284c7', fontWeight: 500, fontSize: 14,
                textDecoration: 'none',
              }}
            >
              Xem tất cả <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '72px 0',
        background: 'linear-gradient(135deg, #0369a1 0%, #0284c7 50%, #0ea5e9 100%)',
        textAlign: 'center',
        position: 'relative',
      }}>
        <div className="container mx-auto px-4" style={{ position: 'relative', zIndex: 2 }}>
          <h2 style={{ fontSize: 30, fontWeight: 700, color: '#fff', marginBottom: 12 }}>
            Bạn cần tư vấn về sản phẩm?
          </h2>
          <p style={{ fontSize: 18, color: '#bae6fd', marginBottom: 32 }}>
            Đội ngũ chuyên gia luôn sẵn sàng hỗ trợ bạn
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 14 }}>
            <a
              href="tel:0834464618"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '12px 28px', background: '#fff', color: '#0284c7',
                borderRadius: 10, fontWeight: 700, fontSize: 16,
                textDecoration: 'none', boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
              }}
            >
              📞 0834 464 618
            </a>
            <a
              href="https://www.facebook.com/Gnouc.08/"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '12px 28px',
                background: 'rgba(255,255,255,0.15)', color: '#fff',
                borderRadius: 10, fontWeight: 600, fontSize: 16,
                textDecoration: 'none',
                border: '2px solid rgba(255,255,255,0.4)',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
              Facebook
            </a>
          </div>
        </div>
      </section>

      {/* Global animation styles */}
      <style>{`
        .float-circle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          animation: floatUp 12s ease-in-out infinite;
        }
        .c1 { width: 200px; height: 200px; top: 10%; left: 60%; animation-delay: 0s; }
        .c2 { width: 120px; height: 120px; top: 40%; left: 75%; animation-delay: 3s; }
        .c3 { width: 80px; height: 80px; top: 60%; left: 50%; animation-delay: 6s; }
        @keyframes floatUp {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.08; }
          50% { transform: translateY(-30px) scale(1.1); opacity: 0.15; }
        }
      `}</style>
    </div>
  );
}
