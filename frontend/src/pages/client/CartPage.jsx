import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { cartApi } from '@/api/cartApi';
import { API_BASE_URL } from '@/api/axiosClient';
import { formatPrice } from '@/utils/format';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import Loading from '@/components/common/Loading';
import toast from 'react-hot-toast';

export default function CartPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: cartApi.getCart,
  });

  const updateMutation = useMutation({
    mutationFn: ({ itemId, quantity }) => cartApi.updateItem(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const removeMutation = useMutation({
    mutationFn: cartApi.removeItem,
    onSuccess: () => {
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (isLoading) return <Loading fullScreen />;

  const cart = data?.data?.cart;
  const summary = data?.data?.summary;
  const items = cart?.items || [];

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Giỏ hàng trống</h2>
          <p className="text-gray-600 mb-6">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục</p>
          <Link to="/products" className="btn btn-primary">
            Mua sắm ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Giỏ hàng của bạn</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item) => {
                const product = item.product;
                const price = product.salePrice || product.price;
                const primaryImage = product.images?.[0];

                return (
                  <div key={item.id} className="card p-4">
                    <div className="flex gap-4">
                      <Link
                        to={`/products/${product.slug}`}
                        className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded overflow-hidden"
                      >
                        {primaryImage ? (
                          <img
                            src={primaryImage.imageUrl?.startsWith('http') ? primaryImage.imageUrl : `${API_BASE_URL}${primaryImage.imageUrl}`}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}
                      </Link>

                      <div className="flex-1">
                        <Link
                          to={`/products/${product.slug}`}
                          className="font-semibold text-gray-900 hover:text-primary-600 mb-1 block"
                        >
                          {product.name}
                        </Link>
                        {product.brand && (
                          <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
                        )}
                        <p className="text-lg font-bold text-gray-900">
                          {formatPrice(price)}
                        </p>
                      </div>

                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => removeMutation.mutate(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={20} />
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateMutation.mutate({
                                itemId: item.id,
                                quantity: item.quantity - 1,
                              })
                            }
                            disabled={item.quantity <= 1}
                            className="btn btn-outline p-2 disabled:opacity-50"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-12 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateMutation.mutate({
                                itemId: item.id,
                                quantity: item.quantity + 1,
                              })
                            }
                            disabled={item.quantity >= product.stock}
                            className="btn btn-outline p-2 disabled:opacity-50"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <p className="text-lg font-bold text-primary-600">
                          {formatPrice(price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-20">
              <h3 className="font-semibold text-lg mb-4">Tổng đơn hàng</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tạm tính</span>
                  <span className="font-medium">{formatPrice(summary?.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí vận chuyển</span>
                  <span className="font-medium">Tính sau</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg">
                  <span className="font-semibold">Tổng cộng</span>
                  <span className="font-bold text-primary-600">
                    {formatPrice(summary?.subtotal)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="btn btn-primary w-full mb-3"
              >
                Thanh toán
              </button>

              <Link to="/products" className="btn btn-outline w-full">
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
