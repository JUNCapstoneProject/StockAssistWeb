/**
 * 리포트 상세 페이지 컴포넌트
 * 특정 리포트의 상세 내용을 표시하는 페이지
 * 작성자 권한에 따른 수정/삭제 기능 제공
 */

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axiosInstance from '../api/axiosInstance';
import fetchWithAssist from '../fetchWithAssist';

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
  
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    let accessToken = localStorage.getItem("accessToken");
    // accessToken이 'Bearer '로 시작하면 앞부분 제거
    if (accessToken && accessToken.startsWith("Bearer ")) {
      accessToken = accessToken.slice(7);
    }
    const fetchReportDetail = async () => {
      try {
        const response = await fetchWithAssist(
          `${baseURL}/api/reports/${reportId}`,
          {
            credentials: "include",
            headers: {
              "Authorization": `Bearer ${accessToken}`,
              "Content-Type": "application/json",
              "Destination": "assist"
            }
          }
        );
        const data = await response.json();
        console.log('API 응답 데이터:', data);
        console.log('isAuthor 값:', data.response?.isAuthor);
  
        if (data.response?.content) {
          const updated = {
            ...(parsed || {}),
            content: data.response.content,
            isAuthor: data.response.isAuthor,
          };
          console.log('업데이트된 리포트 데이터:', updated);
          setReport(updated);
          localStorage.setItem(`report_${reportId}`, JSON.stringify(updated));
        }
      } catch (error) {
        alert("리포트 상세 정보를 불러오는 중 오류: " + error.message);
        console.error("리포트 상세 정보를 불러오는 중 오류:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    if (!parsed || !parsed.content) {
      fetchReportDetail();
    } else {
      setIsLoading(false); // 👈 fetch 안 해도 로딩 끝냄
    }
  }, [reportId]);
  
  // report 상태가 변경될 때마다 확인
  useEffect(() => {
    if (report) {
      console.log('현재 리포트 상태:', report);
      console.log('isAuthor 상태:', report.isAuthor);
    }
  }, [report]);
  
  // 로딩 및 에러 상태 처리
  if (isLoading) return <div>로딩 중...</div>;
  if (!report) return <div>리포트를 찾을 수 없습니다.</div>;

  // 리포트 삭제 핸들러
  const handleDelete = async () => {
    if (!window.confirm("정말로 이 리포트를 삭제하시겠습니까?")) return;

    try {
      const response = await axiosInstance.delete(`/api/reports/${reportId}`);
      if (response.data.success) {
        localStorage.removeItem(`report_${reportId}`);
        navigate('/report?type=사용자 리포트&page=1'); // ✅ 사용자 탭으로 이동
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
            {Array.isArray(report.category)
              ? report.category.map((cat, idx) => (
                  <CategoryTag key={idx}>{cat}</CategoryTag>
                ))
              : report.category && <CategoryTag>{report.category}</CategoryTag>
            }
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
