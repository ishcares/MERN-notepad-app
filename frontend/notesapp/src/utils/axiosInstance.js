import axios from "axios";

const axiosInstance = axios.create({
  // Use env var in production (Netlify), fall back to relative path for local dev (Vite proxy)
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

