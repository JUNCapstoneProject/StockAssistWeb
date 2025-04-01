/**
 * 로그인 모달 컴포넌트
 * 사용자 로그인 기능을 제공하는 모달 창
 */

import React, { useState } from "react";
import axiosInstance from "../../api/axiosInstance"; // ✅ 변경된 부분
import "./LoginModal.css";
import { useDispatch } from "react-redux";
import { setLoginStatus } from "../../redux/features/auth/authSlice";

const LoginModal = ({ isOpen, onClose, onSignupClick }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 회원가입 모달로 전환하는 핸들러
  const handleSignupClick = (e) => {
    e.preventDefault();
    onClose();
    onSignupClick();
  };

  // 로그인 처리 핸들러
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // 로그인 API 요청
      const response = await axiosInstance.post(
        "/api/login",
        { email, password },
        { withCredentials: true } // ✅ 쿠키로 refreshToken 받기 위해 유지
      );

      const { success, accessToken, error } = response.data;

      if (success && accessToken) {
        // 로그인 성공 처리
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

  // 모달이 닫혀있으면 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>로그인</h2>
        <p>계정에 로그인하세요</p>

        {/* 로그인 폼 */}
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

        {/* 회원가입 링크 */}
        <p className="signup-link">
          <button onClick={handleSignupClick} className="signup-link-button">
            회원가입
          </button>
        </p>

        {/* 모달 닫기 버튼 */}
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
