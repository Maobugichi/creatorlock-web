import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL,
  withCredentials: true, // sends cookies automatically on every request
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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Cookie is sent automatically; backend sets a new accessToken cookie
        await axios.post(
          `${process.env.NEXT_PUBLIC_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);

        const isProtectedRoute =
          window.location.pathname.startsWith("/dashboard") ||
          window.location.pathname.startsWith("/library") ||
          window.location.pathname.startsWith("/buyer") ||
          window.location.pathname.startsWith("/creator");

        if (isProtectedRoute) {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;