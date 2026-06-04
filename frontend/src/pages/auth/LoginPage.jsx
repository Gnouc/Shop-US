import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, App } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/api/authApi';
import { useAuthStore } from '@/stores/useAuthStore';

const { Title, Text } = Typography;

export default function LoginPage() {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [form] = Form.useForm();

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data.data.user, data.data.token);
      message.success('Đăng nhập thành công!');
      if (data.data.user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    },
    onError: (err) => {
      message.error(err.message || 'Đăng nhập thất bại!');
    },
  });

  const onFinish = (values) => {
    loginMutation.mutate(values);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5f6fa',
      padding: '24px 16px',
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2} style={{ marginBottom: 4 }}>Đăng nhập</Title>
          <Text type="secondary">Chào mừng bạn quay trở lại!</Text>
        </div>

        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            size="large"
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không hợp lệ' },
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: '#9ca3af' }} />}
                placeholder="your@email.com"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
                placeholder="••••••••"
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 16 }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loginMutation.isPending}
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">Chưa có tài khoản? </Text>
            <Link to="/register" style={{ fontWeight: 500 }}>
              Đăng ký ngay
            </Link>
          </div>

          <div style={{ textAlign: 'center', marginTop: 12 }}>
            <Link to="/" style={{ color: '#6b7280', fontSize: 14 }}>
              ← Về trang chủ
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
