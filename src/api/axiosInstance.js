import axios from "axios";

// ✅ 1. Axios 인스턴스 생성 (기본 설정 포함)
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080", // 백엔드 API 주소
  withCredentials: true, // ✅ 쿠키 전송 허용 (refreshToken 쿠키 포함됨)
});

// ✅ 2. 요청 인터셉터: accessToken 자동으로 Authorization 헤더에 추가
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken"); // 로컬스토리지에서 accessToken 꺼냄
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // 헤더에 추가
  }
  return config;
});


// === 🔄 토큰 갱신 관련 변수 ===

// ✅ 중복 refresh 요청 방지용 플래그
let isRefreshing = false;

// ✅ refresh 완료 후 대기 중인 요청들 저장소
let refreshSubscribers = [];

// ✅ 새 accessToken이 발급되었을 때 대기 중인 요청들에 적용
function onRefreshed(newToken) {
  refreshSubscribers.forEach((callback) => callback(newToken)); // 모두에 새 토큰 전달
  refreshSubscribers = []; // 초기화
}

// ✅ 실패한 요청이 refresh 완료되길 기다리게 등록
function addRefreshSubscriber(callback) {
  refreshSubscribers.push(callback);
}


// ✅ 3. 응답 인터셉터: accessToken이 만료되었을 경우 자동으로 refresh 요청
axiosInstance.interceptors.response.use(
  (response) => response, // 정상 응답은 그대로 반환
  async (error) => {
    const originalRequest = error.config;

    // ✅ accessToken 만료로 인한 401 에러 + 아직 재시도 안한 경우
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // 재시도 플래그 설정

      // ✅ 현재 다른 refresh 중이 아니라면 → 직접 refresh 요청 수행
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          // ✅ 백엔드로 refreshToken 쿠키 전송하여 accessToken 재발급 요청
          const res = await axios.post(
            "http://localhost:8080/api/refresh",
            {}, // 바디 필요 없음
            { withCredentials: true } // 쿠키 포함
          );

          const newAccessToken = res.data.accessToken;

          // ✅ 새 accessToken을 localStorage에 저장
          localStorage.setItem("accessToken", newAccessToken);

          // ✅ 대기 중인 요청들에 새 토큰 전달
          onRefreshed(newAccessToken);
        } catch (refreshError) {
          // ❌ refreshToken도 만료됨 → 강제 로그아웃 처리
          console.error("❌ refreshToken도 만료됨: 로그아웃 처리 필요");
          localStorage.removeItem("accessToken");
          window.location.href = "/"; // 또는 로그인 모달 띄우기
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false; // refresh 종료
        }
      }

      // ✅ 이미 refresh 중이면 → 대기하고 있다가 다시 요청 재시도
      return new Promise((resolve) => {
        addRefreshSubscriber((newToken) => {
          // 재시도 시 새 토큰 적용
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(axiosInstance(originalRequest)); // 요청 재시도
        });
      });
    }

    // ✅ 그 외 에러는 그대로 전달
    return Promise.reject(error);
  }
);

export default axiosInstance;
