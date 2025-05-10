import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { setLoginStatus } from "../redux/features/auth/authSlice";
import "./LoginPage.css";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const from = location.state?.from || "/";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const redirect = urlParams.get("redirect");

      const params = { email, password };
      if (redirect) params.redirect = redirect;

      const response = await axiosInstance.post(
        "/api/auth/login",
        params,
        { withCredentials: true }
      );

      const { success, response: responseData, error: apiError } = response.data;

      if (success && responseData) {
        localStorage.setItem("accessToken", responseData);
        dispatch(setLoginStatus(true));
        const redirectTo = response.data.redirect || from;
        try {
          const url = new URL(redirectTo);
          const authCode = url.searchParams.get("code");
          console.log("authCode:", authCode);
        } catch (e) {
          console.log("authCode 추출 실패:", e);
        }
        if (
          redirectTo.startsWith("http://") ||
          redirectTo.startsWith("https://")
        ) {
          setTimeout(() => {
            window.location.href = redirectTo;
          }, 1500);
        } else {
          setTimeout(() => {
            navigate(redirectTo);
          }, 1500);
        }
      } else {
        setError(apiError.message || "아이디나 비밀번호가 일치하지 않습니다.");
      }
    } catch (error) {
      if (error.response?.data?.error?.message) {
        setError(error.response.data.error.message);
      } else {
        setError("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>로그인</h2>
        <p>계정에 로그인하세요</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>이메일</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="login-submit-btn">
            로그인
          </button>
        </form>

        <p className="signup-link">
          계정이 없으신가요?{" "}
          <button 
            onClick={() => navigate("/signup", { state: { from } })} 
            className="signup-link-button"
          >
            회원가입
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;