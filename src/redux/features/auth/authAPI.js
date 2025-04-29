// 🔗 axios 인스턴스 (accessToken 자동 포폴, 응답 인터셰터 포함)
import axiosInstance from "../../../api/axiosInstance";

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

  if (!token) return false;

  try {
    const response = await axiosInstance.get("/api/auth/check");
    console.log("api/auth/check 실행");
    return response.data.response?.loggedIn || false;
  } catch (error) {
    if (error.response?.status === 401) {
      console.warn("⛔ 유효하지 않은 토큰입니다.");
    } else {
      console.error("🚨 서버 오류 발생:", error);
    }
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