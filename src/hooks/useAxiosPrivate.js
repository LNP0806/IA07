// src/hooks/useAxiosPrivate.js

import { useEffect } from "react";
import axiosPrivate from "../api/axios";
import useAuth from "../context/AuthProvider.jsx";
import { mockRefreshToken } from "../api/mockApi"; // Dùng mock API

// Biến cờ để ngăn chặn nhiều yêu cầu refresh token đồng thời
let isRefreshing = false;
let failedQueue = [];

// Hàm xử lý các yêu cầu thất bại xếp hàng
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const useAxiosPrivate = () => {
  const { auth, setAuth, logout } = useAuth();

  useEffect(() => {
    // 1. REQUEST Interceptor: Đính kèm Access Token
    const requestInterceptor = axiosPrivate.interceptors.request.use(
      (config) => {
        // Chỉ đính kèm nếu không có header Authorization (để tránh ghi đè)
        // và chỉ đính kèm nếu Access Token tồn tại
        if (auth.accessToken && !config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 2. RESPONSE Interceptor: Xử lý 401 và Refresh Token
    const responseInterceptor = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error?.config;
        const status = error.response?.status;

        // Điều kiện kích hoạt refresh: 401 và không phải là yêu cầu refresh đang thử lại
        if (status === 401 && !originalRequest._retry) {
          if (isRefreshing) {
            // Nếu đang refresh, xếp hàng yêu cầu hiện tại
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                // Gửi lại yêu cầu với token mới
                originalRequest.headers["Authorization"] = "Bearer " + token;
                return axiosPrivate(originalRequest);
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          }

          originalRequest._retry = true; // Đánh dấu đã thử lại
          isRefreshing = true;

          try {
            // Thực hiện Refresh Token
            console.log("401 Caught. Attempting token refresh...");
            const response = await mockRefreshToken(auth.refreshToken);
            const newAccessToken = response?.data?.accessToken;

            if (!newAccessToken) {
              throw new Error("Missing new access token");
            }

            // Cập nhật Auth State và Storage
            setAuth((prev) => ({ ...prev, accessToken: newAccessToken }));

            // Xử lý hàng đợi yêu cầu thất bại
            processQueue(null, newAccessToken);

            // Gửi lại yêu cầu ban đầu (originalRequest)
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;
            return axiosPrivate(originalRequest);
          } catch (refreshError) {
            // Refresh Thất bại (Refresh Token hết hạn)
            processQueue(refreshError, null);
            logout(); // Đăng xuất người dùng
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      // Dọn dẹp Interceptor khi component unmount
      axiosPrivate.interceptors.request.eject(requestInterceptor);
      axiosPrivate.interceptors.response.eject(responseInterceptor);
    };
  }, [auth, logout, setAuth]);

  return axiosPrivate;
};

export default useAxiosPrivate;
