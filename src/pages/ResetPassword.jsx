// 비밀번호 재설정(ResetPassword) 페이지 - 토큰 기반 비밀번호 재설정 UI 및 로직 구현
import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import zxcvbn from "zxcvbn";

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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
`;

const PasswordRequirements = styled.ul`
  text-align: left;
  margin: 0 0 8px 0;
  padding: 0 0 0 18px;
  font-size: 0.95rem;
  color: #666;

  li {
    margin-bottom: 2px;
    &.valid { color: #2e7d32; }
    &.invalid { color: #d32f2f; }
  }
`;

const SubmitBtn = styled.button`
  background: #4f8cff;
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
  &:hover:enabled {
    background: #2355d6;
  }
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    maxLength: true,
    noSpaces: true,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  const [passwordScore, setPasswordScore] = useState(null);
  const [passwordFeedback, setPasswordFeedback] = useState(null);
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const validatePassword = (pw) => {
    setPasswordValidation({
      minLength: pw.length >= 8,
      maxLength: pw.length <= 20,
      noSpaces: !/\s/.test(pw),
      hasUpperCase: /[A-Z]/.test(pw),
      hasLowerCase: /[a-z]/.test(pw),
      hasNumber: /[0-9]/.test(pw),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(pw),
    });
  };

  useEffect(() => {
    if (password) {
      const evaluation = zxcvbn(password);
      setPasswordScore(evaluation.score);
      setPasswordFeedback(evaluation.feedback);
      validatePassword(password);
    } else {
      setPasswordScore(null);
      setPasswordFeedback(null);
      setPasswordValidation({
        minLength: false,
        maxLength: true,
        noSpaces: true,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSpecialChar: false,
      });
    }
  }, [password]);

  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  const isPasswordValid = Object.values(passwordValidation).every((v) => v);
  const isFormValid = password && confirmPassword && isPasswordValid && password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMsgType("");
  
    if (!token) {
      setMessage("잘못된 접근입니다. 인증 토큰이 없습니다.");
      setMsgType("error");
      return;
    }
  
    if (password !== confirmPassword) {
      setMessage("비밀번호가 일치하지 않습니다.");
      setMsgType("error");
      return;
    }
  
    const requiredScore = 2;
    if (passwordScore === null || passwordScore < requiredScore) {
      let suggestionMessage = "";
      if (passwordFeedback) {
        if (passwordFeedback.warning) suggestionMessage += passwordFeedback.warning;
        if (passwordFeedback.suggestions?.length > 0) {
          suggestionMessage += " " + passwordFeedback.suggestions.join(" ");
        }
      }
      setMessage(`비밀번호 강도가 낮습니다. ${suggestionMessage}`);
      setMsgType("error");
      return;
    }
  
    setSubmitting(true);
    try {
      const response = await fetch(`${baseURL}/api/auth/password-reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
  
      const data = await response.json();
  
      if (response.ok && (data.success === true || data.success === "true")) {
        setMessage("✅ 비밀번호가 성공적으로 재설정되었습니다. 로그인 해주세요.");
        setMsgType("success");
      } else if (response.status === 401) {
        setMessage("⛔ 인증 토큰이 만료되었거나 유효하지 않습니다.");
        setMsgType("error");
      } else if (response.status === 500) {
        setMessage("🚨 서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        setMsgType("error");
      } else {
        setMessage(data.message || "⚠️ 알 수 없는 오류가 발생했습니다.");
        setMsgType("error");
      }
    } catch (err) {
      setMessage("⚠️ 네트워크 오류가 발생했습니다. 다시 시도해주세요.");
      setMsgType("error");
    } finally {
      setSubmitting(false);
    }
  };
  

  return (
    <PageWrapper>
      <Card>
        <Title>비밀번호 재설정</Title>
        {message && <Message className={msgType}>{message}</Message>}
        {msgType === "success" ? (
          <GoLoginBtn onClick={() => navigate("/login")}>로그인 페이지로 이동</GoLoginBtn>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Input
              type="password"
              placeholder="새 비밀번호 입력"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
              disabled={submitting}
            />
            <Input
              type="password"
              placeholder="새 비밀번호 확인"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              disabled={submitting}
            />
            <PasswordRequirements>
              <li className={passwordValidation.minLength ? "valid" : "invalid"}>최소 8자 이상</li>
              <li className={passwordValidation.maxLength ? "valid" : "invalid"}>20자 이하</li>
              <li className={passwordValidation.noSpaces ? "valid" : "invalid"}>공백 없이</li>
              <li className={passwordValidation.hasUpperCase ? "valid" : "invalid"}>대문자 포함</li>
              <li className={passwordValidation.hasLowerCase ? "valid" : "invalid"}>소문자 포함</li>
              <li className={passwordValidation.hasNumber ? "valid" : "invalid"}>숫자 포함</li>
              <li className={passwordValidation.hasSpecialChar ? "valid" : "invalid"}>특수문자 포함</li>
            </PasswordRequirements>
            <SubmitBtn type="submit" disabled={!isFormValid || submitting}>
              {submitting ? "재설정 중..." : "비밀번호 재설정"}
            </SubmitBtn>
          </Form>
        )}
      </Card>
    </PageWrapper>
  );
};

export default ResetPassword; 