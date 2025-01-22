import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.request.use((config) => {
  if (config.method === "get" && config.data) {
    config.url = `${config.url}?${new URLSearchParams(config.data).toString()}`;
    delete config.data;
  }
  return config;
});

export default apiClient;
