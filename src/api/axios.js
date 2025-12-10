// src/api/axios.js

import axios from "axios";

// Giả lập base URL. Vì chúng ta dùng mock API, chúng ta sẽ gọi mock function trực tiếp
// trong logic, nhưng vẫn giữ cấu trúc này để mô phỏng môi trường thực.
const BASE_URL = "http://mock.api.server";

// 1. axiosBase: Instance không có Interceptor. Dùng cho Đăng nhập và Refresh Token
export const axiosBase = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// 2. axiosPrivate: Instance được bảo vệ có Interceptor (đính kèm và làm mới token)
const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  // Cài đặt credentials nếu sử dụng cookie
  // withCredentials: true
});

export default axiosPrivate;
