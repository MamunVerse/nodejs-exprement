// api.js
import axios from 'axios';
import store from './store'; // Import your Redux store
import { clearToken } from './authSlice'; // Import the clearToken action

const api = axios.create({
  baseURL: 'https://api.example.com', // Replace with your API endpoint
});

// Request interceptor to include the token in the headers
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration or other errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid, clear token and perform logout actions
      store.dispatch(clearToken());
    }
    return Promise.reject(error);
  }
);

export default api;
