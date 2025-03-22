// src/redux/features/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoginStatus(state, action) {
      state.isLoggedIn = action.payload;
    },
    logout(state) {
      state.isLoggedIn = false;
    },
  },
});

export const { setLoginStatus, logout } = authSlice.actions;
export default authSlice.reducer;
