/**
 * 리포트 작성 페이지 컴포넌트
 * 사용자가 새로운 투자 리포트를 작성할 수 있는 페이지
 * 제목, 내용, 작성자 정보를 입력받아 저장
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const ReportCreate = () => {
  const navigate = useNavigate();

  // 상태 관리
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author] = useState('테크투자러'); // 또는 로그인 사용자 이름

  // 리포트 제출 핸들러
  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    const newReport = {
      title,
      content,
      source: author,
      date: new Date().toISOString().slice(0, 10),
      description: content.slice(0, 100), // 간단한 설명 자동 생성
    };

    // 임시로 localStorage에 저장
    const reports = JSON.parse(localStorage.getItem('userReports') || '[]');
    const updatedReports = [...reports, newReport];
    localStorage.setItem('userReports', JSON.stringify(updatedReports));

    alert('리포트가 저장되었습니다!');
    navigate('/report');
  };

  return (
    <Wrapper>
      <DateText>{new Date().toISOString().slice(0, 10)}</DateText>
      <TitleInput
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="리포트 제목을 입력하세요"
      />
      <AuthorText>작성자: {author}</AuthorText>

      <ContentInput
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="리포트 내용을 입력하세요"
      />

      <ButtonGroup>
        <CancelButton onClick={() => navigate('/report')}>취소</CancelButton>
        <SubmitButton onClick={handleSubmit}>저장</SubmitButton>
      </ButtonGroup>
    </Wrapper>
  );
};

// 스타일 컴포넌트 정의
const Wrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
`;

const DateText = styled.div`
  color: #666;
  margin-bottom: 16px;
`;

const TitleInput = styled.input`
  width: 100%;
  padding: 12px;
  font-size: 24px;
  border: none;
  border-bottom: 2px solid #eee;
  margin-bottom: 16px;
  outline: none;

  &:focus {
    border-bottom-color: #4B50E6;
  }
`;

const AuthorText = styled.div`
  color: #666;
  margin-bottom: 24px;
`;

const ContentInput = styled.textarea`
  width: 100%;
  height: 400px;
  padding: 16px;
  font-size: 16px;
  line-height: 1.6;
  border: 1px solid #eee;
  border-radius: 8px;
  resize: none;
  outline: none;

  &:focus {
    border-color: #4B50E6;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
`;

const CancelButton = styled(Button)`
  background-color: #f5f5f5;
  color: #666;
  border: none;

  &:hover {
    background-color: #e5e5e5;
  }
`;

const SubmitButton = styled(Button)`
  background-color: #4B50E6;
  color: white;
  border: none;

  &:hover {
    background-color: #3A3FB9;
  }
`;

export default ReportCreate;

