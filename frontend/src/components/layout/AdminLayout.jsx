import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Avatar, Dropdown, Typography, Button, Space } from 'antd';
import {
  DashboardOutlined,
  AppstoreOutlined,
  TagsOutlined,
  ShoppingOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';

const { Sider, Header, Content } = Layout;
const { Text } = Typography;

const menuItems = [
  { key: '/admin/dashboard', label: 'Dashboard',      icon: <DashboardOutlined /> },
  { key: '/admin/products',  label: 'Sản phẩm',       icon: <AppstoreOutlined /> },
  { key: '/admin/categories',label: 'Danh mục',        icon: <TagsOutlined /> },
  { key: '/admin/orders',    label: 'Đơn hàng',        icon: <ShoppingOutlined /> },
  { key: '/admin/users',     label: 'Người dùng',      icon: <UserOutlined /> },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const userMenuItems = [
    {
      key: 'view-site',
      icon: <ExportOutlined />,
      label: <a href="/" target="_blank" rel="noreferrer">Xem website</a>,
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      danger: true,
      onClick: logout,
    },
  ];

  const currentPage = menuItems.find((m) => m.key === location.pathname)?.label || 'Admin';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        width={240}
        style={{
          background: '#111827',
          position: 'fixed',
          height: '100vh',
          left: 0,
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Logo */}
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? 0 : '0 20px',
            borderBottom: '1px solid #1f2937',
          }}
        >
          <Link to="/admin/dashboard" style={{ textDecoration: 'none' }}>
            <div style={{
              width: 36, height: 36,
              background: '#0284c7',
              borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700, fontSize: 14,
              flexShrink: 0,
            }}>
              US
            </div>
          </Link>
          {!collapsed && (
            <Text strong style={{ color: '#fff', marginLeft: 10, fontSize: 15 }}>
              Health Admin
            </Text>
          )}
        </div>

        {/* Navigation Menu */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: item.label,
            onClick: () => navigate(item.key),
          }))}
          style={{ background: '#111827', border: 'none', marginTop: 8 }}
        />
      </Sider>

      {/* Main layout */}
      <Layout style={{ marginLeft: collapsed ? 80 : 240, transition: 'margin-left 0.2s' }}>
        {/* Header */}
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            position: 'sticky',
            top: 0,
            zIndex: 99,
          }}
        >
          <Space>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: 18 }}
            />
            <Text strong style={{ fontSize: 16 }}>{currentPage}</Text>
          </Space>

          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space style={{ cursor: 'pointer' }}>
              <Avatar style={{ background: '#0284c7' }}>
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
              {!collapsed && <Text>{user?.name}</Text>}
            </Space>
          </Dropdown>
        </Header>

        {/* Content */}
        <Content style={{ padding: 24, background: '#f5f6fa' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
