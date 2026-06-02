import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi } from '@/api/productApi';
import { categoryApi } from '@/api/categoryApi';
import { API_BASE_URL } from '@/api/axiosClient';
import { formatPrice } from '@/utils/format';
import ProductFormModal from '@/components/admin/ProductFormModal';
import {
  Table, Button, Input, Select, Space, Tag, Popconfirm,
  Typography, Card, Avatar, Tooltip, App,
} from 'antd';
import {
  PlusOutlined, SearchOutlined, EditOutlined,
  DeleteOutlined, EyeOutlined, EyeInvisibleOutlined,
} from '@ant-design/icons';

const { Title } = Typography;

export default function AdminProductsPage() {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState(undefined);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', { page, search, categoryId }],
    queryFn: () => productApi.getAll({ page, limit: 10, search, categoryId }),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: productApi.delete,
    onSuccess: () => {
      message.success('Đã xóa sản phẩm');
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
    onError: (err) => message.error(err.message || 'Xóa thất bại'),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }) => productApi.updateStatus(id, status),
    onSuccess: () => {
      message.success('Đã cập nhật trạng thái');
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
    onError: (err) => message.error(err.message),
  });

  const handleToggleStatus = (product) => {
    const newStatus = product.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    toggleStatusMutation.mutate({ id: product.id, status: newStatus });
  };

  const products = data?.data?.products || [];
  const pagination = data?.data?.pagination;
  const categories = categoriesData?.data || [];

  const categoryOptions = [
    { value: undefined, label: 'Tất cả danh mục' },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];

  const columns = [
    {
      title: 'Sản phẩm',
      key: 'product',
      width: 300,
      render: (_, record) => {
        const img = record.images?.[0];
        const imgUrl = img?.imageUrl?.startsWith('http')
          ? img.imageUrl
          : img ? `${API_BASE_URL}${img.imageUrl}` : null;
        return (
          <Space>
            <Avatar
              src={imgUrl}
              shape="square"
              size={48}
              style={{ background: '#f0f0f0', flexShrink: 0 }}
            >
              {!imgUrl && record.name?.charAt(0)}
            </Avatar>
            <div>
              <div style={{ fontWeight: 500, maxWidth: 220 }} className="line-clamp-1">
                {record.name}
              </div>
              <div style={{ fontSize: 12, color: '#888' }}>{record.brand}</div>
            </div>
          </Space>
        );
      },
    },
    {
      title: 'Danh mục',
      dataIndex: ['category', 'name'],
      width: 150,
    },
    {
      title: 'Giá',
      key: 'price',
      width: 150,
      render: (_, record) => (
        record.salePrice ? (
          <div>
            <div style={{ color: '#ef4444', fontWeight: 600 }}>{formatPrice(record.salePrice)}</div>
            <div style={{ fontSize: 12, color: '#aaa', textDecoration: 'line-through' }}>
              {formatPrice(record.price)}
            </div>
          </div>
        ) : (
          <div style={{ fontWeight: 500 }}>{formatPrice(record.price)}</div>
        )
      ),
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stock',
      width: 100,
      render: (stock) => (
        <span style={{ color: stock < 10 ? '#ef4444' : 'inherit', fontWeight: 500 }}>
          {stock}
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 120,
      render: (status) => (
        <Tag color={status === 'ACTIVE' ? 'green' : 'red'}>
          {status === 'ACTIVE' ? 'Đang bán' : 'Ẩn'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 130,
      align: 'right',
      render: (_, record) => (
        <Space>
          <Tooltip title={record.status === 'ACTIVE' ? 'Ẩn sản phẩm' : 'Hiện sản phẩm'}>
            <Button
              type="text"
              icon={record.status === 'ACTIVE' ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              onClick={() => handleToggleStatus(record)}
              loading={toggleStatusMutation.isPending}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              style={{ color: '#3b82f6' }}
              onClick={() => { setEditProduct(record); setShowModal(true); }}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa sản phẩm"
            description={`Xóa "${record.name}"?`}
            onConfirm={() => deleteMutation.mutate(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                loading={deleteMutation.isPending}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={4} style={{ margin: 0 }}>Quản lý sản phẩm</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => { setEditProduct(null); setShowModal(true); }}
        >
          Thêm sản phẩm
        </Button>
      </div>

      {/* Filters */}
      <Card size="small">
        <Space wrap>
          <Input.Search
            placeholder="Tìm tên, thương hiệu..."
            allowClear
            style={{ width: 280 }}
            onSearch={(val) => { setSearch(val); setPage(1); }}
            enterButton={<SearchOutlined />}
          />
          <Select
            options={categoryOptions}
            value={categoryId}
            onChange={(val) => { setCategoryId(val); setPage(1); }}
            style={{ width: 200 }}
            placeholder="Lọc theo danh mục"
          />
        </Space>
      </Card>

      {/* Table */}
      <Card size="small" style={{ padding: 0 }}>
        <Table
          dataSource={products}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          size="middle"
          pagination={{
            current: page,
            pageSize: 10,
            total: pagination?.total || 0,
            onChange: (p) => setPage(p),
            showSizeChanger: false,
            showTotal: (total) => `Tổng ${total} sản phẩm`,
          }}
          locale={{ emptyText: 'Không có sản phẩm nào' }}
          scroll={{ x: 900 }}
        />
      </Card>

      {showModal && (
        <ProductFormModal
          product={editProduct}
          categories={categories}
          onClose={() => setShowModal(false)}
        />
      )}
    </Space>
  );
}
