import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Navbar from "./components/layout/navbar";
import Home from "./pages/Home";
import MyPortfolioUnlink from "./pages/MyPortfolioUnlink";
import MyPortfolioLink from "./pages/MyPortfolioLink";
import IndividualStock from "./pages/IndividualStock";
import AiAnalysis from "./pages/Aianalysis";
import EmailVerification from "./pages/EmailVerification";

import {
  setLoginStatus,
  setAccessToken,
} from "./redux/features/auth/authSlice";
import { checkLoginStatusAPI } from "./redux/features/auth/authAPI";

import "./App.css";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // 페이지 새로고침 여부를 확인하는 플래그
    const navigationEntries = performance.getEntriesByType("navigation");
    const isPageRefresh = navigationEntries[0]?.type === "reload";

    // 새로고침일 때만 로그인 상태 체크
    if (isPageRefresh) {
      (async () => {
        const token = localStorage.getItem("accessToken");
        if (token) {
          dispatch(setAccessToken(token));
          try {
            const loggedIn = await checkLoginStatusAPI();
            dispatch(setLoginStatus(loggedIn));
          } catch (err) {
            dispatch(setLoginStatus(false));
            console.error("앱 시작 시 로그인 상태 확인 실패:", err);
          }
        } else {
          dispatch(setLoginStatus(false));
        }
      })();
    } else {
      // 단순 라우트 변경일 경우 localStorage의 토큰만 확인
      const token = localStorage.getItem("accessToken");
      dispatch(setLoginStatus(!!token));
    }
  }, [dispatch]); // 컴포넌트 마운트 시 1회만 실행

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<MyPortfolioUnlink />} />
          <Route path="/portfolio/link" element={<MyPortfolioLink />} />
          <Route path="/stock/:symbol" element={<IndividualStock />} />
          <Route path="/ai-analysis" element={<AiAnalysis />} />
          <Route path="/verify" element={<EmailVerification />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
