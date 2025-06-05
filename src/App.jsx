import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  setLoginStatus,
  setAccessToken,
} from "./redux/features/auth/authSlice";
import { checkLoginStatusAPI } from "./redux/features/auth/authAPI";

import RouteWatcher from "./components/common/RouterWatcher";
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
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

import "./App.css";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    // 외부 유입인지 판단
    const cameFromExternal =
      document.referrer === "" || !document.referrer.includes(location.origin);

    // 브라우저 새로고침 여부 확인
    const navigationEntries = performance.getEntriesByType("navigation");
    const isPageRefresh = navigationEntries[0]?.type === "reload";

    (async () => {
      if (cameFromExternal) {
        console.log("✅ 외부 유입 감지 → refresh 허용 상태로 로그인 체크");
        const loggedIn = await checkLoginStatusAPI({ allowRefresh: true });
        dispatch(setLoginStatus(loggedIn));
        if (token) dispatch(setAccessToken(token));
        return;
      }

      if (isPageRefresh) {
        console.log("🔄 새로고침 감지 → 로그인 체크");
        if (token) dispatch(setAccessToken(token));
        const loggedIn = await checkLoginStatusAPI({ allowRefresh: false });
        dispatch(setLoginStatus(loggedIn));
        return;
      }

      // 내부 라우팅
      if (token) {
        dispatch(setAccessToken(token));
        dispatch(setLoginStatus(true));
        console.log("➡️ 내부 이동 → 토큰으로 로그인 유지");
      } else {
        dispatch(setLoginStatus(false));
        console.log("🚫 내부 이동 → 토큰 없음, 로그인 false");
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
