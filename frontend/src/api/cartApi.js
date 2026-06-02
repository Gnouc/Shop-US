import axiosClient from './axiosClient';

export const cartApi = {
  getCart: () => {
    return axiosClient.get('/cart');
  },

  addItem: (data) => {
    return axiosClient.post('/cart/items', data);
  },

  updateItem: (itemId, quantity) => {
    return axiosClient.put(`/cart/items/${itemId}`, { quantity });
  },

  removeItem: (itemId) => {
    return axiosClient.delete(`/cart/items/${itemId}`);
  },

  clearCart: () => {
    return axiosClient.delete('/cart/clear');
  },
};
