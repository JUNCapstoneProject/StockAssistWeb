import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import fetchWithAssist from '../../../fetchWithAssist';

const StockNews = ({ ticker, wishlist, setWishlist }) => {
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
        const res = await fetchWithAssist(`${baseURL}/api/news?page=1&limit=100&category=${ticker}`);
        const result = await res.json();

        const newsList = result.response?.news || [];
        if (newsList.length > 0) {
          const convertedNewsData = newsList.filter(news => news?.title && news?.link).map(news => ({
            ...news,
            categories: news.categories.map(cat => ({
              ...cat,
              status: String(cat.aiScore),
              wished: cat.wished || false
            }))
          }));
          setNewsData(convertedNewsData);
          setCurrentIndex(0);
          setError(null);
        } else if (!res.ok) {
          throw new Error("뉴스 데이터를 가져오지 못했습니다.");
        } else {
          setNewsData([]);
          setCurrentIndex(0);
          setError(null);
        }
      } catch (err) {
        console.error("❌ 뉴스 요청 오류:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (ticker) fetchNews();
  }, [ticker]);

  const toggleWishlist = async (e, symbol) => {
    e.stopPropagation();
    const token = localStorage.getItem("accessToken");
    const isFav = wishlist[symbol];

    try {
      if (!isFav) {
        const res = await fetch('/api/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`,
            "Destination": "assist"
          },
          body: JSON.stringify({ symbol })
        });
        const result = await res.json();
        if (result.success) setWishlist(prev => ({ ...prev, [symbol]: true }));
      } else {
        const res = await fetch(`/api/wishlist/${symbol}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `${token}`,
            "Destination": "assist"
          }
        });
        const result = await res.json();
        if (result.success) setWishlist(prev => ({ ...prev, [symbol]: false }));
      }
    } catch (err) {
      console.error("찜 처리 오류:", err);
    }
  };

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
              {news.categories && news.categories.length > 0 ? (
                news.categories.map((cat, idx) => (
                  <CategoryInfo key={idx}>
                    <Category>{cat.name}</Category>
                    <StatusBadge $status={cat.status}>
                      {cat.status === "0"
                        ? "부정"
                        : cat.status === "1"
                        ? "중립"
                        : cat.status === "2"
                        ? "긍정"
                        : "알수없음"}
                    </StatusBadge>
                    <HeartIcon
                      $active={wishlist[cat.name] || cat.wished}
                      onClick={(e) => toggleWishlist(e, cat.name)}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5
                          -1.935 0-3.597 1.126-4.312 2.733
                          -.715-1.607-2.377-2.733-4.313-2.733
                          C5.1 3.75 3 5.765 3 8.25
                          c0 7.22 9 12 9 12s9-4.78 9-12Z"
                      />
                    </HeartIcon>
                  </CategoryInfo>
                ))
              ) : (
                <CategoryInfo>
                  <Category>카테고리 없음</Category>
                  <StatusBadge $status={"0"}>중립</StatusBadge>
                </CategoryInfo>
              )}
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
  max-width: 900px;
  margin: 0 auto;
  margin-top: 0;
  padding: 4px 24px 20px 24px;
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
    $status === '2' ? '#4CAF50' :
    $status === '0' ? '#FF5252' :
    $status === '1' ? '#757575' : '#757575'};
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

const HeaderContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 28px 24px 20px 24px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  min-width: 0;
  box-sizing: border-box;

  @media (max-width: 600px) {
    padding-left: 12px;
    padding-right: 12px;
  }
`;

const HeartIcon = styled.svg`
  width: 24px;
  height: 24px;
  cursor: pointer;
  stroke: ${({ $active }) => ($active ? '#e53935' : '#888')};
  fill: ${({ $active }) => ($active ? '#e53935' : 'none')};
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.2);
    stroke: #e53935;
  }

  &:active {
    transform: scale(1);
  }
`;

export default StockNews;
