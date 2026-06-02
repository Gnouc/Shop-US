import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/api/adminApi';
import { formatPrice, formatDate, getOrderStatusText } from '@/utils/format';
import {
  Table, Button, Input, Tag, Space, Drawer, Descriptions,
  Typography, Card, Divider, Tabs, Select, Popconfirm, App,
} from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const STATUS_COLOR = {
  PENDING: 'gold',
  CONFIRMED: 'blue',
  PROCESSING: 'cyan',
  SHIPPING: 'geekblue',
  DELIVERED: 'green',
  CANCELLED: 'red',
};

const NEXT_STATUS = {
  PENDING: 'CONFIRMED',
  CONFIRMED: 'PROCESSING',
  PROCESSING: 'SHIPPING',
  SHIPPING: 'DELIVERED',
};

const TAB_ITEMS = [
  { key: '', label: 'Tất cả' },
  { key: 'PENDING', label: 'Chờ xác nhận' },
  { key: 'CONFIRMED', label: 'Đã xác nhận' },
  { key: 'PROCESSING', label: 'Đang xử lý' },
  { key: 'SHIPPING', label: 'Đang giao' },
  { key: 'DELIVERED', label: 'Đã giao' },
  { key: 'CANCELLED', label: 'Đã hủy' },
];

export default function AdminOrdersPage() {
  const { message, modal } = App.useApp();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [drawerOrder, setDrawerOrder] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', { page, status, search }],
    queryFn: () => adminApi.getAllOrders({ page, limit: 15, status, search }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => adminApi.updateOrderStatus(id, status),
    onSuccess: () => {
      message.success('Cập nhật trạng thái thành công');
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      // Cập nhật order trong drawer nếu đang mở
      if (drawerOrder) {
        setDrawerOrder((prev) => ({
          ...prev,
          status: updateStatusMutation.variables?.status,
        }));
      }
    },
    onError: (err) => message.error(err.message),
  });

  const handleUpdateStatus = (id, newStatus) => {
    modal.confirm({
      title: 'Cập nhật trạng thái đơn hàng',
      content: `Chuyển sang "${getOrderStatusText(newStatus)}"?`,
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: () => updateStatusMutation.mutate({ id, status: newStatus }),
    });
  };

  const orders = data?.data?.orders || [];
  const pagination = data?.data?.pagination;

  const columns = [
    {
      title: 'Mã đơn',
      dataIndex: 'orderCode',
      width: 150,
      render: (code) => <Text strong style={{ color: '#0284c7' }}>#{code}</Text>,
    },
    {
      title: 'Khách hàng',
      key: 'customer',
      render: (_, r) => (
        <div>
          <Text strong>{r.customerName}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>{r.phone}</Text>
        </div>
      ),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      render: (v) => <Text strong>{formatPrice(v)}</Text>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (s) => <Tag color={STATUS_COLOR[s]}>{getOrderStatusText(s)}</Tag>,
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      render: (d) => <Text type="secondary">{formatDate(d)}</Text>,
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'right',
      width: 160,
      render: (_, record) => (
        <Space size="small">
          {NEXT_STATUS[record.status] && (
            <Button
              type="primary"
              size="small"
              onClick={() => handleUpdateStatus(record.id, NEXT_STATUS[record.status])}
              loading={updateStatusMutation.isPending}
            >
              {getOrderStatusText(NEXT_STATUS[record.status])}
            </Button>
          )}
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => setDrawerOrder(record)}
          />
        </Space>
      ),
    },
  ];

  // Order items columns (inside drawer)
  const itemColumns = [
    { title: 'Sản phẩm', dataIndex: 'productName' },
    { title: 'SL', dataIndex: 'quantity', width: 60, align: 'center' },
    { title: 'Đơn giá', dataIndex: 'price', render: (v) => formatPrice(v), align: 'right' },
    { title: 'Thành tiền', dataIndex: 'total', render: (v) => <Text strong>{formatPrice(v)}</Text>, align: 'right' },
  ];

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Title level={4} style={{ margin: 0 }}>Quản lý đơn hàng</Title>

      {/* Filter tabs */}
      <Card size="small">
        <Space wrap>
          <Tabs
            activeKey={status}
            onChange={(key) => { setStatus(key); setPage(1); }}
            items={TAB_ITEMS}
            size="small"
            style={{ marginBottom: -16 }}
          />
          <Input.Search
            placeholder="Tìm mã đơn, tên, SĐT..."
            allowClear
            style={{ width: 260 }}
            onSearch={(val) => { setSearch(val); setPage(1); }}
            enterButton={<SearchOutlined />}
          />
        </Space>
      </Card>

      {/* Table */}
      <Card size="small">
        <Table
          dataSource={orders}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          size="middle"
          pagination={{
            current: page,
            pageSize: 15,
            total: pagination?.total || 0,
            onChange: (p) => setPage(p),
            showTotal: (t) => `Tổng ${t} đơn hàng`,
            showSizeChanger: false,
          }}
          locale={{ emptyText: 'Không có đơn hàng nào' }}
          scroll={{ x: 800 }}
        />
      </Card>

      {/* Order Detail Drawer */}
      <Drawer
        title={`Chi tiết đơn #${drawerOrder?.orderCode}`}
        open={!!drawerOrder}
        onClose={() => setDrawerOrder(null)}
        width={600}
        extra={
          drawerOrder && NEXT_STATUS[drawerOrder.status] && (
            <Button
              type="primary"
              onClick={() => handleUpdateStatus(drawerOrder.id, NEXT_STATUS[drawerOrder.status])}
              loading={updateStatusMutation.isPending}
            >
              → {getOrderStatusText(NEXT_STATUS[drawerOrder.status])}
            </Button>
          )
        }
      >
        {drawerOrder && (
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {/* Info */}
            <Descriptions column={2} size="small" bordered>
              <Descriptions.Item label="Khách hàng">{drawerOrder.customerName}</Descriptions.Item>
              <Descriptions.Item label="Điện thoại">{drawerOrder.phone}</Descriptions.Item>
              <Descriptions.Item label="Địa chỉ" span={2}>{drawerOrder.address}</Descriptions.Item>
              {drawerOrder.note && (
                <Descriptions.Item label="Ghi chú" span={2}>{drawerOrder.note}</Descriptions.Item>
              )}
              <Descriptions.Item label="Ngày đặt">{formatDate(drawerOrder.createdAt)}</Descriptions.Item>
              <Descriptions.Item label="Thanh toán">
                {drawerOrder.paymentMethod} — {drawerOrder.paymentStatus}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái" span={2}>
                <Space>
                  <Tag color={STATUS_COLOR[drawerOrder.status]}>
                    {getOrderStatusText(drawerOrder.status)}
                  </Tag>
                  {drawerOrder.status !== 'CANCELLED' && drawerOrder.status !== 'DELIVERED' && (
                    <Popconfirm
                      title="Hủy đơn hàng này?"
                      onConfirm={() => {
                        handleUpdateStatus(drawerOrder.id, 'CANCELLED');
                        setDrawerOrder(null);
                      }}
                      okText="Hủy đơn"
                      cancelText="Không"
                      okButtonProps={{ danger: true }}
                    >
                      <Button size="small" danger>Hủy đơn</Button>
                    </Popconfirm>
                  )}
                </Space>
              </Descriptions.Item>
            </Descriptions>

            <Divider style={{ margin: '8px 0' }} />

            {/* Items */}
            <Title level={5}>Sản phẩm đặt hàng</Title>
            <Table
              dataSource={drawerOrder.items || []}
              columns={itemColumns}
              rowKey="id"
              pagination={false}
              size="small"
              summary={() => (
                <Table.Summary.Row>
                  <Table.Summary.Cell colSpan={3} align="right">
                    <Text strong>Tổng cộng:</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell align="right">
                    <Text strong style={{ color: '#0284c7', fontSize: 16 }}>
                      {formatPrice(drawerOrder.totalAmount)}
                    </Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              )}
            />
          </Space>
        )}
      </Drawer>
    </Space>
  );
}
