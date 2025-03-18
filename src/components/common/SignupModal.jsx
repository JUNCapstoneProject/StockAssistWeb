import React, { useState } from "react";
import "./SignupModal.css";

const SignupModal = ({ isOpen, onClose, onLoginClick }) => {
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>회원가입</h2>
        <p>새 계정을 만들어보세요</p>
        
        <form>
          <div className="form-group">
            <label>닉네임</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>

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

          <div className="form-group">
            <label>비밀번호 확인</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="signup-submit-btn">가입하기</button>
        </form>

        <p className="login-link">
          이미 계정이 있으신가요? <a href="#" onClick={(e) => {
            e.preventDefault();
            onClose()
            onLoginClick();
          }}>로그인</a>
        </p>
        
        <button className="modal-close" onClick={onClose}>✕</button>
      </div>
    </div>
  );
};

export default SignupModal;