import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
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
        // Redirect to login page
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
