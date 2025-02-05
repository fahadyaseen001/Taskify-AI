'use client'

import axios from 'axios';

const getBaseURL = () => {
  // Option 1: Use a custom environment variable for production
  if (process.env.NEXT_PUBLIC_PRODUCTION_URL) {
    return `https://${process.env.NEXT_PUBLIC_PRODUCTION_URL}`;
  }
  
  // Option 2: Check if we're in production and use the production URL
  if (process.env.NODE_ENV === 'production') {
    return 'https://taskify-ai-jet.vercel.app';
  }
  
  // Option 3: Use VERCEL_URL for preview deployments
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  
  // Fallback to local development
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
};

const AxiosInstance = axios.create({
  baseURL: getBaseURL(),
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