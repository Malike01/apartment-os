import axios from "axios";
import { useAuthStore } from "../../store/authStore";
import { message } from "antd";

const api = axios.create({
  baseURL: (import.meta as any).env.VITE_API_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const logout = useAuthStore.getState().logout;

      if (useAuthStore.getState().token) {
        message.warning("Oturum süreniz doldu, lütfen tekrar giriş yapın.");
        logout();
        window.location.href = "/login";
      }
    }

    if (error.response && error.response.status >= 500) {
      message.error(
        "Sunucu tarafında bir hata oluştu. Lütfen daha sonra tekrar deneyin."
      );
    }

    return Promise.reject(error);
  }
);

export default api;
