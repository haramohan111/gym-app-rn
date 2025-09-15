// api.js
import axios from 'axios';
// import { logout } from '../features/auth/authSlice';
const API_URL = import.meta.env.VITE_API_URL;
// Create axios instance
const api = axios.create({
  baseURL: `${API_URL}`, // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials:true
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = localStorage.getItem('refreshToken');
    
    // If error is 401 (unauthorized) and we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry && refreshToken) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh token
        const response = await axios.post('http://your-api-url.com/api/auth/refresh', {
          refreshToken,
        });
        
        const { accessToken } = response.data;
        
        // Store new token
        localStorage.setItem('accessToken', accessToken);
        
        // Update authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        
        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login'; // Or dispatch logout action
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;