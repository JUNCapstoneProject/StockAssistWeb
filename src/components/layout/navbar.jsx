/**
 * 네비게이션 바 컴포넌트
 * 웹사이트의 상단 네비게이션을 담당하며, 로고, 메뉴 링크, 검색 기능, 로그인/로그아웃 기능을 포함
 */

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../../redux/features/auth/authSlice";
import {
  selectIsLoggedIn,
  selectIsLoginChecked,
} from "../../redux/features/auth/authSelectors";
import { logoutAPI } from "../../redux/features/auth/authAPI";
import "./navbar.css";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const baseURL = import.meta.env.VITE_API_BASE_URL;


  // Redux 상태 관리
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isLoginChecked = useSelector(selectIsLoginChecked);

  // 로컬 상태 관리
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 로그아웃 처리 함수
  const handleLogout = async () => {
    try {
      const success = await logoutAPI();
      if (success) {
        dispatch(logout());
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 검색 제출 처리 함수
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/stock/${searchQuery}`);
    }
  };

  // 검색어 변경 및 자동완성 처리 함수
  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    console.log("🔍 검색어:", query);
  
    if (!query.trim()) {
      console.log("❌ 검색어가 비어있어 자동완성 중단");
      setSearchQuery("");  // 검색어 초기화
      setSuggestions([]);  // 추천 목록 초기화
      setShowSuggestions(false);  // 드롭다운 숨기기
      return;
    }

    try {
      const url = `${baseURL}/api/stocks/search?query=${encodeURIComponent(query)}`;
      console.log("🌐 API 요청:", url);

      const res = await fetch(url);
      console.log("📡 API 응답 상태:", res.status);

      if (res.ok) {
        const data = await res.json();
        console.log("✅ API 응답 데이터:", data);

        const list = Array.isArray(data.response?.searchData) ? data.response.searchData : [];
        setSuggestions(list);
        setShowSuggestions(true);
        console.log("📋 가공된 검색 결과:", list);
      } else {
        console.warn("❌ API 응답 실패");
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (err) {
      console.error("🔍 자동완성 에러:", err);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // 자동완성 항목 클릭 처리 함수
  const handleSuggestionClick = (ticker) => {
    const selectedStock = suggestions.find((item) => item.ticker === ticker);
    navigate(`/stock/${ticker}`, {
      state: { name: selectedStock?.nameKr },
    });
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // 검색창 초기화 함수 추가
  const clearSearch = () => {
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // 햄버거 메뉴 토글 함수
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // 로그인 상태 체크가 완료되지 않았으면 렌더링하지 않음
  if (!isLoginChecked) return null;

  return (
    <nav className="navbar">
      {/* 왼쪽 네비게이션 영역 */}
      <div className="nav-left">
        <a href="/" className="logo">
          <img src="/Logo.svg" alt="Logoname" className="logo-image" />
          <span className="logo-text">Tuzain</span>
        </a>
        {/* 데스크탑용 메뉴 */}
        <div className="nav-links desktop-menu">
          <a href="/">홈</a>
          <a href="/ai-analysis">AI 투자 분석</a>
          <a href="/report">리포트</a>
          <a href="/portfolio">나의 포트폴리오</a>
        </div>
      </div>

      {/* 오른쪽 네비게이션 영역 */}
      <div className="nav-right">
        {/* 검색 폼 */}
        <form className="search-container" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="종목 검색"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="search-input"
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-button"
              onClick={clearSearch}
              style={{
                position: "absolute",
                right: "40px",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "5px"
              }}
            >
              ✕
            </button>
          )}
          <button type="submit" className="search-button">
            <svg className="search-icon" viewBox="0 0 24 24">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* 검색 자동완성 드롭다운 */}
          {showSuggestions && (
            <ul className="suggestions-dropdown">
              {suggestions.map((item) => (
                <li
                  key={item.ticker}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(item.ticker)}
                >
                  {item.nameKr} ({item.ticker})
                  {item.nameEn && ` - ${item.nameEn}`}
                </li>
              ))}
            </ul>
          )}
        </form>

        {isLoggedIn ? (
          <img
            src="/images/my.svg"
            alt="My Icon"
            className="my-icon"
            onClick={() => navigate("/mypage")}
            style={{ cursor: "pointer" }}
          />
        ) : (
          <img
            src="/images/my.svg"
            alt="My Icon"
            className="my-icon"
            onClick={() => navigate("/signup", { state: { from: location.pathname } })}
            style={{ cursor: "pointer" }}
          />
        )}

        {/* 로그인/로그아웃 버튼 */}
        {isLoggedIn ? (
          <button className="login-button" onClick={handleLogout}>
            로그아웃
          </button>
        ) : (
          <button
            className="login-button"
            onClick={() => navigate("/login", { state: { from: location.pathname } })}
          >
            로그인
          </button>
        )}

        {/* 모바일용 햄버거 및 메뉴 */}
        <button className="hamburger" onClick={toggleMenu} aria-label="메뉴 열기">
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
        <div className={`nav-links mobile-menu${isMenuOpen ? " open" : ""}`} onClick={() => setIsMenuOpen(false)}>
          <a href="/">홈</a>
          <a href="/ai-analysis">AI 투자 분석</a>
          <a href="/report">리포트</a>
          <a href="/portfolio">나의 포트폴리오</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
