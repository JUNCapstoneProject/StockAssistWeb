/**
 * 콘텐츠 목록을 표시하는 컴포넌트
 * 상단에 주요 콘텐츠를 크게 표시하고, 하단에 나머지 콘텐츠를 리스트로 표시
 */

import React, { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

const ContentList = ({ data, currentPage, hasNext, onPageChange, onItemClick }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const listRef = useRef(null);

  // 현재 페이지가 report 페이지인지, 사용자 report인지 확인
  const isReportPage = window.location.pathname === '/report';
  const isUserReport = isReportPage && window.location.search.includes('type=user');

  // URL 파라미터 변경 감지 및 페이지 변경 처리
  useEffect(() => {
    const pageParam = searchParams.get('page');
    const typeParam = searchParams.get('type');

    if (pageParam) {
      onPageChange(Number(pageParam));
    }

    if (isUserReport && !typeParam) {
      setSearchParams({ type: 'user', page: pageParam || '1' });
    }
  }, [onPageChange, searchParams, isUserReport, setSearchParams]);

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || (pageNumber > currentPage && hasNext === false)) return;

    const currentType = searchParams.get('type');
    setSearchParams({
      ...(currentType && { type: currentType }),
      page: pageNumber
    });
    onPageChange(pageNumber);
  };

  // 아이템 클릭 핸들러
  const handleClick = (item) => {
    onItemClick(item.id);
  };

  return (
    <Container ref={listRef}>
      {/* 상단 주요 콘텐츠 섹션 */}
      {!isUserReport && (
        <TopSection>
          {data.slice(0, 3).map((item, index) => (
            <ContentCard
              key={item.id || index}
              $featured
              onClick={() => handleClick(item)}
            >
              <CardHeader>
                <CategoryInfo>
                  <Category>{item.category}</Category>
                  {!isReportPage && (
                    <StatusBadge $status={item.status}>{item.status}</StatusBadge>
                  )}
                </CategoryInfo>
                <Title>{item.title}</Title>
              </CardHeader>
              <Description>{item.description}</Description>
              <CardFooter>
                <Source>{item.source}</Source>
                <Date>{item.date}</Date>
              </CardFooter>
            </ContentCard>
          ))}
        </TopSection>
      )}
      {/* 하단 콘텐츠 리스트 섹션 */}
      <BottomSection>
        {(isUserReport ? data : data.slice(3)).map((item, index) => (
          <ContentCard
            key={item.id || index}
            onClick={() => handleClick(item)}
          >
            <CardHeader>
              <CategoryInfo>
                <Category>{item.category}</Category>
                {!isReportPage && (
                  <StatusBadge $status={item.status}>{item.status}</StatusBadge>
                )}
              </CategoryInfo>
              <Title>{item.title}</Title>
            </CardHeader>
            <Description>{item.description}</Description>
            <CardFooter>
              <Source>{item.source}</Source>
              <Date>{item.date}</Date>
            </CardFooter>
          </ContentCard>
        ))}
      </BottomSection>
      {/* 페이지네이션 컨트롤 */}
      <PaginationContainer>
        <PageButton
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          이전
        </PageButton>
        <PageButton
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={hasNext === false}
        >
          다음
        </PageButton>
      </PaginationContainer>
    </Container>
  );
};

export default ContentList;

// 스타일 컴포넌트 정의
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
`;

const TopSection = styled.div`
  display: flex;
  gap: 16px;
`;

const BottomSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ContentCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex: ${({ $featured }) => ($featured ? '1' : 'none')};
  min-width: ${({ $featured }) => ($featured ? '30%' : '100%')};
  cursor: pointer;
  transition: transform 0.15s ease;

  &:hover {
    transform: translateY(-4px);
  }
`;

const CardHeader = styled.div`
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

const PageInfo = styled.span`
  font-size: 14px;
  color: #666;
`;
