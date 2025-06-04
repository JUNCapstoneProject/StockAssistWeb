// 🔗 axios 인스턴스 (accessToken 자동 포폴, 응답 인터셰터 포함)
import axiosInstance from "../../../api/axiosInstance";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

/**
 * ✅ 로그인 상태 확인 API
 * - 클라이언트에 저장된 accessToken을 헤더에 포함해 서버에 요청
 * - 서버가 accessToken의 유효성 검사
 * - 필요시 refreshToken으로 accessToken 자동 재발금됩니다 (axios 인터셰터 가장)
 * 
 * 사용 위치:
 * - App.jsx (앱 시작 시)
 * - Navbar.jsx (처음 렌더링 시)
 */
export const checkLoginStatusAPI = async () => {
  const token = localStorage.getItem("accessToken");
  const hasRefreshToken = document.cookie.includes("refreshToken="); // ✅ 쿠키에 refreshToken 존재 여부 확인

  console.log("accessToken:", token);
  console.log("refreshToken 존재 여부:", hasRefreshToken);

  // ✅ accessToken이 없고 refreshToken이 있는 경우에만 refresh 시도
  if (!token && hasRefreshToken) {
    try {
      const refreshResponse = await axios.post(
        baseURL + "/api/auth/refresh",
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "destination": "assist",
          },
          credentials: "include",
        }
      );

      if (refreshResponse.data?.success && refreshResponse.data?.response) {
        const newAccessToken = refreshResponse.data.response;
        localStorage.setItem("accessToken", newAccessToken);

        const checkResponse = await axiosInstance.get("/api/auth/check");
        return checkResponse.data?.success && checkResponse.data?.response?.isLogin;
      } else {
        throw new Error(refreshResponse.data?.message || "토큰 갱신 실패");
      }
    } catch (refreshError) {
      console.error("🚨 토큰 갱신 실패:", refreshError.response?.data || refreshError);
      localStorage.removeItem("accessToken");
      return false;
    }
  }

  // ✅ accessToken이 있는 경우 → /check 요청
  try {
    const response = await axiosInstance.get("/api/auth/check");

    if (response.data?.success && response.data?.response?.isLogin !== undefined) {
      if (!response.data.response.isLogin && hasRefreshToken) {
        // accessToken 있지만 서버는 만료되었다고 판단 → refresh 시도
        const refreshResponse = await axios.post(
          baseURL + "/api/auth/refresh",
          {},
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "destination": "assist",
            },
            credentials: "include",
          }
        );

        if (refreshResponse.data?.success && refreshResponse.data?.response) {
          const newAccessToken = refreshResponse.data.response;
          localStorage.setItem("accessToken", newAccessToken);
          const checkResponse = await axiosInstance.get("/api/auth/check");
          return checkResponse.data?.success && checkResponse.data?.response?.isLogin;
        }
      }

      return response.data.response.isLogin;
    }

    return false;
  } catch (error) {
    if (error.response?.status === 401 && hasRefreshToken) {
      // 유효하지 않은 accessToken → refresh 시도
      try {
        const refreshResponse = await axios.post(
          baseURL + "/api/auth/refresh",
          {},
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "destination": "assist",
            },
            credentials: "include",
          }
        );

        if (refreshResponse.data?.success && refreshResponse.data?.response) {
          const newAccessToken = refreshResponse.data.response;
          localStorage.setItem("accessToken", newAccessToken);
          const checkResponse = await axiosInstance.get("/api/auth/check");
          return checkResponse.data?.success && checkResponse.data?.response?.isLogin;
        }
      } catch (refreshError) {
        console.error("🚨 refreshToken 만료 또는 오류:", refreshError);
      }
    }

    console.error("🚨 로그인 상태 확인 실패:", error);
    return false;
  }
};

/**
 * ✅ 로그아웃 API
 * - 서버에 refreshToken 쿠키 삭제 요청
 * - 클라이언트에 저장된 accessToken도 제거
 * 
 * 사용 위치:
 * - Navbar.jsx → 로그아웃 버튼 클릭 시
 */

export const logoutAPI = async () => {
  console.log("logoutAPI 실행");
  try {
    const response = await axiosInstance.post("/api/auth/logout");

    if (response.data.success) {
      localStorage.removeItem("accessToken");
    }

    return response.data.success;
  } catch (error) {
    console.error("🚨 로그아웃 오류:", error);
    return false;
  }
};