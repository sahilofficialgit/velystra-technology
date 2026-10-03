import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Automatically attach token to requests if available
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('velystra_token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req; // <-- Yeh 'req' hona chahiye, 'req.headers' nahi!
});

export default API;