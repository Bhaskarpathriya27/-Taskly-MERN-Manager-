import axios from "axios";

const fallbackBaseUrl = "https://taskly-mern-manager-production.up.railway.app";

const baseURL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || fallbackBaseUrl;

export const apiClient = axios.create({
  baseURL,
});

export const authorizedHeaders = (token) =>
  token
    ? {
        headers: { Authorization: `Bearer ${token}` },
      }
    : {};
