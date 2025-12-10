// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans w-full">

        {/* Thanh điều hướng tối giản */}
        <nav className="p-4 bg-white border-b border-gray-200 shadow-md">
          <Link
            to="/login"
            className="mr-4 text-blue-600 hover:text-blue-800 transition-colors duration-150 font-medium"
          >
            Đăng nhập
          </Link>
          <Link
            to="/dashboard"
            className="text-blue-600 hover:text-blue-800 transition-colors duration-150 font-medium"
          >
            Dashboard
          </Link>
        </nav>

        {/* Nội dung chính */}
        <div className="w-full p-4 md:p-8">
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/" element={<Dashboard />} />
            </Route>

            <Route path="*" element={<div className="p-4 text-center text-xl text-red-600">404 Not Found</div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;