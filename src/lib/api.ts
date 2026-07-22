// api.ts
import axios from "axios";
import { useToastStore } from "@/store/toast.store";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: {
  resolve: (value: unknown) => void;
  reject: (err: unknown) => void;
}[] = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(undefined);
  });
  failedQueue = [];
};

const redirectToLogin = () => {
  if (typeof window === "undefined") return;
  const isProtectedRoute =
    window.location.pathname.startsWith("/dashboard") ||
    window.location.pathname.startsWith("/library") ||
    window.location.pathname.startsWith("/buyer") ||
    window.location.pathname.startsWith("/creator") ||
    window.location.pathname.startsWith("/products");

  if (isProtectedRoute) {
    window.location.href = "/login";
  }
};

const redirectForUnverifiedEmail = (message: string) => {
  if (typeof window === "undefined") return;

  useToastStore.getState().show(message, "error", "Please verify your email to continue.");

  setTimeout(() => {
    window.location.href = "/verify-email";
  }, 1800);
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 403 &&
      error.response?.data?.message === "Please verify your email before continuing"
    ) {
      redirectForUnverifiedEmail(error.response.data.message);
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        redirectToLogin();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;