import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';

const StockNews = ({ ticker }) => {
  const { state } = useLocation();
  const stockName = state?.name || ticker;

  const [newsData, setNewsData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL;
        const res = await fetch(`${baseURL}/api/news?page=1&limit=100&category=TSLA`);
        if (!res.ok) throw new Error("뉴스 데이터를 가져오지 못했습니다.");
        const result = await res.json();

        const newsList = result.response?.news || [];
        setNewsData(newsList);
        setCurrentIndex(0);
      } catch (err) {
        console.error("❌ 뉴스 요청 오류:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (ticker) fetchNews();
  }, [ticker, stockName]);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 3, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 3, newsData.length - 3));
  };

  if (isLoading) return <NewsContainer>로딩 중...</NewsContainer>;
  if (error) return <NewsContainer>에러 발생: {error}</NewsContainer>;
  if (!newsData || newsData.length === 0) return <NewsContainer>뉴스 없음</NewsContainer>;

  return (
    <NewsContainer>
      <h2>{stockName} 관련 최신 뉴스</h2>
      <NewsSection>
        {newsData.slice(currentIndex, currentIndex + 3).map((news, index) => (
          <NewsItem 
            key={index}
            onClick={() => window.open(news.link, '_blank')}
          >
            <NewsHeader>
              <CategoryInfo>
                <Category>{news.category}</Category>
                <StatusBadge $status={news.status}>{news.status}</StatusBadge>
              </CategoryInfo>
              <Title>{news.title}</Title>
            </NewsHeader>
            <Description>{news.description}</Description>
            <CardFooter>
              <Source>{news.source}</Source>
              <Date>{news.date}</Date>
            </CardFooter>
          </NewsItem>
        ))}
      </NewsSection>

      <PaginationContainer>
        <PageButton
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          이전
        </PageButton>
        <PageButton
          onClick={handleNext}
          disabled={currentIndex + 3 >= newsData.length}
        >
          다음
        </PageButton>
      </PaginationContainer>
    </NewsContainer>
  );
};

// 전체 뉴스 영역 컨테이너
const NewsContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

// 뉴스 하나의 카드 스타일
const NewsItem = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.15s ease;
  width: 100%;

  &:hover {
    transform: translateY(-4px);
  }
`;

// 뉴스 상단 (제목과 태그)
const NewsHeader = styled.div`
  margin-bottom: 12px;
`;

const CategoryInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const Category = styled.span`
  font-size: 14px;
  color: #666;
`;

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  background-color: ${({ $status }) =>
    $status === '긍정' ? '#4CAF50' :
    $status === '부정' ? '#FF5252' :
    $status === '중립' ? '#757575' : '#757575'};
  color: white;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`;

const Description = styled.p`
  font-size: 14px;
  color: #666;
  margin: 8px 0;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
`;

const Source = styled.span`
  font-size: 14px;
  color: #666;
`;

const Date = styled.span`
  font-size: 14px;
  color: #999;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
  padding: 20px 0;
`;

const PageButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  font-size: 14px;

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
    opacity: 0.7;
  }

  &:hover:not(:disabled) {
    background-color: #f0f0f0;
  }
`;

// 새로운 스타일 컴포넌트 추가
const NewsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export default StockNews;
