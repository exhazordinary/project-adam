import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
};

// Schedule API
export const scheduleAPI = {
  getAll: (params?: any) => api.get('/schedules', { params }),
  getById: (id: string) => api.get(`/schedules/${id}`),
  getToday: () => api.get('/schedules/today'),
  create: (data: any) => api.post('/schedules', data),
  update: (id: string, data: any) => api.put(`/schedules/${id}`, data),
  delete: (id: string) => api.delete(`/schedules/${id}`),
};

// Task API
export const taskAPI = {
  getAll: (params?: any) => api.get('/tasks', { params }),
  getUpcoming: () => api.get('/tasks/upcoming'),
  create: (data: any) => api.post('/tasks', data),
  update: (id: string, data: any) => api.put(`/tasks/${id}`, data),
  delete: (id: string) => api.delete(`/tasks/${id}`),
};

// Mood API
export const moodAPI = {
  getAll: (params?: any) => api.get('/mood', { params }),
  getLatest: () => api.get('/mood/latest'),
  getStats: (params?: any) => api.get('/mood/stats', { params }),
  create: (data: any) => api.post('/mood', data),
};

// Activity API
export const activityAPI = {
  getAll: (params?: any) => api.get('/activities', { params }),
  getById: (id: string) => api.get(`/activities/${id}`),
  getRecommended: (params?: any) => api.get('/activities/recommended', { params }),
  getStats: (params?: any) => api.get('/activities/stats', { params }),
  getUserActivities: (params?: any) => api.get('/activities/user', { params }),
  log: (data: any) => api.post('/activities/log', data),
};
