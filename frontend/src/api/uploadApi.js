import axiosClient from './axiosClient';

export const uploadApi = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return axiosClient.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  deleteImage: (filename) => {
    return axiosClient.delete('/upload/image', { data: { filename } });
  },
};
