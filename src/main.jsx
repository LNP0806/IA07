// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
// PHẢI CHẮC CHẮN IMPORT TỪ '@tanstack/react-query'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthProvider.jsx';
import "./output.css";

// Tạo React Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    // Cấu hình Queries mặc định (Queries là bắt buộc trong defaultOptions)
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
    // KHÔNG CẦN định nghĩa 'mutations' ở đây nếu bạn không có tùy chọn mặc định
    // NHƯNG nếu có, nó PHẢI nằm trong defaultOptions
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* PHẢI CHẮC CHẮN BỌC TOÀN BỘ ỨNG DỤNG BẰNG QueryClientProvider */}
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);