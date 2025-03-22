import React, { useState } from "react";
import axiosInstance from "../../api/axiosInstance"; // ✅ 변경된 부분
import "./LoginModal.css";
import { useDispatch } from "react-redux";
import { setLoginStatus } from "../../redux/features/auth/authSlice";

const LoginModal = ({ isOpen, onClose, onSignupClick }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignupClick = (e) => {
    e.preventDefault();
    onClose();
    onSignupClick();
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post(
        "/api/login",
        { email, password },
        { withCredentials: true } // ✅ 쿠키로 refreshToken 받기 위해 유지
      );

      const { success, accessToken, error } = response.data;

      if (success && accessToken) {
        localStorage.setItem("accessToken", accessToken);
        dispatch(setLoginStatus(true));
        alert("로그인 성공!");
        onClose();
      } else {
        alert("로그인 실패: " + (error || "알 수 없는 오류"));
      }
    } catch (error) {
      console.error("로그인 요청 중 에러 발생:", error);
      alert("로그인 요청 중 에러가 발생했습니다.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>로그인</h2>
        <p>계정에 로그인하세요</p>

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
          <button onClick={handleSignupClick} className="signup-link-button">
            회원가입
          </button>
        </p>

        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
