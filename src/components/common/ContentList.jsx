import React, { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

const ContentList = ({ data, currentPage, hasNext, onPageChange, onItemClick }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const listRef = useRef(null);

  // URL 파라미터로부터 타입(type) 파악
  const reportType = searchParams.get("type");
  const isReportPage = window.location.pathname === '/report';
  const isUserReport = reportType === '사용자 리포트'; // 사용자가 작성한 리포트 탭인지 확인

  // URL의 page/type 파라미터 변경 감지 및 상태 업데이트
  useEffect(() => {
    const pageParam = searchParams.get('page');

    // 현재 page 파라미터가 있으면 부모 컴포넌트에 알림
    if (pageParam) {
      onPageChange(Number(pageParam));
    }

    // 사용자 리포트인데 type 파라미터가 없는 경우 기본값 설정
    if (isUserReport && !reportType) {
      setSearchParams({ type: 'user', page: pageParam || '1' });
    }
  }, [onPageChange, searchParams, isUserReport, reportType, setSearchParams]);

  // 페이지 변경 버튼 핸들러
  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || (pageNumber > currentPage && hasNext === false)) return;

    const currentType = searchParams.get('type');
    setSearchParams({
      ...(currentType && { type: currentType }),
      page: pageNumber
    });
    onPageChange(pageNumber);
  };

  // 리포트 항목 클릭 시
  const handleClick = (item) => {
    if (item.link) {
      window.open(item.link, '_blank');
    } else if (onItemClick) {
      onItemClick(item.id);
    }
  };

  return (
    <Container ref={listRef}>
      {!isUserReport ? (
        <>
          {/* 전문가 리포트 레이아웃 */}
          {data.length > 0 && (
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
          <BottomSection>
            {data.slice(3).map((item, index) => (
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
        </>
      ) : (
        /* 사용자 리포트 레이아웃 */
        <BottomSection>
          {data.map((item, index) => (
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
      )}

      {/* 페이지네이션 영역 */}
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

// ========== styled-components ==========

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
`;

const TopSection = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;

  @media (max-width: 769px) {
    flex-direction: column;
  }
`;

const BottomSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

const ContentCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex: ${({ $featured }) => ($featured ? '1' : 'none')};
  min-width: ${({ $featured }) => ($featured ? '30%' : '100%')};
  width: 100%;
  max-width: 100%;
  cursor: pointer;
  transition: transform 0.15s ease;

  @media (max-width: 769px) {
    min-width: 100%;
  }

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
  flex-direction: column;
  align-items: flex-start;
  margin-top: 12px;
`;

const Source = styled.span`
  font-size: 14px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
