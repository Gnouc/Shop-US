import { Link } from 'react-router-dom';
import {
  Heart, Shield, Truck, Award, Users,
  ArrowRight, CheckCircle, Globe, Sparkles,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div>
      {/* Hero Banner */}
      <section style={{
        background: 'linear-gradient(135deg, #0369a1 0%, #0284c7 40%, #0ea5e9 100%)',
        padding: '80px 0',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative */}
        <div style={{
          position: 'absolute', top: -60, right: -60,
          width: 300, height: 300, borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
        }} />
        <div style={{
          position: 'absolute', bottom: -40, left: -40,
          width: 200, height: 200, borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
        }} />

        <div className="container mx-auto px-4" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
            borderRadius: 20, padding: '6px 14px', marginBottom: 20,
            color: '#fff', fontSize: 13,
          }}>
            <Sparkles size={14} /> Về chúng tôi
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: '#fff', marginBottom: 16 }}>
            US Health Store
          </h1>
          <p style={{ fontSize: 18, color: '#bae6fd', maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>
            Kết nối sức khỏe Mỹ 🇺🇸 đến tay người Việt 🇻🇳
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section style={{ padding: '80px 0', background: '#fff' }}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12" style={{ alignItems: 'center' }}>
            {/* Text */}
            <div>
              <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16, color: '#111' }}>
                Câu chuyện của chúng tôi
              </h2>
              <p style={{ fontSize: 15, color: '#4b5563', lineHeight: 1.8, marginBottom: 16 }}>
                US Health Store được thành lập với sứ mệnh mang đến những sản phẩm sức khỏe
                <strong> chính hãng từ Mỹ</strong> với giá cả hợp lý nhất cho người tiêu dùng Việt Nam.
              </p>
              <p style={{ fontSize: 15, color: '#4b5563', lineHeight: 1.8, marginBottom: 24 }}>
                Chúng tôi hiểu rằng sức khỏe là tài sản quý giá nhất. Vì vậy, mỗi sản phẩm được nhập khẩu
                trực tiếp từ các thương hiệu uy tín hàng đầu tại Mỹ như Nature Made, NOW Foods, Nature's Bounty,
                Ensure, Similac... đảm bảo <strong>100% chính hãng</strong>, còn hạn sử dụng dài.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  'Nhập khẩu trực tiếp từ Mỹ, không qua trung gian',
                  'Cam kết hoàn tiền 100% nếu phát hiện hàng giả',
                  'Tư vấn miễn phí bởi đội ngũ chuyên gia dinh dưỡng',
                  'Giao hàng nhanh toàn quốc trong 2-5 ngày',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <CheckCircle size={20} style={{ color: '#10b981', flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 14, color: '#374151' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16,
            }}>
              {[
                { emoji: '🇺🇸', text: 'Nhập khẩu USA', bg: '#eff6ff' },
                { emoji: '✅', text: '100% Chính hãng', bg: '#ecfdf5' },
                { emoji: '🚚', text: 'Giao toàn quốc', bg: '#fffbeb' },
                { emoji: '💬', text: 'Tư vấn 24/7', bg: '#f5f3ff' },
              ].map((item, i) => (
                <div key={i} style={{
                  background: item.bg, borderRadius: 16, padding: '32px 20px',
                  textAlign: 'center',
                  transition: 'transform 0.2s',
                  cursor: 'default',
                }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <div style={{ fontSize: 40, marginBottom: 8 }}>{item.emoji}</div>
                  <p style={{ fontWeight: 600, fontSize: 14, color: '#374151' }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: '60px 0', background: '#f8fafc' }}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6" style={{ textAlign: 'center' }}>
            {[
              { number: '5000+', label: 'Khách hàng tin tưởng', icon: Users },
              { number: '500+', label: 'Sản phẩm chính hãng', icon: Award },
              { number: '50+', label: 'Thương hiệu Mỹ', icon: Globe },
              { number: '99%', label: 'Khách hài lòng', icon: Heart },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} style={{ padding: 20 }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%',
                    background: '#e0f2fe', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 12px',
                  }}>
                    <Icon size={24} style={{ color: '#0284c7' }} />
                  </div>
                  <p style={{ fontSize: 32, fontWeight: 800, color: '#0284c7', marginBottom: 4 }}>
                    {stat.number}
                  </p>
                  <p style={{ fontSize: 13, color: '#6b7280' }}>{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section style={{ padding: '80px 0', background: '#fff' }}>
        <div className="container mx-auto px-4">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
              Tại sao chọn US Health Store?
            </h2>
            <p style={{ fontSize: 15, color: '#6b7280', maxWidth: 500, margin: '0 auto' }}>
              Chúng tôi cam kết mang đến trải nghiệm mua sắm tốt nhất
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'An toàn & Tin cậy',
                desc: 'Tất cả sản phẩm được kiểm định chất lượng nghiêm ngặt. Có đầy đủ giấy tờ nhập khẩu và chứng nhận FDA.',
                color: '#10b981',
              },
              {
                icon: Truck,
                title: 'Giao hàng nhanh chóng',
                desc: 'Đóng gói cẩn thận, giao hàng trong 2-5 ngày. Miễn phí ship cho đơn hàng trên 500.000đ.',
                color: '#f59e0b',
              },
              {
                icon: Heart,
                title: 'Chăm sóc tận tâm',
                desc: 'Đội ngũ tư vấn am hiểu sản phẩm, luôn sẵn sàng hỗ trợ bạn lựa chọn sản phẩm phù hợp nhất.',
                color: '#8b5cf6',
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} style={{
                  padding: 32, borderRadius: 16,
                  border: '1px solid #e5e7eb',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'default',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.08)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{
                    width: 52, height: 52, borderRadius: 12,
                    background: `${item.color}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 20,
                  }}>
                    <Icon size={26} style={{ color: item.color }} />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>{item.title}</h3>
                  <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section style={{
        padding: '72px 0',
        background: 'linear-gradient(135deg, #0369a1 0%, #0284c7 50%, #0ea5e9 100%)',
        textAlign: 'center',
      }}>
        <div className="container mx-auto px-4">
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 12 }}>
            Liên hệ với chúng tôi ngay hôm nay
          </h2>
          <p style={{ fontSize: 16, color: '#bae6fd', marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>
            Đội ngũ tư vấn sẵn sàng hỗ trợ bạn chọn sản phẩm phù hợp nhất
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16 }}>
            {/* Phone */}
            <a
              href="tel:0834464618"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '14px 28px', background: '#fff', color: '#0284c7',
                borderRadius: 10, fontWeight: 700, fontSize: 16,
                textDecoration: 'none', boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              📞 0834 464 618
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/Gnouc.08/"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '14px 28px', background: 'rgba(255,255,255,0.15)',
                color: '#fff', borderRadius: 10, fontWeight: 600, fontSize: 16,
                textDecoration: 'none', border: '2px solid rgba(255,255,255,0.4)',
                backdropFilter: 'blur(4px)',
                transition: 'transform 0.2s, background 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = 'rgba(255,255,255,0.25)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
              </svg>
              Facebook
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
