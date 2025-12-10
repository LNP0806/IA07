import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../context/AuthProvider.jsx";

const ProtectedRoute = () => {
  const { auth, isCheckingAuth } = useAuth();
  const location = useLocation();

  if (isCheckingAuth) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="p-8 text-center text-gray-600 font-medium bg-white rounded-lg shadow-md border border-gray-200">
          Đang khôi phục phiên đăng nhập...
        </div>
      </div>
    );
  }

  if (auth?.accessToken) {
    return <Outlet />;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;
