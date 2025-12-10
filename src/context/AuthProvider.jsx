import React, { createContext, useState, useContext, useEffect } from 'react';
import { mockLogin, mockRefreshToken } from '../api/mockApi'; // Bổ sung mockRefreshToken

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {

  const initialRefreshToken = localStorage.getItem("refreshToken") || null;

  const [auth, setAuth] = useState(() => ({
    user: null,
    accessToken: null,
    refreshToken: initialRefreshToken,
  }));

  const [isCheckingAuth, setIsCheckingAuth] = useState(!!initialRefreshToken);

  const refreshAccessToken = async () => {
    if (!auth.refreshToken) {
      setIsCheckingAuth(false);
      return;
    }

    try {
      console.log("AuthProvider: Đang cố gắng làm mới Access Token từ Refresh Token.");

      const response = await mockRefreshToken(auth.refreshToken);
      const newAccessToken = response?.data?.accessToken;

      if (!newAccessToken) {
        throw new Error("Missing new access token from refresh response");
      }

      setAuth(prev => ({
        ...prev,
        accessToken: newAccessToken,
        user: { id: 1, name: "Refreshed User" }
      }));

    } catch (error) {
      console.error("AuthProvider: Refresh Token thất bại, đăng xuất bắt buộc.");
      localStorage.removeItem('refreshToken');
      setAuth({ user: null, accessToken: null, refreshToken: null });
    } finally {
      setIsCheckingAuth(false);
    }
  };

  useEffect(() => {
    if (initialRefreshToken) {
      refreshAccessToken();
    }
  }, []);


  const login = async (email, password) => {
    const response = await mockLogin(email, password);
    const { user, accessToken, refreshToken } = response.data;

    localStorage.setItem("refreshToken", refreshToken);
    setAuth({ user, accessToken, refreshToken });
  };

  const logout = () => {
    console.log("Đăng xuất thành công. Tokens đã bị xóa.");
    localStorage.removeItem("refreshToken");
    setAuth({ user: null, accessToken: null, refreshToken: null });
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, login, logout, isCheckingAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default () => useContext(AuthContext);