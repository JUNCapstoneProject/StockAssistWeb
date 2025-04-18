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

  // 이전 페이지 경로 (없으면 홈으로)
  const from = location.state?.from || "/";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axiosInstance.post(
        "/api/login",
        { email, password },
        { withCredentials: true }
      );

      const { success, accessToken, error: apiError } = response.data;

      if (success && accessToken) {
        localStorage.setItem("accessToken", accessToken);
        dispatch(setLoginStatus(true));
        navigate(from); // 이전 페이지로 리다이렉트
      } else {
        setError(apiError || "로그인에 실패했습니다.");
      }
    } catch (error) {
      console.error("로그인 요청 중 에러 발생:", error);
      setError("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
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