import { useEffect } from "react";
import axiosPrivate from "../api/axios";
import useAuth from "../context/AuthProvider.jsx";
import { mockRefreshToken } from "../api/mockApi";

let isRefreshing = false;
let failedQueue = [];

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
    const requestInterceptor = axiosPrivate.interceptors.request.use(
      (config) => {
        if (auth.accessToken && !config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error?.config;
        const status = error.response?.status;

        if (status === 401 && !originalRequest._retry) {
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                originalRequest.headers["Authorization"] = "Bearer " + token;
                return axiosPrivate(originalRequest);
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          }

          originalRequest._retry = true;
          isRefreshing = true;

          try {
            console.log("401 Caught. Attempting token refresh...");
            const response = await mockRefreshToken(auth.refreshToken);
            const newAccessToken = response?.data?.accessToken;

            if (!newAccessToken) {
              throw new Error("Missing new access token");
            }

            setAuth((prev) => ({ ...prev, accessToken: newAccessToken }));

            processQueue(null, newAccessToken);

            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;
            return axiosPrivate(originalRequest);
          } catch (refreshError) {
            processQueue(refreshError, null);
            logout();
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestInterceptor);
      axiosPrivate.interceptors.response.eject(responseInterceptor);
    };
  }, [auth, logout, setAuth]);

  return axiosPrivate;
};

export default useAxiosPrivate;
