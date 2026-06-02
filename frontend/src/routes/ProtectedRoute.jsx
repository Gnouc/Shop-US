import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, token } = useAuthStore();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return children;
}
