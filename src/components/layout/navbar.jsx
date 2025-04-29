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

  // Redux 상태 관리
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isLoginChecked = useSelector(selectIsLoginChecked);

  // 로컬 상태 관리
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

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

    if (!query.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/stocks/search?query=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data);
        setShowSuggestions(true);
      }
    } catch (err) {
      console.error("🔍 자동완성 에러:", err);
    }
  };

  // 자동완성 항목 클릭 처리 함수
  const handleSuggestionClick = (ticker) => {
    navigate(`/stock/${ticker}`, {
      state: { name: suggestions.find(item => item.ticker === ticker)?.nameKr }
    });
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
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
        <div className="nav-links">
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
            onClick={() => navigate('/mypage')}
            style={{ cursor: 'pointer' }}
          />
        ) : (
          <img 
            src="/images/my.svg" 
            alt="My Icon" 
            className="my-icon" 
            onClick={() => navigate("/signup", { state: { from: location.pathname } })}
            style={{ cursor: 'pointer' }}
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
      </div>
    </nav>
  );
};

export default Navbar;
