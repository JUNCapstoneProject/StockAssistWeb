import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoginStatus, logout } from "../../redux/features/auth/authSlice";
import {
  selectIsLoggedIn,
  selectIsLoginChecked,
} from "../../redux/features/auth/authSelectors";
import {
  logoutAPI
} from "../../redux/features/auth/authAPI";
import LoginModal from "../common/LoginModal";
import SignupModal from "../common/SignupModal";
import "./navbar.css";

const Navbar = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isLoginChecked = useSelector(selectIsLoginChecked);

  const [searchQuery, setSearchQuery] = useState("");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const success = await logoutAPI(); // ✅ 내부에서 토큰 제거
      if (success) {
        dispatch(logout());
        alert("로그아웃되었습니다.");
      }
    } catch (err) {
      console.error(err);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  // ✅ 로그인 체크 전 로딩 처리 (선택)
  if (!isLoginChecked) {
    return null; // 또는 <div className="loading">로딩 중...</div>
  }

  return (
    <>
      <nav className="navbar">
        <div className="nav-left">
          <a href="/" className="logo">
            <img src="/vite.svg" alt="Logoname" className="logo-image" />
            <span className="logo-text">Logoname</span>
          </a>
          <div className="nav-links">
            <a href="/">홈</a>
            <a href="/ai-analysis">AI 투자 분석</a>
            <a href="/report">리포트</a>
            <a href="/portfolio">나의 포트폴리오</a>
          </div>
        </div>

        <div className="nav-right">
          <div className="search-container">
            <input
              type="text"
              placeholder="종목 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button className="search-button">
              <svg className="search-icon" viewBox="0 0 24 24">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          <img src="/images/my.svg" alt="My Icon" className="my-icon" />

          {isLoggedIn ? (
            <button className="login-button" onClick={handleLogout}>
              로그아웃
            </button>
          ) : (
            <button
              className="login-button"
              onClick={() => setIsLoginModalOpen(true)}
            >
              로그인
            </button>
          )}
        </div>
      </nav>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSignupClick={() => {
          setIsLoginModalOpen(false);
          setIsSignupModalOpen(true);
        }}
        onLoginSuccess={() => dispatch(setLoginStatus(true))}
      />
      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
        onLoginClick={() => {
          setIsSignupModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />
    </>
  );
};

export default Navbar;
