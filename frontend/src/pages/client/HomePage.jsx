import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { productApi } from '@/api/productApi';
import { categoryApi } from '@/api/categoryApi';
import ProductCard from '@/components/common/ProductCard';
import Loading from '@/components/common/Loading';
import { ArrowRight, Package, Shield, Truck, HeadphonesIcon } from 'lucide-react';

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
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Sản phẩm sức khỏe chính hãng từ Mỹ
            </h1>
            <p className="text-xl mb-8 text-primary-100">
              Vitamin, thực phẩm chức năng, sữa dinh dưỡng và các sản phẩm chăm sóc sức khỏe hàng đầu
            </p>
            <Link
              to="/products"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 24px',
                background: '#fff',
                color: '#0284c7',
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 16,
                textDecoration: 'none',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f0f9ff'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
            >
              Khám phá ngay
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="text-primary-600" size={32} />
              </div>
              <h3 className="font-semibold mb-2">Sản phẩm chính hãng</h3>
              <p className="text-sm text-gray-600">100% nhập khẩu từ Mỹ</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-primary-600" size={32} />
              </div>
              <h3 className="font-semibold mb-2">Đảm bảo chất lượng</h3>
              <p className="text-sm text-gray-600">Cam kết hoàn tiền 100%</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="text-primary-600" size={32} />
              </div>
              <h3 className="font-semibold mb-2">Giao hàng toàn quốc</h3>
              <p className="text-sm text-gray-600">Miễn phí ship đơn trên 500k</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HeadphonesIcon className="text-primary-600" size={32} />
              </div>
              <h3 className="font-semibold mb-2">Hỗ trợ 24/7</h3>
              <p className="text-sm text-gray-600">Tư vấn nhiệt tình</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Danh mục sản phẩm</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories.slice(0, 10).map((category) => (
                <Link
                  key={category.id}
                  to={`/products?categoryId=${category.id}`}
                  className="card p-6 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Package className="text-primary-600" size={32} />
                  </div>
                  <h3 className="font-medium text-sm">{category.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {category._count?.products || 0} sản phẩm
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Sản phẩm mới nhất</h2>
            <Link to="/products" className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
              Xem tất cả
              <ArrowRight size={20} className="ml-1" />
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
      <section className="py-16 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Bạn cần tư vấn về sản phẩm?</h2>
          <p className="text-xl mb-8 text-primary-100">
            Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn
          </p>
          <Link
            to="/contact"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '10px 24px',
              background: '#fff',
              color: '#0284c7',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 16,
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f0f9ff'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
          >
            Liên hệ ngay
          </Link>
        </div>
      </section>
    </div>
  );
}
