import axios from "axios";

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
const normalizedApiUrl = rawApiUrl.replace(/\/$/, "");
const baseURL = /\/api$/.test(normalizedApiUrl)
  ? normalizedApiUrl
  : `${normalizedApiUrl}/api`;

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Strip Content-Type for FormData so browser can set multipart boundary automatically
api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If error is 401 Auto Logout immediately without trying to refresh
    // But skip if we are already on the login page or trying to login to avoid reload loop
    if (error.response?.status === 401) {
      const isLoginRequest = error.config?.url?.includes("/auth/login");
      if (typeof window !== "undefined" && !isLoginRequest) {
        // Clear zustand persisted auth store from localStorage
        localStorage.removeItem("auth-storage");
        // Redirect to login page with session_expired query parameter
        window.location.href = "/login?session_expired=true";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
