/**
 * 메인 애플리케이션 컴포넌트
 * 라우팅 설정과 전역 상태 관리를 담당
 */

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RouteWatcher from "./components/common/RouterWatcher";

// 레이아웃 컴포넌트
import Navbar from "./components/layout/navbar";

// 페이지 컴포넌트들
import Home from "./pages/Home";
import MyPortfolioUnlink from "./pages/MyPortfolioUnlink";
import MyPortfolioLink from "./pages/MyPortfolioLink";
import IndividualStock from "./pages/IndividualStock";
import AiAnalysis from "./pages/Aianalysis";
import EmailVerification from "./pages/EmailVerification";
import Report from "./pages/Report";
import ReportDetail from "./pages/ReportDetail";
import ReportEdit from "./pages/ReportEdit";
import ReportCreate from "./pages/ReportCreate";
import MyPage from "./pages/MyPage";

// Redux 관련 import
import {
  setLoginStatus,
  setAccessToken,
} from "./redux/features/auth/authSlice";
import { checkLoginStatusAPI } from "./redux/features/auth/authAPI";

import "./App.css";

function App() {
  const dispatch = useDispatch();

  // 페이지 새로고침 시 로그인 상태 확인
  useEffect(() => {
    const navigationEntries = performance.getEntriesByType("navigation");
    const isPageRefresh = navigationEntries[0]?.type === "reload";

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
      const token = localStorage.getItem("accessToken");
      dispatch(setLoginStatus(!!token));
    }
  }, [dispatch]);

  return (
    <Router>
      <div className="App">
        <RouteWatcher /> {/* 라우트 변경 감시 컴포넌트 */}
        <Navbar /> {/* 네비게이션 바 컴포넌트 */}
        <Routes>
          {/* 메인 라우트 설정 */}
          <Route path="/" element={<Home />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/portfolio" element={<MyPortfolioUnlink />} />
          <Route path="/portfolio/link" element={<MyPortfolioLink />} />
          <Route path="/stock/:symbol" element={<IndividualStock />} />
          <Route path="/ai-analysis" element={<AiAnalysis />} />
          <Route path="/verify" element={<EmailVerification />} />
          <Route path="/report" element={<Report />} />
          <Route path="/report/:reportId" element={<ReportDetail />} />
          <Route path="/report/:reportId/edit" element={<ReportEdit />} />
          <Route path="/report/create" element={<ReportCreate />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
