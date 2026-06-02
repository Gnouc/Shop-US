import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { formatPrice, calculateDiscount } from '@/utils/format';
import { API_BASE_URL } from '@/api/axiosClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '@/api/cartApi';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';

// Helper: trả về URL đầy đủ cho ảnh
const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http')) return imageUrl;
  return `${API_BASE_URL}${imageUrl}`;
};

export default function ProductCard({ product }) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const addToCartMutation = useMutation({
    mutationFn: (data) => cartApi.addItem(data),
    onSuccess: () => {
      toast.success('Đã thêm vào giỏ hàng!');
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      toast.error(error.message || 'Không thể thêm vào giỏ hàng!');
    },
  });

  const handleAddToCart = (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng!');
      return;
    }

    addToCartMutation.mutate({
      productId: product.id,
      quantity: 1,
    });
  };

  const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];
  const discount = calculateDiscount(product.price, product.salePrice);

  return (
    <Link to={`/products/${product.slug}`} className="card group overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {primaryImage ? (
          <img
            src={getImageUrl(primaryImage.imageUrl)}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        
        {discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
            -{discount}%
          </div>
        )}

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-white text-gray-900 px-4 py-2 rounded font-bold">
              Hết hàng
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>
        
        {product.brand && (
          <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
        )}

        <div className="flex items-center justify-between mb-3">
          <div>
            {product.salePrice ? (
              <>
                <span className="text-lg font-bold text-red-600">
                  {formatPrice(product.salePrice)}
                </span>
                <span className="text-sm text-gray-400 line-through ml-2">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || addToCartMutation.isPending}
          className="btn btn-primary w-full flex items-center justify-center space-x-2"
        >
          <ShoppingCart size={18} />
          <span>Thêm vào giỏ</span>
        </button>
      </div>
    </Link>
  );
}
