// src/utils/api.js
import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "";

const api = axios.create({
  baseURL: BASE, // مثال: "http://localhost:5000"
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

// اختياري: إضافة interceptor لالتقاط الأخطاء العامة
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // يمكنك هنا إضافة معالجة مركزية للأخطاء (مثلاً إعادة تسجيل الدخول عند 401)
    return Promise.reject(err);
  }
);

export default api;
