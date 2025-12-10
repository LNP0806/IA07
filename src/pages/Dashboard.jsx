// src/pages/Dashboard.jsx

import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useAuth from '../context/AuthProvider';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { mockFetchUserProfile } from '../api/mockApi';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { logout, auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const fetchUserProfile = async () => {
    const response = await mockFetchUserProfile(auth.accessToken);
    return response.data;
  };

  const { data: userProfile, isLoading, isError, error } = useQuery({
    queryKey: ['userProfile', auth.accessToken],
    queryFn: fetchUserProfile,
    retry: 0,
    refetchOnWindowFocus: false,
    enabled: !!auth.accessToken,
    onError: (err) => {
      if (err.response?.status === 401 && !auth.accessToken) {
        console.log("Access Token hết hạn và Refresh Token thất bại. Chuyển hướng về Login.");
        navigate('/login', { replace: true });
      } else if (err.response?.status !== 401) {
        console.error("Lỗi tải profile:", err);
      }
    }
  });

  const handleLogout = () => {
    logout();
    queryClient.clear();
    navigate('/login', { replace: true });
  };

  if (isLoading || !auth.accessToken) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md max-w-lg mx-auto mt-8 text-center text-gray-600 font-medium">
        Đang tải thông tin hoặc đang chờ Access Token...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 bg-red-50 border border-red-400 rounded-lg shadow-md max-w-lg mx-auto mt-8 text-center">
        <h2 className="text-xl font-semibold text-red-700 mb-2">Lỗi Tải Dữ liệu</h2>
        <p className="text-red-600 mb-4">{error.message}. Vui lòng thử đăng nhập lại.</p>
        <button
          onClick={handleLogout}
          className="py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-150"
        >
          Đăng xuất
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white rounded-xl shadow-2xl max-w-2xl mx-auto mt-8 border-t-4 border-blue-500">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Chào mừng, {userProfile.name}!</h1>

      <div className="space-y-2 mb-6 text-gray-700">
        <p className="text-lg">Email: <strong className="font-semibold">{userProfile.email}</strong></p>
        <p className="text-lg">Vai trò: <strong className="font-semibold">{userProfile.role}</strong></p>
      </div>

      <p className="p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 font-medium mb-6">
        Lưu ý: Access Token sẽ hết hạn sau 15 giây. Hãy giữ trang này mở để kiểm tra tính năng tự động làm mới token.
      </p>

      <button
        onClick={handleLogout}
        className="py-2.5 px-6 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-150 focus:outline-none focus:ring-4 focus:ring-red-300"
      >
        Đăng xuất
      </button>
    </div>
  );
};

export default Dashboard;