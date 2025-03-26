import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';

const StockNews = ({ ticker }) => {
  const { state } = useLocation();
  const stockName = state?.name || ticker;

  const [newsData, setNewsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`http://localhost:8080/api/news/${ticker}`);
        if (!res.ok) throw new Error("뉴스 데이터를 가져오지 못했습니다.");
        const result = await res.json();
        setNewsData(result.data); // ✅ 백엔드 구조에 맞게 data 사용
      } catch (err) {
        console.error("❌ 뉴스 요청 오류:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (ticker) fetchNews();
  }, [ticker]);

  if (isLoading) return <NewsContainer>로딩 중...</NewsContainer>;
  if (error) return <NewsContainer>에러 발생: {error}</NewsContainer>;
  if (!newsData || newsData.length === 0) return <NewsContainer>뉴스 없음</NewsContainer>;

  return (
    <NewsContainer>
      <h2>{stockName} 관련 최신 뉴스</h2>
      {newsData.map((news, index) => (
        <NewsItem key={index}>
          <NewsHeader>
            <NewsTitle>{news.title}</NewsTitle>
            <NewsTag $type={news.type}>{news.type}</NewsTag>
          </NewsHeader>
          <NewsContent>{news.content}</NewsContent>
          <NewsFooter>
            <NewsSource>{news.source}</NewsSource>
            <NewsDate>{news.date}</NewsDate>
          </NewsFooter>
        </NewsItem>
      ))}
    </NewsContainer>
  );
};

const NewsContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const NewsItem = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const NewsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const NewsTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
`;

const NewsTag = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== '$type',
})`
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
  background-color: ${({ $type }) => 
    $type === '긍정' ? '#22c55e' :
    $type === '부정' ? '#ef4444' :
    $type === '중립' ? '#6b7280' : '#6b7280'};
  color: white;
`;

const NewsContent = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #4b5563;
`;

const NewsFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  font-size: 14px;
  color: #6b7280;
`;

const NewsSource = styled.span``;

const NewsDate = styled.span``;

export default StockNews;
