import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const EmailVerification = () => {
  const [message, setMessage] = useState("인증 중...");
  const location = useLocation();

  useEffect(() => {
    // URL 쿼리 스트링에서 token 추출
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      // 백엔드의 이메일 인증 API 호출
      fetch(`http://localhost:8080/api/auth/verify?token=${token}`)
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setMessage("이메일 인증이 완료되었습니다. 로그인 해주세요.");
          } else {
            setMessage("이메일 인증에 실패했습니다. 링크가 유효하지 않거나 만료되었습니다.");
          }
        })
        .catch(error => {
          console.error("인증 오류:", error);
          setMessage("오류가 발생했습니다. 다시 시도해주세요.");
        });
    } else {
      setMessage("잘못된 접근입니다.");
    }
  }, [location.search]);

  return (
    <div className="email-verification">
      <h1>이메일 인증</h1>
      <p>{message}</p>
    </div>
  );
};

export default EmailVerification;
