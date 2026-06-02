import axiosClient from './axiosClient';

export const orderApi = {
  create: (data) => {
    return axiosClient.post('/orders', data);
  },

  getMyOrders: (params) => {
    return axiosClient.get('/orders/my-orders', { params });
  },

  getById: (id) => {
    return axiosClient.get(`/orders/${id}`);
  },

  cancelOrder: (id) => {
    return axiosClient.patch(`/orders/${id}/cancel`);
  },
};
