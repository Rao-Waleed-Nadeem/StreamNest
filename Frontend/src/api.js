import axios from "axios";

const api = axios.create({
  baseURL: "https://stream-nest-backend.vercel.app/api/v1",
  // baseURL: "http://localhost:8000/api/v1",
  withCredentials: true,
});

export const googleAuth = (code) => api.get(`/auth/google?code=${code}`);
