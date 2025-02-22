'use client'

import axios from 'axios';
import Cookies from 'js-cookie';

const getBaseURL = () => {
  if (process.env.NEXT_PUBLIC_PRODUCTION_URL) {
    return process.env.NEXT_PUBLIC_PRODUCTION_URL;
  }
  
  if (process.env.NODE_ENV === 'production') {
    return 'https://taskify-ai-jet.vercel.app';
  }
  
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
};

const AxiosInstance = axios.create({
  baseURL:getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

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

AxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      Cookies.remove('auth-token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export default AxiosInstance;