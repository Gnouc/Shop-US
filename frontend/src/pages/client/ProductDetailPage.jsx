import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { App, Alert, Breadcrumb, Button, Empty, Image, InputNumber, Skeleton, Tabs, Tag } from 'antd';
import {
  ChevronLeft,
  HeartPulse,
  PackageCheck,
  ShieldCheck,
  ShoppingCart,
  Truck,
} from 'lucide-react';
import { productApi } from '@/api/productApi';
import { cartApi } from '@/api/cartApi';
import { API_BASE_URL } from '@/api/axiosClient';
import { calculateDiscount, formatPrice } from '@/utils/format';
import ProductCard from '@/components/common/ProductCard';
import { useAuth } from '@/hooks/useAuth';

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http')) return imageUrl;
  return `${API_BASE_URL}${imageUrl}`;
};

const getProductImages = (product) => {
  const images = product?.images || [];
  const primary = images.find((img) => img.isPrimary);
  const ordered = primary ? [primary, ...images.filter((img) => img.id !== primary.id)] : images;
  return ordered.map((img) => ({ ...img, fullUrl: getImageUrl(img.imageUrl) })).filter((img) => img.fullUrl);
};

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['product-detail', slug],
    queryFn: () => productApi.getBySlug(slug),
    enabled: !!slug,
  });

  const product = data?.data?.product;
  const relatedProducts = data?.data?.relatedProducts || [];
  const images = useMemo(() => getProductImages(product), [product]);
  const currentImage = selectedImage || images[0]?.fullUrl;
  const price = Number(product?.price || 0);
  const salePrice = product?.salePrice ? Number(product.salePrice) : null;
  const finalPrice = salePrice || price;
  const discount = calculateDiscount(price, salePrice);
  const isOutOfStock = !product || product.stock <= 0;

  useEffect(() => {
    setQuantity(1);
    setSelectedImage(null);
  }, [slug]);

  const addToCartMutation = useMutation({
    mutationFn: (payload) => cartApi.addItem(payload),
    onSuccess: () => {
      message.success('Đã thêm sản phẩm vào giỏ hàng');
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (err) => {
      message.error(err.message || 'Không thể thêm sản phẩm vào giỏ hàng');
    },
  });

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      message.warning('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
      navigate('/login');
      return;
    }

    addToCartMutation.mutate({
      productId: product.id,
      quantity,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Skeleton active paragraph={{ rows: 12 }} />
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <Alert
            type="error"
            showIcon
            message="Không tìm thấy sản phẩm"
            description={error?.message || 'Sản phẩm không tồn tại hoặc hiện không được bán.'}
            action={
              <Button type="primary" onClick={() => navigate('/products')}>
                Về danh sách sản phẩm
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  const detailItems = [
    { label: 'Thương hiệu', value: product.brand || 'Đang cập nhật' },
    { label: 'Xuất xứ', value: product.origin || 'USA' },
    { label: 'Danh mục', value: product.category?.name || 'Đang cập nhật' },
    { label: 'Tình trạng', value: isOutOfStock ? 'Hết hàng' : `Còn ${product.stock} sản phẩm` },
  ];

  const tabs = [
    {
      key: 'description',
      label: 'Mô tả sản phẩm',
      children: (
        <div className="prose max-w-none text-gray-700">
          <p className="whitespace-pre-wrap leading-7">
            {product.description || 'Thông tin mô tả sản phẩm đang được cập nhật.'}
          </p>
        </div>
      ),
    },
    {
      key: 'details',
      label: 'Thông tin chi tiết',
      children: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {detailItems.map((item) => (
            <div key={item.label} className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <span className="text-gray-500">{item.label}</span>
              <span className="font-medium text-gray-900">{item.value}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: 'shipping',
      label: 'Giao hàng & đổi trả',
      children: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-lg border border-gray-200 p-4">
            <Truck className="mb-3 text-primary-600" size={24} />
            <h4 className="font-semibold">Giao hàng toàn quốc</h4>
            <p className="mt-1 text-sm text-gray-600">Đóng gói cẩn thận, giao nhanh theo khu vực.</p>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <ShieldCheck className="mb-3 text-primary-600" size={24} />
            <h4 className="font-semibold">Cam kết chính hãng</h4>
            <p className="mt-1 text-sm text-gray-600">Sản phẩm nhập khẩu và kiểm tra trước khi giao.</p>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <PackageCheck className="mb-3 text-primary-600" size={24} />
            <h4 className="font-semibold">Hỗ trợ đổi trả</h4>
            <p className="mt-1 text-sm text-gray-600">Hỗ trợ khi sản phẩm lỗi hoặc sai thông tin đơn hàng.</p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <Breadcrumb
          className="mb-5"
          items={[
            { title: <Link to="/">Trang chủ</Link> },
            { title: <Link to="/products">Sản phẩm</Link> },
            { title: product.name },
          ]}
        />

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary-600"
        >
          <ChevronLeft size={18} />
          Quay lại
        </button>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="card p-4">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-white">
              {discount > 0 && (
                <div className="absolute right-4 top-4 z-10 rounded bg-red-500 px-3 py-1 text-sm font-bold text-white">
                  -{discount}%
                </div>
              )}
              {currentImage ? (
                <Image
                  src={currentImage}
                  alt={product.name}
                  width="100%"
                  height="100%"
                  className="object-contain"
                  style={{ aspectRatio: '1 / 1', objectFit: 'contain', background: '#fff' }}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  Không có hình ảnh
                </div>
              )}
            </div>

            <div className="mt-4 grid grid-cols-5 gap-3">
              {images.length > 0 ? (
                images.map((img) => (
                  <button
                    key={img.id || img.fullUrl}
                    type="button"
                    onClick={() => setSelectedImage(img.fullUrl)}
                    className={`aspect-square overflow-hidden rounded-lg border bg-white p-1 transition ${
                      currentImage === img.fullUrl ? 'border-primary-600 ring-2 ring-primary-100' : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <img src={img.fullUrl} alt={product.name} className="h-full w-full object-contain" />
                  </button>
                ))
              ) : (
                <div className="col-span-5 rounded-lg border border-dashed border-gray-300 py-6 text-center text-sm text-gray-500">
                  Chưa có ảnh sản phẩm
                </div>
              )}
            </div>
          </div>

          <div className="card p-6">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {product.category?.name && <Tag color="blue">{product.category.name}</Tag>}
              {product.brand && <Tag>{product.brand}</Tag>}
              <Tag color={isOutOfStock ? 'red' : 'green'}>{isOutOfStock ? 'Hết hàng' : 'Đang bán'}</Tag>
            </div>

            <h1 className="text-3xl font-bold leading-tight text-gray-900">{product.name}</h1>

            <div className="mt-5 rounded-lg bg-primary-50 p-4">
              <div className="flex flex-wrap items-end gap-3">
                <span className="text-3xl font-bold text-red-600">{formatPrice(finalPrice)}</span>
                {salePrice && (
                  <span className="pb-1 text-base text-gray-400 line-through">{formatPrice(price)}</span>
                )}
              </div>
              {discount > 0 && (
                <p className="mt-1 text-sm text-red-600">Tiết kiệm {formatPrice(price - salePrice)}</p>
              )}
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-gray-200 p-3">
                <Truck className="mb-2 text-primary-600" size={22} />
                <div className="text-sm font-semibold">Giao nhanh</div>
                <div className="text-xs text-gray-500">Toàn quốc</div>
              </div>
              <div className="rounded-lg border border-gray-200 p-3">
                <ShieldCheck className="mb-2 text-primary-600" size={22} />
                <div className="text-sm font-semibold">Chính hãng</div>
                <div className="text-xs text-gray-500">Từ Mỹ</div>
              </div>
              <div className="rounded-lg border border-gray-200 p-3">
                <HeartPulse className="mb-2 text-primary-600" size={22} />
                <div className="text-sm font-semibold">Tư vấn</div>
                <div className="text-xs text-gray-500">Hỗ trợ 24/7</div>
              </div>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-5">
              <div className="mb-2 text-sm font-medium text-gray-700">Số lượng</div>
              <div className="flex flex-wrap items-center gap-3">
                <InputNumber
                  min={1}
                  max={Math.max(product.stock, 1)}
                  value={quantity}
                  onChange={(value) => setQuantity(value || 1)}
                  disabled={isOutOfStock}
                  style={{ width: 120 }}
                />
                <span className="text-sm text-gray-500">
                  {isOutOfStock ? 'Tạm hết hàng' : `Còn ${product.stock} sản phẩm`}
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                type="primary"
                size="large"
                icon={<ShoppingCart size={18} />}
                loading={addToCartMutation.isPending}
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className="flex-1"
              >
                Thêm vào giỏ
              </Button>
              <Button
                size="large"
                disabled={isOutOfStock}
                onClick={() => {
                  if (!isAuthenticated) {
                    message.warning('Vui lòng đăng nhập để mua hàng');
                    navigate('/login');
                    return;
                  }
                  addToCartMutation.mutate(
                    { productId: product.id, quantity },
                    { onSuccess: () => navigate('/cart') }
                  );
                }}
                className="flex-1"
              >
                Mua ngay
              </Button>
            </div>
          </div>
        </section>

        <section className="card mt-6 p-6">
          <Tabs items={tabs} />
        </section>

        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Sản phẩm liên quan</h2>
            <Link to="/products" className="font-medium text-primary-600 hover:text-primary-700">
              Xem tất cả
            </Link>
          </div>
          {relatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          ) : (
            <div className="card py-10">
              <Empty description="Chưa có sản phẩm liên quan" />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
