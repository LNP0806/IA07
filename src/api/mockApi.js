const MOCK_USER = {
  id: 1,
  email: "user@example.com",
  name: "John Doe",
  role: "admin",
};

const ACCESS_TOKEN_EXPIRY = 15000;
const REFRESH_TOKEN_KEY = "mock_refresh_token_12345";

let currentAccessToken = null;
let tokenExpiryTime = 0;

const generateTokens = () => {
  currentAccessToken = `access_token_${Date.now()}`;
  tokenExpiryTime = Date.now() + ACCESS_TOKEN_EXPIRY;
  return {
    accessToken: currentAccessToken,
    refreshToken: REFRESH_TOKEN_KEY,
    expiresIn: ACCESS_TOKEN_EXPIRY / 1000,
  };
};

const isAccessTokenExpired = () => Date.now() >= tokenExpiryTime;

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

export const mockRefreshToken = (refreshToken) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (refreshToken === REFRESH_TOKEN_KEY) {
        console.log("REFRESH: Access Token mới được tạo thành công.");
        const tokens = generateTokens();
        resolve({
          data: {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            expiresIn: tokens.expiresIn,
          },
        });
      } else {
        console.error(
          "REFRESH: Refresh Token không hợp lệ. Đăng xuất bắt buộc."
        );
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

export const mockFetchUserProfile = (accessToken) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (
        !accessToken ||
        accessToken !== currentAccessToken ||
        isAccessTokenExpired()
      ) {
        reject({
          response: {
            status: 401,
            data: { message: "Access token không hợp lệ hoặc đã hết hạn." },
          },
        });
      } else {
        resolve({
          data: MOCK_USER,
        });
      }
    }, 500);
  });
};
