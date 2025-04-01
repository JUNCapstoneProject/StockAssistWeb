/**
 * 리포트 수정 페이지 컴포넌트
 * 기존 리포트의 내용을 수정할 수 있는 페이지
 * 제목, 설명, 내용을 수정하고 저장 가능
 */

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";

const ReportEdit = () => {
  // URL 파라미터와 라우팅 관련 훅
  const { reportId } = useParams();
  const navigate = useNavigate();

  // 폼 상태 관리
  const [form, setForm] = useState({ title: "", description: "", content: "" });

  // 기존 리포트 데이터 로딩
  useEffect(() => {
    const stored = localStorage.getItem(`report_${reportId}`);
    if (stored) {
      setForm(JSON.parse(stored));
    }
  }, [reportId]);

  // 리포트 저장 핸들러
  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/reports/${reportId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      if (response.ok) {
        localStorage.setItem(`report_${reportId}`, JSON.stringify(form));
        navigate(`/report/${reportId}`);
      } else {
        alert("리포트 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("리포트 수정 중 오류:", error);
      alert("리포트 수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <Container>
      <Header>
        <Title>리포트 수정</Title>
        <InputField
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="제목을 입력하세요"
        />
        <TextArea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="설명을 입력하세요"
          rows={3}
        />
      </Header>
      <Content>
        <TextArea
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          placeholder="내용을 입력하세요"
          rows={20}
        />
      </Content>
      <ButtonGroup>
        <CancelButton onClick={() => navigate(`/report/${reportId}`)}>
          취소
        </CancelButton>
        <SaveButton onClick={handleSave}>저장</SaveButton>
      </ButtonGroup>
    </Container>
  );
};

// 스타일 컴포넌트 정의
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
`;

const Header = styled.div`
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
`;

const InputField = styled.input`
  width: 100%;
  padding: 12px;
  font-size: 18px;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-bottom: 16px;
  outline: none;

  &:focus {
    border-color: #4B50E6;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  resize: none;
  outline: none;

  &:focus {
    border-color: #4B50E6;
  }
`;

const Content = styled.div`
  margin-bottom: 24px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
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

const SaveButton = styled(Button)`
  background-color: #4B50E6;
  color: white;
  border: none;

  &:hover {
    background-color: #3A3FB9;
  }
`;

export default ReportEdit;
