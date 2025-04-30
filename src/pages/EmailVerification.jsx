import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const EmailVerification = () => {
  const [message, setMessage] = useState("인증 중...");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (!token) {
      setMessage("잘못된 접근입니다. 인증 토큰이 없습니다.");
      return;
    }

    fetch(`http://assist-server-service:4003/api/auth/verify?token=${token}`)
      .then(async (response) => {
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.response?.loggedIn) {
            setMessage("✅ 이메일 인증이 완료되었습니다. 로그인 해주세요.");
          } else {
            setMessage("❌ 이메일 인증에 실패했습니다. 다시 시도해주세요.");
          }
        } else if (response.status === 401) {
          setMessage("⛔ 인증 토큰이 만료되었거나 유효하지 않습니다.");
        } else if (response.status === 500) {
          setMessage("🚨 서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        } else {
          setMessage("⚠️ 알 수 없는 오류가 발생했습니다.");
        }
      })
      .catch((error) => {
        console.error("이메일 인증 요청 실패:", error);
        setMessage("⚠️ 네트워크 오류가 발생했습니다. 다시 시도해주세요.");
      });
  }, [location.search]);

  return (
    <div className="email-verification-page">
      <div className="email-verification-container">
        <h1>이메일 인증</h1>
        <p>{message}</p>
        {message.includes("완료") && (
          <button onClick={() => navigate("/login")} className="go-login-btn">
            로그인 페이지로 이동
          </button>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;
