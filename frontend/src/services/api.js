import axios from 'axios';
const VITE_API_URL = import.meta.env.VITE_API_URL || '/api';
const api = axios.create({
  baseURL: VITE_API_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('salahelec_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API endpoints
export const AuthAPI = {
  login: (payload) => api.post('/auth/login', payload),
  register: (payload) => api.post('/auth/register', payload),
  profile: () => api.get('/auth/me')
};

export const TaskAPI = {
  list: (params) => api.get('/tasks', { params }),
  mine: () => api.get('/tasks/mine'),
  details: (id) => api.get(`/tasks/${id}`),
  create: (payload) => api.post('/tasks', payload),
  update: (id, payload) => api.put(`/tasks/${id}`, payload),
  remove: (id) => api.delete(`/tasks/${id}`)
};

export const CommentAPI = {
  list: (taskId) => api.get(`/comments/${taskId}`),
  create: (taskId, payload) => api.post(`/comments/${taskId}`, payload)
};

export const UserAPI = {
  list: () => api.get('/users'),
  create: (payload) => api.post('/users', payload),
  updateProfile: (payload) => api.put('/users/profile', payload),
  update: (id, payload) => api.put(`/users/${id}`, payload),
  remove: (id) => api.delete(`/users/${id}`)
};

export const DashboardAPI = {
  stats: () => api.get('/dashboard')
};

export const LocationAPI = {
  submit: (payload) => api.post('/locations/submit', payload),
  list: (params) => api.get('/locations', { params }),
  latest: (employeeId) => api.get(`/locations/latest/${employeeId}`)
};

export default api;

