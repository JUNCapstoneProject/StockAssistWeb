import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { setLoginStatus } from "../redux/features/auth/authSlice";
import "./LoginPage.css";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // redirect URL (ex. http://localhost:5174/callback)
  const redirect = searchParams.get("redirect") || "/";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const response = await axiosInstance.post(
        "/api/login", // ✅ redirect query 제거
        { email, password },
        { withCredentials: true }
      );
  
      const { success, accessToken, error: apiError } = response.data;
  
      if (success && accessToken) {
        // 🔐 토큰 저장 (선택)
        localStorage.setItem("accessToken", accessToken);
        dispatch(setLoginStatus(true));
  
        // ✅ 프론트에서 redirect + 토큰 붙이기
        const redirectUrlWithToken = `${redirect}?token=${accessToken}`;
        window.location.href = redirectUrlWithToken;
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
            onClick={() => navigate("/signup", { state: { from: redirect } })}
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
