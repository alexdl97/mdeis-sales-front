import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000",
  // Cambia por la URL de tu API
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
