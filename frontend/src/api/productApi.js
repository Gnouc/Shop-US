import axiosClient from './axiosClient';

export const productApi = {
  getAll: (params) => {
    return axiosClient.get('/products', { params });
  },

  getAllAdmin: (params) => {
    return axiosClient.get('/products/admin/all', { params });
  },

  getById: (id) => {
    return axiosClient.get(`/products/${id}`);
  },

  getBySlug: (slug) => {
    return axiosClient.get(`/products/slug/${slug}`);
  },

  create: (data) => {
    return axiosClient.post('/products', data);
  },

  update: (id, data) => {
    return axiosClient.put(`/products/${id}`, data);
  },

  updateStatus: (id, status) => {
    return axiosClient.patch(`/products/${id}/status`, { status });
  },

  delete: (id) => {
    return axiosClient.delete(`/products/${id}`);
  },
};
