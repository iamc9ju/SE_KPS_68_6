import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
});

// Since we are mocking auth, we can just omit headers or attach them if present in localStorage.
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const adminService = {
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data.data;
  },
  getPartners: async () => {
    const response = await api.get('/admin/partners');
    return response.data.data;
  },
  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data.data;
  },
};
