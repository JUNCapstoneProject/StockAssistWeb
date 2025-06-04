/**
 * 메인 애플리케이션 컴포넌트
 * 라우팅 설정과 전역 상태 관리를 담당
 */

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RouteWatcher from "./components/common/RouterWatcher";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

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
import FindPassword from "./pages/FindPassword";
import ResetPassword from "./pages/ResetPassword";
import StockAnalysis from "./pages/StockAnalysis";
// Redux 관련 import
import {
  setLoginStatus,
  setAccessToken,
} from "./redux/features/auth/authSlice";
import { checkLoginStatusAPI } from "./redux/features/auth/authAPI";

import "./App.css";

function App() {
  const dispatch = useDispatch();

useEffect(() => {
  const token = localStorage.getItem("accessToken");

  (async () => {
    if (token) {
      dispatch(setAccessToken(token));
    }

    try {
      console.log("로그인 상태 체크 시작");
      const loggedIn = await checkLoginStatusAPI();
      console.log("로그인 상태:", loggedIn);
      dispatch(setLoginStatus(loggedIn));
    } catch (err) {
      console.error("로그인 상태 확인 실패:", err);
      dispatch(setLoginStatus(false));
    }
  })();
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
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/report" element={<Report />} />
          <Route path="/report/:reportId" element={<ReportDetail />} />
          <Route path="/report/:reportId/edit" element={<ReportEdit />} />
          <Route path="/report/create" element={<ReportCreate />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/find-password" element={<FindPassword />} />
          <Route path="/stock-analysis" element={<StockAnalysis />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
