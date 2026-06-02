import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/api/adminApi';
import { formatPrice, formatDate, getOrderStatusText } from '@/utils/format';
import { Card, Row, Col, Table, Tag, Typography, Space, Statistic, Badge, Alert } from 'antd';
import {
  UserOutlined,
  AppstoreOutlined,
  ShoppingOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

const STATUS_COLOR = {
  PENDING: 'gold',
  CONFIRMED: 'blue',
  PROCESSING: 'cyan',
  SHIPPING: 'geekblue',
  DELIVERED: 'green',
  CANCELLED: 'red',
};

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: adminApi.getDashboard,
  });

  const stats = data?.data?.stats || {};
  const recentOrders = data?.data?.recentOrders || [];
  const lowStockProducts = data?.data?.lowStockProducts || [];

  const orderColumns = [
    {
      title: 'Mã đơn',
      dataIndex: 'orderCode',
      render: (code) => (
        <Link to="/admin/orders">
          <Text strong style={{ color: '#0284c7' }}>#{code}</Text>
        </Link>
      ),
    },
    {
      title: 'Khách hàng',
      render: (_, record) => (
        <div>
          <Text strong>{record.customerName}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>{record.user?.email}</Text>
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
      render: (status) => (
        <Tag color={STATUS_COLOR[status]}>{getOrderStatusText(status)}</Tag>
      ),
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      render: (d) => <Text type="secondary">{formatDate(d)}</Text>,
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* Stat Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={isLoading}>
            <Statistic
              title="Tổng người dùng"
              value={stats.totalUsers || 0}
              prefix={<UserOutlined style={{ color: '#3b82f6' }} />}
              valueStyle={{ color: '#3b82f6' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={isLoading}>
            <Statistic
              title="Tổng sản phẩm"
              value={stats.totalProducts || 0}
              prefix={<AppstoreOutlined style={{ color: '#10b981' }} />}
              valueStyle={{ color: '#10b981' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={isLoading}>
            <Statistic
              title="Tổng đơn hàng"
              value={stats.totalOrders || 0}
              prefix={<ShoppingOutlined style={{ color: '#8b5cf6' }} />}
              valueStyle={{ color: '#8b5cf6' }}
              suffix={
                stats.pendingOrders > 0 ? (
                  <Badge count={stats.pendingOrders} style={{ marginLeft: 8 }} />
                ) : null
              }
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {stats.pendingOrders || 0} chờ xác nhận
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={isLoading}>
            <Statistic
              title="Doanh thu"
              value={formatPrice(stats.totalRevenue || 0)}
              prefix={<DollarOutlined style={{ color: '#f59e0b' }} />}
              valueStyle={{ color: '#f59e0b', fontSize: 20 }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Recent Orders */}
        <Col xs={24} lg={16}>
          <Card
            title={
              <Space>
                <ClockCircleOutlined style={{ color: '#0284c7' }} />
                <span>Đơn hàng gần đây</span>
              </Space>
            }
            extra={<Link to="/admin/orders">Xem tất cả →</Link>}
            loading={isLoading}
          >
            <Table
              dataSource={recentOrders}
              columns={orderColumns}
              rowKey="id"
              pagination={false}
              size="small"
              locale={{ emptyText: 'Chưa có đơn hàng nào' }}
            />
          </Card>
        </Col>

        {/* Low Stock */}
        <Col xs={24} lg={8}>
          <Card
            title={
              <Space>
                <WarningOutlined style={{ color: '#f59e0b' }} />
                <span>Sắp hết hàng</span>
              </Space>
            }
            extra={<Link to="/admin/products">Xem tất cả →</Link>}
            loading={isLoading}
          >
            {lowStockProducts.length === 0 ? (
              <Alert message="Không có sản phẩm sắp hết hàng" type="success" showIcon />
            ) : (
              <Space direction="vertical" style={{ width: '100%' }} size="small">
                {lowStockProducts.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      background: '#fafafa',
                      borderRadius: 8,
                      border: '1px solid #f0f0f0',
                    }}
                  >
                    <div>
                      <Text strong style={{ fontSize: 13 }} ellipsis={{ tooltip: p.name }}>
                        {p.name}
                      </Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Còn lại: {p.stock}
                      </Text>
                    </div>
                    <Tag color={p.stock === 0 ? 'red' : 'orange'}>
                      {p.stock === 0 ? 'Hết hàng' : 'Sắp hết'}
                    </Tag>
                  </div>
                ))}
              </Space>
            )}
          </Card>
        </Col>
      </Row>
    </Space>
  );
}
