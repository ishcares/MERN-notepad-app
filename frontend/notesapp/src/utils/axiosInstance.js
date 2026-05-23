import axios from "axios";

const axiosInstance = axios.create({
  // In production (Netlify): VITE_BACKEND_URL is set via Netlify Dashboard env vars
  // In local dev: falls back to "/api" which Vite proxies to localhost:8000
  baseURL: import.meta.env.VITE_BACKEND_URL || "/api",
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  // 🛑 FIX 2: Get the token using the correct key name
  const token = localStorage.getItem("userToken"); 
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosInstance;

