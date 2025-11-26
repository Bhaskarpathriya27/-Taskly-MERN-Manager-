import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:4000';

export const apiClient = axios.create({
  baseURL,
});

export const authorizedHeaders = (token) =>
  token
    ? {
        headers: { Authorization: `Bearer ${token}` },
      }
    : {};

