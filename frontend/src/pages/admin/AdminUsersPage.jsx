import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/api/adminApi';
import { formatDateShort } from '@/utils/format';
import {
  Table, Button, Input, Tag, Space, Avatar,
  Typography, Card, Tabs, Popconfirm, App,
} from 'antd';
import {
  SearchOutlined, UserOutlined, CrownOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const ROLE_TABS = [
  { key: '', label: 'Tất cả' },
  { key: 'USER', label: 'User' },
  { key: 'ADMIN', label: 'Admin' },
];

export default function AdminUsersPage() {
  const { message, modal } = App.useApp();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', { page, search, role }],
    queryFn: () => adminApi.getAllUsers({ page, limit: 15, search, role }),
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }) => adminApi.updateUserRole(id, role),
    onSuccess: () => {
      message.success('Đã cập nhật phân quyền');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (err) => message.error(err.message),
  });

  const handleToggleRole = (user) => {
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    const isGrant = newRole === 'ADMIN';
    modal.confirm({
      title: isGrant ? 'Cấp quyền Admin' : 'Thu hồi quyền Admin',
      content: isGrant
        ? `Cấp quyền ADMIN cho "${user.name}"? Người này sẽ có toàn quyền quản trị.`
        : `Thu hồi quyền ADMIN của "${user.name}"?`,
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      okButtonProps: { danger: !isGrant },
      onOk: () => updateRoleMutation.mutate({ id: user.id, role: newRole }),
    });
  };

  const users = data?.data?.users || [];
  const pagination = data?.data?.pagination;

  const columns = [
    {
      title: 'Người dùng',
      key: 'user',
      render: (_, record) => (
        <Space>
          <Avatar style={{ background: '#0284c7' }}>
            {record.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Text strong>{record.name}</Text>
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      render: (email) => <Text type="secondary">{email}</Text>,
    },
    {
      title: 'Điện thoại',
      dataIndex: 'phone',
      render: (phone) => <Text>{phone || '—'}</Text>,
    },
    {
      title: 'Đơn hàng',
      key: 'orders',
      width: 110,
      render: (_, record) => (
        <Tag color="blue">{record._count?.orders || 0} đơn</Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      width: 120,
      render: (d) => <Text type="secondary">{formatDateShort(d)}</Text>,
    },
    {
      title: 'Phân quyền',
      dataIndex: 'role',
      width: 120,
      render: (role) => (
        <Tag
          icon={role === 'ADMIN' ? <CrownOutlined /> : <UserOutlined />}
          color={role === 'ADMIN' ? 'gold' : 'blue'}
        >
          {role}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 140,
      align: 'right',
      render: (_, record) => (
        <Button
          size="small"
          danger={record.role === 'ADMIN'}
          type={record.role === 'ADMIN' ? 'default' : 'primary'}
          ghost={record.role !== 'ADMIN'}
          onClick={() => handleToggleRole(record)}
          loading={updateRoleMutation.isPending}
        >
          {record.role === 'ADMIN' ? 'Thu hồi Admin' : 'Cấp Admin'}
        </Button>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={4} style={{ margin: 0 }}>Quản lý người dùng</Title>
        <Text type="secondary">
          Tổng: <Text strong>{pagination?.total || 0}</Text> người dùng
        </Text>
      </div>

      <Card size="small">
        <Space wrap>
          <Tabs
            activeKey={role}
            onChange={(key) => { setRole(key); setPage(1); }}
            items={ROLE_TABS}
            size="small"
            style={{ marginBottom: -16 }}
          />
          <Input.Search
            placeholder="Tìm theo tên, email, SĐT..."
            allowClear
            style={{ width: 280 }}
            onSearch={(val) => { setSearch(val); setPage(1); }}
            enterButton={<SearchOutlined />}
          />
        </Space>
      </Card>

      <Card size="small">
        <Table
          dataSource={users}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          size="middle"
          pagination={{
            current: page,
            pageSize: 15,
            total: pagination?.total || 0,
            onChange: (p) => setPage(p),
            showTotal: (t) => `Tổng ${t} người dùng`,
            showSizeChanger: false,
          }}
          locale={{ emptyText: 'Không có người dùng nào' }}
          scroll={{ x: 700 }}
        />
      </Card>
    </Space>
  );
}
