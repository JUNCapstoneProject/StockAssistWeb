import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const ReportCreate = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author] = useState('테크투자러'); // 또는 로그인 사용자 이름

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
        <CancelButton onClick={() => navigate(-1)}>취소</CancelButton>
        <SaveButton onClick={handleSubmit}>리포트 저장</SaveButton>
      </ButtonGroup>
    </Wrapper>
  );
};

export default ReportCreate;

const Wrapper = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`;

const DateText = styled.div`
  font-size: 14px;
  color: #999;
  margin-bottom: 16px;
`;

const TitleInput = styled.input`
  font-size: 24px;
  font-weight: 600;
  width: 100%;
  border: none;
  outline: none;
  margin-bottom: 8px;

  &::placeholder {
    color: #aaa;
  }
`;

const AuthorText = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 24px;
  text-align: right;
`;

const ContentInput = styled.textarea`
  width: 100%;
  min-height: 300px;
  font-size: 16px;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #ddd;
  resize: vertical;
  margin-bottom: 24px;

  &::placeholder {
    color: #bbb;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const CancelButton = styled.button`
  padding: 10px 20px;
  background: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 8px;
  cursor: pointer;
`;

const SaveButton = styled.button`
  padding: 10px 20px;
  background: #4B3FFF;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: #3a31e4;
  }
`;

