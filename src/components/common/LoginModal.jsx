import React, { useState } from "react";
import "./LoginModal.css";

const LoginModal = ({ isOpen, onClose, onSignupClick }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignupClick = (e) => {
    e.preventDefault(); // 기본 링크 동작 방지
    onClose(); // 로그인 모달 닫기
    onSignupClick(); // 회원가입 모달 열기
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>로그인</h2>
        <p>계정에 로그인하세요</p>
        
        <form>
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

          <button type="submit" className="login-submit-btn">로그인</button>
        </form>

        <p className="signup-link"> 
          <button 
            onClick={handleSignupClick}
            className="signup-link-button"
          >
            회원가입
          </button>
        </p>
        
        <button className="modal-close" onClick={onClose}>✕</button>
      </div>
    </div>
  );
};

export default LoginModal;