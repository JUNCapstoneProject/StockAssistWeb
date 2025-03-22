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
    const checkLogin = async () => {
      try {
        // ✅ 1. localStorage의 accessToken을 Redux로 복구
        const token = localStorage.getItem("accessToken");
        if (token) {
          dispatch(setAccessToken(token));
        }

        // ✅ 2. 실제 서버에 로그인 상태 확인 요청
        const loggedIn = await checkLoginStatusAPI();
        dispatch(setLoginStatus(loggedIn));
      } catch (err) {
        dispatch(setLoginStatus(false));
        console.error("앱 시작 시 로그인 상태 확인 실패:", err);
      }
    };

    checkLogin();
  }, [dispatch]);

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
