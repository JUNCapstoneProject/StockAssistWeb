import React from 'react';
import styled from 'styled-components';

const StockNews = () => {
  const newsData = [
    {
      title: '테슬라, 자율주행 기술 업데이트로 주가 상승',
      content: '테슬라가 최신 자율주행 소프트웨어 업데이트를 발표하여 주가가 3% 상승했습니다. 이번 업데이트는 도심 환경에서의 주행 성능을 크게 개선했다고 회사 측은 밝혔습니다.',
      source: '블룸버그',
      date: '2024.03.08',
      type: '긍정'
    },
  ];

  return (
    <NewsContainer>
      <h2>테슬라 관련 최신 뉴스</h2>
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

// ✅ 리팩토링: DOM에 전달되지 않도록 처리
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
