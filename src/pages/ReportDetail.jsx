import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";

const ReportDetail = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
          `http://localhost:8080/api/reports/${reportId}`,
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

  if (isLoading) return <div>로딩 중...</div>;
  if (!report) return <div>리포트를 찾을 수 없습니다.</div>;

  return (
    <Container>
      <Header>
        <CategoryInfo>
          <Category>{report.category || "카테고리 없음"}</Category>
          <Date>{report.date || "날짜 없음"}</Date>
        </CategoryInfo>
        <Title>{report.title || "제목 없음"}</Title>
        <Author>작성자: {report.source || "작성자 없음"}</Author>
      </Header>
      <Content>
        <Description>{report.description || "설명 없음"}</Description>
        {report.content && (
          <MainContent dangerouslySetInnerHTML={{ __html: report.content }} />
        )}
      </Content>

      {/* ✅ 작성자인 경우에만 수정/삭제 버튼 표시 */}
      {report.isAuthor && (
        <ButtonGroup>
          <ActionButton onClick={() => navigate(`/report/${report.id}/edit`)}>
            수정
          </ActionButton>
          <ActionButton>삭제</ActionButton>
        </ButtonGroup>
      )}
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
