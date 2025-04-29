import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import zxcvbn from "zxcvbn";
import "./SignupPage.css";

const SignupPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordScore, setPasswordScore] = useState(null);
  const [passwordFeedback, setPasswordFeedback] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [showEmailVerificationMessage, setShowEmailVerificationMessage] = useState(false);

  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    maxLength: true,
    noSpaces: true,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const validatePassword = (password) => {
    setPasswordValidation({
      minLength: password.length >= 8,
      maxLength: password.length <= 20,
      noSpaces: !/\s/.test(password),
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
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

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsEmailValid(validateEmail(newEmail));
  };

  const isNicknameValid = nickname.length >= 2 && nickname.length <= 10;
  const isPasswordValid = Object.values(passwordValidation).every((value) => value);

  const isFormValid =
    isNicknameValid &&
    email &&
    isEmailValid &&
    password &&
    confirmPassword &&
    isPasswordValid &&
    password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    const requiredScore = 2;
    if (passwordScore === null || passwordScore < requiredScore) {
      let suggestionMessage = "";
      if (passwordFeedback) {
        if (passwordFeedback.warning) suggestionMessage += passwordFeedback.warning;
        if (passwordFeedback.suggestions && passwordFeedback.suggestions.length > 0)
          suggestionMessage += " " + passwordFeedback.suggestions.join(" ");
      }
      setErrorMessage(`비밀번호 강도가 낮습니다. ${suggestionMessage}`);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname, email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        setShowEmailVerificationMessage(true);
      } else {
        if (response.status === 409) {
          setErrorMessage("이미 존재하는 이메일입니다.");
        } else if (response.status === 400) {
          setErrorMessage(data.message || "입력 형식이 올바르지 않습니다.");
        } else {
          setErrorMessage("회원가입에 실패했습니다.");
        }
      }
    } catch (error) {
      console.error("회원가입 오류:", error);
      setErrorMessage("회원가입 중 오류가 발생했습니다.");
    }
  };

  if (showEmailVerificationMessage) {
    return (
      <div className="signup-page">
        <div className="signup-container">
          <h2>이메일 인증 안내</h2>
          <p>
            회원가입 성공! 입력하신 이메일로 인증 메일이 발송되었습니다.
            이메일의 링크를 클릭하여 계정을 활성화해주세요.
          </p>
          <button onClick={() => navigate("/login", { state: { from } })} className="login-redirect-btn">
            로그인 페이지로 이동
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h2>회원가입</h2>
        <p>새 계정을 만들어보세요</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>닉네임</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임을 입력하세요"
            />
            {!isNicknameValid && nickname.length > 0 && (
              <p className="error-message">닉네임은 2자 이상 10자 이하여야 합니다.</p>
            )}
          </div>

          <div className="form-group">
            <label>이메일</label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="name@example.com"
            />
            {email && !isEmailValid && (
              <p className="error-message">올바른 이메일 형식이 아닙니다.</p>
            )}
          </div>

          <div className="form-group">
            <label>비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
            />
            <div className="password-requirements">
              <p>비밀번호는 다음 조건을 만족해야 합니다:</p>
              <ul>
                <li className={passwordValidation.minLength ? "valid" : "invalid"}>최소 8자 이상</li>
                <li className={passwordValidation.maxLength ? "valid" : "invalid"}>20자 이하</li>
                <li className={passwordValidation.noSpaces ? "valid" : "invalid"}>공백 없이</li>
                <li className={passwordValidation.hasUpperCase ? "valid" : "invalid"}>대문자 포함</li>
                <li className={passwordValidation.hasLowerCase ? "valid" : "invalid"}>소문자 포함</li>
                <li className={passwordValidation.hasNumber ? "valid" : "invalid"}>숫자 포함</li>
                <li className={passwordValidation.hasSpecialChar ? "valid" : "invalid"}>특수문자 포함</li>
              </ul>
            </div>
          </div>

          <div className="form-group">
            <label>비밀번호 확인</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호를 다시 입력하세요"
            />
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button type="submit" className="signup-submit-btn" disabled={!isFormValid}>
            가입하기
          </button>
        </form>

        <p className="login-link">
          이미 계정이 있으신가요? {" "}
          <button onClick={() => navigate("/login", { state: { from } })} className="login-link-button">
            로그인
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;