import axiosClient from './axiosClient';

export const adminApi = {
  getDashboard: () => {
    return axiosClient.get('/admin/dashboard');
  },

  // Orders
  getAllOrders: (params) => {
    return axiosClient.get('/admin/orders', { params });
  },

  updateOrderStatus: (id, status) => {
    return axiosClient.patch(`/admin/orders/${id}/status`, { status });
  },

  // Users
  getAllUsers: (params) => {
    return axiosClient.get('/admin/users', { params });
  },

  updateUserRole: (id, role) => {
    return axiosClient.patch(`/admin/users/${id}/role`, { role });
  },
};
