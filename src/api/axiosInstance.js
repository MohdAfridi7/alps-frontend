import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    'Accept': 'application/json',
  },
  timeout: 50000,
});

// ✅ Interceptor: Attach correct token
axiosInstance.interceptors.request.use(
  (config) => {
    const path = window.location.pathname;

    let token = "";

    if (path.startsWith("/adminDashboard")) {
      token = localStorage.getItem("admToken");
    } else if (path.startsWith("/clientDashboard")) {
      token = localStorage.getItem("clntToken");
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// ✅ Optional: Handle 401/403 globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // console.error("API Error:", error?.response?.data?.msg);
    return Promise.reject(error);
  }
);

export default axiosInstance;
