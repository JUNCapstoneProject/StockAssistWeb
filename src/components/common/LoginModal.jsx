import React, { useState } from "react";
import axios from "axios";
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
      const response = await axios.post(
        "http://localhost:8080/api/login",
        { email, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        dispatch(setLoginStatus(true));  // ✅ Redux로 로그인 상태 변경
        alert("로그인 성공!");
        onClose();
      } else {
        alert("로그인 실패: " + response.data.error);
      }
    } catch (error) {
      console.error(error);
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
