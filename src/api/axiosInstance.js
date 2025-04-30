import axios from "axios";

// ✅ 1. Axios 인스턴스 생성 (기본 설정 포함)
const axiosInstance = axios.create({
  baseURL: "http://assist-server-service:4003", // 백엔드 API 주소
  withCredentials: true, // ✅ 쿠키 전송 허용 (refreshToken 쿠키 포함됨)
});

// ✅ 2. 요청 인터셉터: accessToken 자동으로 Authorization 헤더에 추가
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// === 🔄 토큰 갱신 관련 변수 ===
let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(newToken) {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback) {
  refreshSubscribers.push(callback);
}

// ✅ 3. 응답 인터셉터: accessToken이 만료되었을 경우 자동으로 refresh 요청
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const res = await axios.post(
            "http://assist-server-service:4003/api/auth/refresh",
            {},
            { withCredentials: true }
          );

          const newAccessToken = res.data.response.accessToken; // ✅ FIXED: response.accessToken
          localStorage.setItem("accessToken", newAccessToken);
          onRefreshed(newAccessToken);
        } catch (refreshError) {
          console.error("❌ refreshToken도 만료됨: 로그아웃 처리 필요");
          localStorage.removeItem("accessToken");
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve) => {
        addRefreshSubscriber((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(axiosInstance(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
