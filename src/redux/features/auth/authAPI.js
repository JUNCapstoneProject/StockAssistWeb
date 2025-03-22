// 🔗 axios 인스턴스 (accessToken 자동 포함, 응답 인터셉터 포함)
import axiosInstance from "../../../api/axiosInstance";

/**
 * ✅ 로그인 상태 확인 API
 * - 클라이언트에 저장된 accessToken을 헤더에 포함하여 서버에 요청
 * - 서버가 accessToken의 유효성 검사
 * - 필요시 refreshToken으로 accessToken 자동 재발급됨 (인터셉터로)
 * 
 * 사용 위치:
 * - App.jsx (앱 시작 시)
 * - Navbar.jsx (처음 렌더링 시)
 */
export const checkLoginStatusAPI = async () => {
  const response = await axiosInstance.get("/api/auth/check");
  return response.data.loggedIn; // 서버 응답: { loggedIn: true/false }
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
  const response = await axiosInstance.post("/api/logout");

  if (response.data.success) {
    // ✅ accessToken은 localStorage에서 삭제 (로그아웃 시 반드시!)
    localStorage.removeItem("accessToken");
  }

  return response.data.success;
};
