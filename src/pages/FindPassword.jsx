import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import fetchWithAssist from '../fetchWithAssist';

const baseURL = import.meta.env.VITE_API_BASE_URL;

const FindPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // 이전 에러 초기화

    try {
      const response = await fetchWithAssist(`${baseURL}/api/auth/password-reset-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "destination": "assist",
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
    <div className="login-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="login-container" style={{ width: '100%', maxWidth: 400, margin: '0 auto', boxSizing: 'border-box' }}>
        <h2 style={{ textAlign: 'center' }}>비밀번호 찾기</h2>
        <p style={{ textAlign: 'center', whiteSpace: 'pre-line', marginBottom: '1rem', marginTop: 0 }}>
          {`가입하신 이메일을 입력하시면,\n비밀번호 재설정 안내를 보내드립니다.`}
        </p>
        {submitted ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '120px', margin: '0' }}>
            <p style={{
              textAlign: 'center',
              color: '#007bff',
              margin: '1.2rem 0',
              whiteSpace: 'pre-line',
              fontSize: '1.1rem',
              lineHeight: 1.7
            }}>
              {`입력하신 이메일로\n비밀번호 재설정 안내가 전송됩니다.\n(임시 페이지입니다)`}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 0 }}>
            <div className="form-group" style={{ width: '100%' }}>
              <label>이메일</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%' }}
              />
            </div>
            {errorMessage && (
              <p style={{ color: 'red', marginTop: '0.5rem', textAlign: 'center' }}>{errorMessage}</p>
            )}
            <button type="submit" className="login-submit-btn" style={{ marginTop: '1rem', width: '100%' }}>
              비밀번호 찾기
            </button>
          </form>
        )}
        <p className="signup-link" style={{ textAlign: 'center' }}>
          <button onClick={() => navigate("/login")} className="signup-link-button">
            로그인으로 돌아가기
          </button>
        </p>
      </div>
    </div>
  );
};

export default FindPassword;
