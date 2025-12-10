// src/components/ProtectedRoute.js

import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../context/AuthProvider.jsx";

const ProtectedRoute = () => {
  const { auth } = useAuth();
  const location = useLocation();

  // Kiểm tra Access Token (hoặc Refresh Token)
  // Nếu có Access Token (đang trong phiên), cho phép truy cập
  // Nếu không có Access Token nhưng có Refresh Token, sẽ thử làm mới
  // Nếu không có cả hai, chuyển hướng đến /login
  return auth?.accessToken || auth?.refreshToken ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default ProtectedRoute;
