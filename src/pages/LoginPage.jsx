// src/pages/LoginPage.jsx

import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import useAuth from '../context/AuthProvider';

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: ({ email, password }) => login(email, password),

    onSuccess: () => {
      navigate('/dashboard', { replace: true });
    },

    onError: (error) => {
      const message = error.response?.data?.message || 'Lỗi đăng nhập không xác định.';
      alert(message);
    }
  });

  const onSubmit = (data) => {
    loginMutation.mutate(data);
  };

  const isPending = loginMutation.isPending;

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] w-full">
      <div className="w-full max-w-sm p-6 bg-white rounded-xl shadow-lg border border-gray-100">

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Đăng nhập Hệ thống</h2>
        <p className="text-sm text-center text-gray-500 mb-4">Tài khoản thử: user@example.com / password123</p>

        <form onSubmit={handleSubmit(onSubmit)}>

          {/* Trường Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              type="email"
              placeholder="user@example.com"
              {...register("email", {
                required: "Email là bắt buộc",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Định dạng email không hợp lệ"
                }
              })}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>

          {/* Trường Mật khẩu */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
            <input
              id="password"
              type="password"
              placeholder="password123"
              {...register("password", {
                required: "Mật khẩu là bắt buộc",
                minLength: { value: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" }
              })}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
          </div>

          {/* Nút Submit */}
          <button
            type="submit"
            disabled={isPending}
            className={`w-full py-2.5 px-4 rounded-lg font-semibold text-white transition duration-150 ease-in-out ${isPending
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300'
              }`}
          >
            {isPending ? 'Đang Đăng nhập...' : 'Đăng nhập'}
          </button>

          {/* Hiển thị Lỗi */}
          {loginMutation.isError && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm text-center">
              Đăng nhập thất bại: {loginMutation.error.response?.data?.message || 'Lỗi mạng'}
            </div>
          )}

        </form>
      </div>
    </div>
  );
};

export default LoginPage;