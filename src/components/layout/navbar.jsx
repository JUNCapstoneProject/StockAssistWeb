import React, { useState, useEffect } from "react";
import LoginModal from "../common/LoginModal";
import SignupModal from "../common/SignupModal";
import "./navbar.css";
import axios from "axios";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 컴포넌트 마운트 시 로그인 상태 확인
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/auth/check", {
          withCredentials: true
        });
        setIsLoggedIn(response.data.loggedIn);
      } catch (error) {
        console.error("인증 상태 확인 중 오류 발생:", error);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  const openLoginModal = () => {
    setIsSignupModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const openSignupModal = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post("http://localhost:8080/api/logout", {}, 
        { withCredentials: true }
      );
      if (response.data.success) {
        setIsLoggedIn(false);
        alert("로그아웃되었습니다.");
      }
    } catch (error) {
      console.error(error);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <nav className="navbar">
        {/* 로고 섹션 */}
        <div className="nav-left">
          <a href="/" className="logo">
            <img src="/vite.svg" alt="Logoname" className="logo-image" />
            <span className="logo-text">Logoname</span>
          </a>

          {/* 네비게이션 링크 */}
          <div className="nav-links">
            <a href="/">홈</a>
            <a href="/ai-analysis">AI 투자 분석</a>
            <a href="/report">리포트</a>
            <a href="/portfolio">나의 포트폴리오</a>
          </div>
        </div>

        {/* 검색창과 로그인 버튼 */}
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

          {/* 로그인 버튼 클릭 시 로그인 모달 열기 */}
          {isLoggedIn ? (
            <button 
              className="login-button" 
              onClick={handleLogout}
            >
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
        onSignupClick={openSignupModal}
        onLoginSuccess={() => setIsLoggedIn(true)}
      />
      <SignupModal 
        isOpen={isSignupModalOpen} 
        onClose={() => setIsSignupModalOpen(false)}
        onLoginClick={openLoginModal}
      />
    </>
  );
};

export default Navbar;
