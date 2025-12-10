// src/api/mockApi.js

const MOCK_USER = {
  id: 1,
  email: "user@example.com",
  name: "John Doe",
  role: "admin",
};

// Giả lập Access Token hết hạn sau 15 giây (15000ms)
const ACCESS_TOKEN_EXPIRY = 15000;
const REFRESH_TOKEN_KEY = "mock_refresh_token_12345";

let currentAccessToken = null;
let tokenExpiryTime = 0;

// Hàm tạo Access Token và Refresh Token giả
const generateTokens = () => {
  // Giá trị token luôn thay đổi để chứng minh việc làm mới
  currentAccessToken = `access_token_${Date.now()}`;
  tokenExpiryTime = Date.now() + ACCESS_TOKEN_EXPIRY;
  return {
    accessToken: currentAccessToken,
    refreshToken: REFRESH_TOKEN_KEY,
    expiresIn: ACCESS_TOKEN_EXPIRY / 1000,
  };
};

const isAccessTokenExpired = () => Date.now() >= tokenExpiryTime;

// ----------------------------------------------------

/**
 * 1. API: /login (POST)
 */
export const mockLogin = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === MOCK_USER.email && password === "password123") {
        const tokens = generateTokens();
        resolve({
          data: {
            user: MOCK_USER,
            ...tokens,
          },
        });
      } else {
        reject({
          response: {
            status: 400,
            data: {
              message:
                "Email hoặc mật khẩu không hợp lệ (Thử: user@example.com / password123)",
            },
          },
        });
      }
    }, 500);
  });
};

/**
 * 2. API: /token/refresh (POST)
 */
export const mockRefreshToken = (refreshToken) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Kiểm tra Refresh Token giả
      if (refreshToken === REFRESH_TOKEN_KEY) {
        console.log("REFRESH: Access Token mới được tạo thành công.");
        const tokens = generateTokens();
        resolve({
          data: {
            accessToken: tokens.accessToken,
            // Máy chủ có thể trả về Refresh Token mới nếu cần
            refreshToken: tokens.refreshToken,
            expiresIn: tokens.expiresIn,
          },
        });
      } else {
        console.error(
          "REFRESH: Refresh Token không hợp lệ. Đăng xuất bắt buộc."
        );
        // Trả về 401 để kích hoạt logic đăng xuất trong Interceptor
        reject({
          response: {
            status: 401,
            data: { message: "Refresh token không hợp lệ hoặc hết hạn." },
          },
        });
      }
    }, 500);
  });
};

/**
 * 3. API: /user/profile (GET) - Endpoint được bảo vệ
 */
export const mockFetchUserProfile = (accessToken) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (
        !accessToken ||
        accessToken !== currentAccessToken ||
        isAccessTokenExpired()
      ) {
        // Trả về 401 nếu token không hợp lệ/hết hạn
        reject({
          response: {
            status: 401,
            data: { message: "Access token không hợp lệ hoặc đã hết hạn." },
          },
        });
      } else {
        // Thành công
        resolve({
          data: MOCK_USER,
        });
      }
    }, 500);
  });
};
