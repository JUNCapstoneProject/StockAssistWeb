import axios from "axios";

// ✅ Axios 인스턴스 생성 (baseURL 없이)
// axiosInstance는 모든 API 요청에 공통적으로 사용할 axios 인스턴스입니다.
// withCredentials: 쿠키(특히 refreshToken)를 요청에 포함시킵니다.
const axiosInstance = axios.create({
  withCredentials: true, // ✅ 쿠키 전송 허용 (refreshToken 쿠키 포함됨)
});

// ✅ 요청 인터셉터: accessToken 자동으로 Authorization 헤더에 추가
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `${token}`;
  }
  config.headers.destination = "assist";
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

// ✅ 응답 인터셉터: accessToken이 만료되었을 경우 자동으로 refresh 요청
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
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
        console.log("refresh 요청 (401)");
        console.log("현재 쿠키:", document.cookie);
        try {
          // refreshToken을 이용해 accessToken 재발급 요청
          const res = await axios.post(
            "/api/auth/refresh",
            {},
            { 
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              credentials: 'include'
            }
          );

          console.log("refresh API 응답 전체:", res);
          console.log("refresh API 응답 데이터:", res.data);
          console.log("refresh API 응답 구조:", {
            success: res.data?.success,
            accessToken: res.data?.accessToken,
            response: res.data?.response
          });

          if (res.data?.success && res.data?.response) {
            const newAccessToken = res.data.response;
            localStorage.setItem("accessToken", newAccessToken);
            onRefreshed(newAccessToken);
            isRefreshing = false;
            originalRequest.headers.Authorization = newAccessToken;
            return axiosInstance(originalRequest);
          } else {
            throw new Error(res.data?.message || "토큰 갱신 실패");
          }
        } catch (refreshError) {
          console.error("❌ refreshToken도 만료됨: 로그아웃 처리 필요");
          localStorage.removeItem("accessToken");
          isRefreshing = false;
          return Promise.reject(refreshError);
        }
      }

      return new Promise((resolve) => {
        addRefreshSubscriber((newToken) => {
          originalRequest.headers.Authorization = newToken;
          resolve(axiosInstance(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
