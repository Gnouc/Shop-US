import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/api/authApi';
import { useAuthStore } from '@/stores/useAuthStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const { user, token, setAuth, logout: logoutStore } = useAuthStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data.data.user, data.data.token);
      toast.success('Đăng nhập thành công!');
      
      if (data.data.user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Đăng nhập thất bại!');
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setAuth(data.data.user, data.data.token);
      toast.success('Đăng ký thành công!');
      navigate('/');
    },
    onError: (error) => {
      toast.error(error.message || 'Đăng ký thất bại!');
    },
  });

  const logout = () => {
    logoutStore();
    queryClient.clear();
    toast.success('Đã đăng xuất!');
    navigate('/login');
  };

  return {
    user,
    token,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'ADMIN',
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  };
};
