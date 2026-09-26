import axios from 'axios';

// Dynamic Backend Base URL configuration (Local vs Production)
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach JWT token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('velystra_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Auth APIs
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);

// Student Profile API
export const saveStudentProfile = (data) => api.post('/student/profile', data);

// Campus League APIs
export const getChallenges = () => api.get('/challenges');
export const submitChallenge = (data) => api.post('/submissions', data);
export const getLeaderboard = () => api.get('/leaderboard');

// Super Admin Metrics
export const getAdminMetrics = () => api.get('/admin/metrics');

export default api;