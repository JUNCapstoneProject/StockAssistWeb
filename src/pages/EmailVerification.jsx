import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import fetchWithAssist from '../fetchWithAssist';

const baseURL = import.meta.env.VITE_API_BASE_URL;

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #f5f8ff;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Card = styled.div`
  background: #fff;
  padding: 40px 32px 32px 32px;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  min-width: 340px;
  max-width: 90vw;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 18px;
  color: #2d3a60;
`;

const Message = styled.p`
  font-size: 1.1rem;
  margin-bottom: 32px;
  color: #222;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &.success {
    color: #2e7d32;
  }
  &.error {
    color: #d32f2f;
  }
`;

const GoLoginBtn = styled.button`
  background: linear-gradient(90deg, #4f8cff 0%, #2355d6 100%);
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  padding: 12px 0;
  width: 100%;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 8px;

  &:hover {
    background: linear-gradient(90deg, #2355d6 0%, #4f8cff 100%);
  }
`;

const EmailVerification = () => {
  const [message, setMessage] = useState("인증 중...");
  const [msgType, setMsgType] = useState(""); // success, error, etc
  const location = useLocation();
  const navigate = useNavigate();

  const fetchStockData = useCallback(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (!token) {
      const errorMsg = "잘못된 접근입니다. 인증 토큰이 없습니다.";
      setMessage(errorMsg);
      setMsgType("error");
      alert(errorMsg);
      return;
    }

    const timer = setTimeout(() => {
      fetchWithAssist(`${baseURL}/api/auth/verify?token=${token}`)
        .then(async (response) => {
          if (response.ok) {
            const data = await response.json();
            if (data.success === true || data.success === "true") {
              const successMsg = "✅ 이메일 인증이 완료되었습니다. 로그인 해주세요.";
              setMessage(successMsg);
              setMsgType("success");
              alert(successMsg);
              navigate("/login");
            } else {
              const errorMsg = "❌ 이메일 인증에 실패했습니다. 다시 시도해주세요.";
              setMessage(errorMsg);
              setMsgType("error");
              alert(errorMsg);
            }
          } else if (response.status === 401) {
            const errorMsg = "⛔ 인증 토큰이 만료되었거나 유효하지 않습니다.";
            setMessage(errorMsg);
            setMsgType("error");
            alert(errorMsg);
          } else if (response.status === 500) {
            const errorMsg = "🚨 서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
            setMessage(errorMsg);
            setMsgType("error");
            alert(errorMsg);
          } else {
            const errorMsg = "⚠️ 알 수 없는 오류가 발생했습니다.";
            setMessage(errorMsg);
            setMsgType("error");
            alert(errorMsg);
          }
        })
        .catch(() => {
          const errorMsg = "⚠️ 네트워크 오류가 발생했습니다. 다시 시도해주세요.";
          setMessage(errorMsg);
          setMsgType("error");
          alert(errorMsg);
        });
    }, 1500);

    return () => clearTimeout(timer);
  }, [location.search, navigate]);

  useEffect(() => {
    fetchStockData();
  }, [fetchStockData]);

  return (
    <PageWrapper>
      <Card>
        <Title>이메일 인증</Title>
        <Message className={msgType}>{message}</Message>
      </Card>
    </PageWrapper>
  );
};

export default EmailVerification;
