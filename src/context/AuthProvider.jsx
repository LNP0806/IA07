// src/context/AuthProvider.js

import React, { createContext, useState, useContext } from "react";
import { mockLogin } from "../api/mockApi"; // Dùng mock API

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  // 1. Khởi tạo State: Cố gắng lấy refresh token từ localStorage
  const [auth, setAuth] = useState(() => ({
    user: null,
    accessToken: null,
    refreshToken: localStorage.getItem("refreshToken") || null,
  }));

  // Nếu bạn muốn lưu trữ user trong localStorage:
  // const [auth, setAuth] = useState(() => {
  //     const storedRefresh = localStorage.getItem('refreshToken');
  //     const storedUser = JSON.parse(localStorage.getItem('user'));
  //     return { user: storedUser, accessToken: null, refreshToken: storedRefresh };
  // });

  // Hàm Login
  const login = async (email, password) => {
    const response = await mockLogin(email, password);
    const { user, accessToken, refreshToken } = response.data;

    // Lưu Refresh Token vào Persistent Storage
    localStorage.setItem("refreshToken", refreshToken);
    // Lưu Access Token và User vào In-Memory State
    setAuth({ user, accessToken, refreshToken });
  };

  // Hàm Logout
  const logout = () => {
    // Xóa tất cả token
    localStorage.removeItem("refreshToken");
    setAuth({ user: null, accessToken: null, refreshToken: null });
    // React Query Cache nên được xoá trong component gọi (ví dụ: Dashboard)
  };

  // Hàm setAuth được cung cấp để Interceptor có thể cập nhật Access Token
  return (
    <AuthContext.Provider value={{ auth, setAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default () => useContext(AuthContext); // Custom Hook useAuth
