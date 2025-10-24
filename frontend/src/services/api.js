// src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://backend-kayaking.onrender.com/api',
});

// Attach token to all requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // get token from storage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
