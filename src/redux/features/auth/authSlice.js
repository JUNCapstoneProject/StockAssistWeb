import { createSlice } from "@reduxjs/toolkit";

// ✅ 초기 상태 정의
const initialState = {
  isLoggedIn: false,        // 사용자가 로그인한 상태 여부
  isLoginChecked: false,    // 로그인 상태를 서버에서 확인했는지 여부
  accessToken: null,        // (선택) accessToken을 Redux에서도 보관 (선택 사항)
};

// ✅ auth 관련 상태를 관리하는 slice 생성
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * ✅ 로그인 상태 설정
     * - 서버로부터 로그인 여부를 확인한 후 호출
     * - true/false 여부에 따라 로그인 상태를 Redux에 반영
     * - 동시에 로그인 확인 완료 플래그도 true로 설정
     */
    setLoginStatus(state, action) {
      state.isLoggedIn = action.payload;     // true or false
      state.isLoginChecked = true;           // 확인 완료
    },

    /**
     * ✅ accessToken 설정
     * - 로그인 또는 토큰 재발급 시 저장
     * - App.jsx에서 localStorage에서 불러와 Redux에 복원할 때도 사용
     */
    setAccessToken(state, action) {
      state.accessToken = action.payload;
    },

    /**
     * ✅ 로그아웃 처리
     * - 로그인 상태 및 accessToken 초기화
     * - isLoginChecked는 true로 설정 (이미 확인된 상태)
     */
    logout(state) {
      state.isLoggedIn = false;
      state.isLoginChecked = true;
      state.accessToken = null;
    },
  },
});

// ✅ 액션 생성자와 리듀서 export
export const { setLoginStatus, setAccessToken, logout } = authSlice.actions;
export default authSlice.reducer;
