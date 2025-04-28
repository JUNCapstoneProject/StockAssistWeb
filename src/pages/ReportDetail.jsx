/**
 * 리포트 상세 페이지 컴포넌트
 * 특정 리포트의 상세 내용을 표시하는 페이지
 * 작성자 권한에 따른 수정/삭제 기능 제공
 */

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";

const ReportDetail = () => {
  // URL 파라미터와 라우팅 관련 훅
  const { reportId } = useParams();
  const navigate = useNavigate();

  // 상태 관리
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 리포트 상세 정보 로딩
  useEffect(() => {
    const stored = localStorage.getItem(`report_${reportId}`);
    let parsed = null;

    if (stored) {
      parsed = JSON.parse(stored);
      setReport(parsed);
    }

    const fetchReportDetail = async () => {
      try {
        const response = await fetch(
          `http://assist-server-service:4003/api/reports/${reportId}`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();

        if (data.response?.content) {
          const updated = {
            ...(parsed || {}),
            content: data.response.content,
            isAuthor: data.response.isAuthor, // ✅ 서버에서 받은 값 반영
          };
          setReport(updated);
          localStorage.setItem(`report_${reportId}`, JSON.stringify(updated));
        }
      } catch (error) {
        console.error("리포트 상세 정보를 불러오는 중 오류:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportDetail();
  }, [reportId]);

  // 로딩 및 에러 상태 처리
  if (isLoading) return <div>로딩 중...</div>;
  if (!report) return <div>리포트를 찾을 수 없습니다.</div>;

  // 리포트 삭제 핸들러
  const handleDelete = async () => {
    if (!window.confirm("정말로 이 리포트를 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(
        `http://assist-server-service:4003/api/reports/${reportId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        localStorage.removeItem(`report_${reportId}`);
        navigate("/report");
      } else {
        alert("리포트 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("리포트 삭제 중 오류:", error);
      alert("리포트 삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <Container>
      <BackButton onClick={() => navigate("/report")}>
        ← 리포트 목록 보기
      </BackButton>
      
      <ContentWrapper>
        <MetaInfo>
          <DateWrapper>
            <Date>{report.date}</Date>
          </DateWrapper>
          <CategoryWrapper>
            <CategoryTag>기업분석</CategoryTag>
            <CategoryTag>전기차 기술의 우위</CategoryTag>
            <CategoryTag>자율주행 기술</CategoryTag>
          </CategoryWrapper>
        </MetaInfo>

        <Title>{report.title}</Title>
        
        <AuthorInfo>
          작성자: <Author>{report.source}</Author>
        </AuthorInfo>

        <Content>{report.content}</Content>

        {report.isAuthor && (
          <ButtonGroup>
            <EditButton onClick={() => navigate(`/report/${reportId}/edit`)}>
              수정
            </EditButton>
            <DeleteButton onClick={handleDelete}>삭제</DeleteButton>
          </ButtonGroup>
        )}
      </ContentWrapper>
    </Container>
  );
};

// 스타일 컴포넌트 정의
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 24px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #666;
  font-size: 16px;
  cursor: pointer;
  padding: 0;
  margin-bottom: 32px;
  
  &:hover {
    color: #333;
  }
`;

const ContentWrapper = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const MetaInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
`;

const DateWrapper = styled.div`
  margin-bottom: 4px;
`;

const CategoryWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Date = styled.span`
  color: #666;
  font-size: 14px;
`;

const CategoryTag = styled.span`
  background-color: #f0f0f0;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
  color: #666;
  
  &:hover {
    background-color: #e5e5e5;
  }
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
`;

const AuthorInfo = styled.div`
  color: #666;
  font-size: 14px;
  margin-bottom: 32px;
`;

const Author = styled.span`
  color: #333;
  font-weight: 500;
`;

const Content = styled.div`
  font-size: 16px;
  line-height: 1.8;
  color: #333;
  margin-bottom: 32px;
  white-space: pre-wrap;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #eee;
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  font-size: 14px;
`;

const EditButton = styled(Button)`
  background-color: #4B50E6;
  color: white;
  border: none;

  &:hover {
    background-color: #3A3FB9;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #ff4444;
  color: white;
  border: none;

  &:hover {
    background-color: #cc0000;
  }
`;

export default ReportDetail;
