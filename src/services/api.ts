import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://prn232.onrender.com/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ============ REQUEST INTERCEPTOR ============
// Tự động gắn Access Token vào mỗi request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ============ RESPONSE INTERCEPTOR ============
// Xử lý lỗi tập trung
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // 401: Token hết hạn → thử refresh token
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        if (accessToken && refreshToken) {
          const res = await axios.post(
            `${import.meta.env.VITE_API_URL || "https://prn232.onrender.com/api"}/auth/refresh-token`,
            { accessToken, refreshToken },
          );
          const newToken = res.data.data.accessToken;
          localStorage.setItem("accessToken", newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch {
        // Refresh thất bại → logout
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/";
      }
    }

    if (status === 403) {
      console.error("Bạn không có quyền truy cập!");
    }

    if (status === 500) {
      console.error("Lỗi server, vui lòng thử lại sau!");
    }

    return Promise.reject(error);
  },
);

export default api;
