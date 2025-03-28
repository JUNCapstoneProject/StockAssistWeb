import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const ReportDetail = () => {
  const { reportId } = useParams();
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("selectedUserReport");
    let parsed = null;

    if (stored) {
      parsed = JSON.parse(stored);
      console.log("로컬스토리지에서 불러온 데이터:", parsed);
      setReport(parsed); // 먼저 로컬 데이터 설정
    }

    const fetchReportDetail = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/reports/${reportId}`, {
          credentials: 'include'
        });
        const data = await response.json();
        console.log("API 응답 데이터:", data);

        if (data.response) {
          setReport(prev => ({
            ...(parsed || prev), // 기존 정보 유지
            content: data.response.content // content만 덮어씀
          }));
        }
      } catch (error) {
        console.error('리포트 상세 정보를 불러오는 중 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportDetail();
  }, [reportId]);

  useEffect(() => {
    return () => {
      localStorage.removeItem("selectedUserReport");
    };
  }, []);

  if (isLoading) return <div>로딩 중...</div>;
  if (!report) return <div>리포트를 찾을 수 없습니다.</div>;

  console.log("현재 report 상태:", report);

  return (
    <Container>
      <Header>
        <CategoryInfo>
          <Category>{report?.category || '카테고리 없음'}</Category>
          <Date>{report?.date || '날짜 없음'}</Date>
        </CategoryInfo>
        <Title>{report?.title || '제목 없음'}</Title>
        <Author>작성자: {report?.source || '작성자 없음'}</Author>
      </Header>
      <Content>
        <Description>{report?.description || '설명 없음'}</Description>
        {report?.content && (
          <MainContent dangerouslySetInnerHTML={{ __html: report.content }} />
        )}
      </Content>
    </Container>
  );
};

export default ReportDetail;


const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Header = styled.div`
  margin-bottom: 40px;
`;

const CategoryInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const Category = styled.span`
  font-size: 14px;
  color: #666;
`;

const Date = styled.span`
  font-size: 14px;
  color: #999;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 16px;
`;

const Author = styled.div`
  font-size: 14px;
  color: #666;
`;

const Content = styled.div`
  line-height: 1.6;
`;

const Description = styled.p`
  font-size: 18px;
  color: #444;
  margin-bottom: 32px;
`;

const MainContent = styled.div`
  font-size: 16px;
  color: #333;
`;
