import axios from "axios";

import { API_BASE_URL } from "@/constants/env";
import { STORAGE_KEYS } from "@/constants/storage";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60s to handle Render free tier cold start
  headers: {
    "Content-Type": "application/json",
  },
});

// ============ REQUEST INTERCEPTOR ============
// Tá»± Ä‘á»™ng gáº¯n Access Token vÃ o má»—i request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ============ RESPONSE INTERCEPTOR ============
// Xá»­ lÃ½ lá»—i táº­p trung
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // 401: Token háº¿t háº¡n â†’ thá»­ refresh token
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

        if (accessToken && refreshToken) {
          const res = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
            accessToken,
            refreshToken,
          });
          const newAccessToken = res.data.data.accessToken;
          const newRefreshToken = res.data.data.refreshToken;

          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
          }

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch {
        // Refresh tháº¥t báº¡i â†’ logout
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        window.location.hash = "#/";
      }
    }

    if (status === 403) {
      console.error("Báº¡n khÃ´ng cÃ³ quyá»n truy cáº­p!");
    }

    if (status === 500) {
      console.error("Lá»—i server, vui lÃ²ng thá»­ láº¡i sau!");
    }

    return Promise.reject(error);
  },
);

export default api;
