import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RouteWatcher from "./components/common/RouterWatcher";
import Navbar from "./components/layout/navbar";

// 페이지 컴포넌트
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
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import FindPassword from "./pages/FindPassword";
import ResetPassword from "./pages/ResetPassword";
import StockAnalysis from "./pages/StockAnalysis";

import {
  setLoginStatus,
  setAccessToken,
} from "./redux/features/auth/authSlice";
import { checkLoginStatusAPI } from "./redux/features/auth/authAPI";

import "./App.css";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const navigationEntries = performance.getEntriesByType("navigation");
    const navType = navigationEntries[0]?.type;
    const token = localStorage.getItem("accessToken");
    const isExternal = document.referrer && !document.referrer.startsWith(window.location.origin);

    (async () => {
      if (navType === "navigate" && (isExternal || navType === "reload")) {
        if (token) {
          dispatch(setAccessToken(token));
        }
        try {
          console.log("외부 유입/새로고침: 로그인 상태 체크 시작");
          const loggedIn = await checkLoginStatusAPI();
          console.log("로그인 상태 체크 결과:", loggedIn);
          dispatch(setLoginStatus(loggedIn));
        } catch (err) {
          console.error("로그인 상태 확인 실패:", err);
          dispatch(setLoginStatus(false));
        }
      } else {
        if (token) {
          dispatch(setAccessToken(token));
          dispatch(setLoginStatus(true));
          console.log("내부 이동: accessToken 존재, 로그인 상태 유지");
        } else {
          dispatch(setLoginStatus(false));
          console.log("내부 이동: accessToken 없음, 로그인 상태 false");
        }
      }
    })();
  }, [dispatch]);

  return (
    <Router>
      <div className="App">
        <RouteWatcher />
        <Navbar />
        <Routes>
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
