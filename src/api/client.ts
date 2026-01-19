import axios from 'axios';

// Use Vite dev proxy by default to avoid CORS during development.
const DEFAULT_BASE_URL = '/api/v4/test';

export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? DEFAULT_BASE_URL;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.detail ||
      error?.response?.data?.message ||
      error?.message ||
      'Request failed';
    return Promise.reject(new Error(message));
  },
);
