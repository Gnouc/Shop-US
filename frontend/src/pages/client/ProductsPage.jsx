import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { productApi } from '@/api/productApi';
import { categoryApi } from '@/api/categoryApi';
import ProductCard from '@/components/common/ProductCard';
import Pagination from '@/components/common/Pagination';
import Loading from '@/components/common/Loading';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [showFilters, setShowFilters] = useState(false);

  const page = parseInt(searchParams.get('page') || '1');
  const categoryId = searchParams.get('categoryId');
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const order = searchParams.get('order') || 'desc';

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', { page, categoryId, search, sortBy, order }],
    queryFn: () => productApi.getAll({ 
      page, 
      limit: 12, 
      categoryId, 
      search: searchParams.get('search'),
      sortBy, 
      order 
    }),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryApi.getAll,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleCategoryChange = (catId) => {
    const params = new URLSearchParams(searchParams);
    if (catId) {
      params.set('categoryId', catId);
    } else {
      params.delete('categoryId');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleSortChange = (newSortBy, newOrder) => {
    const params = new URLSearchParams(searchParams);
    params.set('sortBy', newSortBy);
    params.set('order', newOrder);
    params.set('page', '1');
    setSearchParams(params);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const products = productsData?.data?.products || [];
  const pagination = productsData?.data?.pagination;
  const categories = categoriesData?.data || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Sản phẩm</h1>
          
          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <div className="flex-1 relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm sản phẩm..."
                className="input input-with-left-icon w-full"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Tìm kiếm
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-outline md:hidden"
            >
              <SlidersHorizontal size={20} />
            </button>
          </form>

          {/* Sort */}
          <div className="flex items-center gap-3">
            <span className="flex-shrink-0 whitespace-nowrap text-sm text-gray-600">Sắp xếp:</span>
            <select
              value={`${sortBy}-${order}`}
              onChange={(e) => {
                const [newSortBy, newOrder] = e.target.value.split('-');
                handleSortChange(newSortBy, newOrder);
              }}
              className="input min-w-0 flex-1"
            >
              <option value="createdAt-desc">Mới nhất</option>
              <option value="createdAt-asc">Cũ nhất</option>
              <option value="price-asc">Giá thấp đến cao</option>
              <option value="price-desc">Giá cao đến thấp</option>
              <option value="name-asc">Tên A-Z</option>
              <option value="name-desc">Tên Z-A</option>
            </select>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <aside className={`
            w-full md:w-64 flex-shrink-0
            ${showFilters ? 'block' : 'hidden md:block'}
          `}>
            <div className="card p-4 sticky top-20">
              <h3 className="font-semibold mb-4">Danh mục</h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryChange(null)}
                  className={`w-full text-left px-3 py-2 rounded transition-colors ${
                    !categoryId ? 'bg-primary-100 text-primary-700 font-medium' : 'hover:bg-gray-100'
                  }`}
                >
                  Tất cả
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id.toString())}
                    className={`w-full text-left px-3 py-2 rounded transition-colors ${
                      categoryId === cat.id.toString()
                        ? 'bg-primary-100 text-primary-700 font-medium'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {cat.name}
                    <span className="text-sm text-gray-500 ml-2">
                      ({cat._count?.products || 0})
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <Loading />
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {pagination && pagination.totalPages > 1 && (
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
