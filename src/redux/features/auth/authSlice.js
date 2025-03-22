// src/redux/features/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  isLoginChecked: false, // ✅ 로그인 여부 체크 완료 여부
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoginStatus(state, action) {
      state.isLoggedIn = action.payload;
      state.isLoginChecked = true; // ✅ 체크 완료!
    },
    logout(state) {
      state.isLoggedIn = false;
      state.isLoginChecked = true;
    },
  },
});

export const { setLoginStatus, logout } = authSlice.actions;
export default authSlice.reducer;
