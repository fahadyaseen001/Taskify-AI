'use client'

import axios from 'axios';

const AxiosInstance = axios.create({
   baseURL : process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to handle token
AxiosInstance.interceptors.request.use(
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

// Add response interceptor to handle errors
AxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to auth page if unauthorized
      localStorage.removeItem('token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export default AxiosInstance;