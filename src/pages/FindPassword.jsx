import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import fetchWithAssist from '../fetchWithAssist';

const FindPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // 이전 에러 초기화

    try {
      const response = await fetchWithAssist("http://localhost:4003/api/auth/password-reset-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          destination: "assist",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitted(true);
      } else {
        setErrorMessage(data.error || "오류가 발생했습니다. 다시 시도해주세요.");
      }
    } catch {
      setErrorMessage("서버와의 연결에 문제가 발생했습니다.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>비밀번호 찾기</h2>
        <p>가입하신 이메일을 입력하시면, 비밀번호 재설정 안내를 보내드립니다.</p>
        {submitted ? (
          <div style={{ textAlign: "center", color: "#007bff", margin: "2rem 0" }}>
            입력하신 이메일로 비밀번호 재설정 안내가 전송됩니다.<br />
            (임시 페이지입니다)
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>이메일</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {errorMessage && (
              <p style={{ color: "red", marginTop: "0.5rem" }}>{errorMessage}</p>
            )}
            <button type="submit" className="login-submit-btn" style={{ marginTop: "1rem" }}>
              비밀번호 찾기
            </button>
          </form>
        )}
        <p className="signup-link">
          <button onClick={() => navigate("/login")} className="signup-link-button">
            로그인으로 돌아가기
          </button>
        </p>
      </div>
    </div>
  );
};

export default FindPassword;
