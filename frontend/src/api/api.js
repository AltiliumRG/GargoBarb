import axios from "axios";

let isRefreshing = false;
let refreshQueue = [];

const processQueue = (error, token = null) => {
  refreshQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  refreshQueue = [];
};

// ================================
// AXIOS INSTANCE
// ================================
const api = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true, // 🔥 IMPORTANTE PARA COOKIES
});

// ================================
// RESPONSE INTERCEPTOR
// ================================
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Si no hay respuesta del servidor
    if (!error.response) return Promise.reject(error);

    const status = error.response.status;

    // Capturar tanto 401 como 403 (Google usa mucho 403)
    if ((status === 401 || status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      // Si ya se está refrescando, poner la petición en cola
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      isRefreshing = true;

      try {
        // Hacemos refresh
        await api.get("/auth/refresh", { withCredentials: true });

        isRefreshing = false;
        processQueue(null);

        return api(originalRequest);
      } catch (refreshErr) {
        isRefreshing = false;
        processQueue(refreshErr, null);

        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
