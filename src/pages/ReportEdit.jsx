// ReportEdit.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";

const ReportEdit = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "", content: "" });

  useEffect(() => {
    const stored = localStorage.getItem(`report_${reportId}`);
    if (stored) {
      setForm(JSON.parse(stored));
    }
  }, [reportId]);

  const handleSave = async () => {
    await fetch(`http://localhost:8080/api/reports/${reportId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });

    localStorage.setItem(`report_${reportId}`, JSON.stringify(form));
    navigate(`/report/${reportId}`);
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
          placeholder="본문을 입력하세요 (HTML 포함)"
          rows={15}
        />
      </Content>
      <ButtonGroup>
        <ActionButton onClick={handleSave}>저장</ActionButton>
        <ActionButton onClick={() => navigate(-1)}>취소</ActionButton>
      </ButtonGroup>
    </Container>
  );
};

export default ReportEdit;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Header = styled.div`
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 24px;
`;

const Content = styled.div`
  line-height: 1.6;
`;

const InputField = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 16px;
  font-size: 18px;
  border: 1px solid #ddd;
  border-radius: 8px;
  
  &:focus {
    outline: none;
    border-color: #666;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  margin-bottom: 16px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #666;
  }
`;

const ButtonGroup = styled.div`
  margin-top: 40px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const ActionButton = styled.button`
  padding: 10px 20px;
  font-size: 14px;
  background-color: #444;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #222;
  }
`;
