import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return width;
};

const ContentList = ({ data, currentPage, hasNext, onPageChange, onItemClick }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const listRef = useRef(null);
  const width = useWindowWidth();
  const isMobile = width <= 768;
  const [wishlistItems, setWishlistItems] = useState({});

  const reportType = searchParams.get("type");
  const isReportPage = window.location.pathname === '/report';
  const isUserReport = reportType === '사용자 리포트';

  useEffect(() => {
    const pageParam = searchParams.get('page');
    if (pageParam) {
      onPageChange(Number(pageParam));
    }
    if (isUserReport && !reportType) {
      setSearchParams({ type: 'user', page: pageParam || '1' });
    }
  }, [onPageChange, searchParams, isUserReport, reportType, setSearchParams]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || (pageNumber > currentPage && hasNext === false)) return;
    const currentType = searchParams.get('type');
    setSearchParams({ ...(currentType && { type: currentType }), page: pageNumber });
    onPageChange(pageNumber);
  };

  const handleClick = (item) => {
    if (item.link) {
      window.open(item.link, '_blank');
    } else if (onItemClick) {
      onItemClick(item.id);
    }
  };

  const handleWishlistToggle = async (e, item) => {
    e.stopPropagation(); // 카드 클릭 방지
    const token = localStorage.getItem("accessToken");
    const symbol = item.id;

    try {
      if (!wishlistItems[symbol]) {
        const res = await fetch('/api/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ symbol }),
        });
        const result = await res.json();
        if (result.success) {
          setWishlistItems(prev => ({ ...prev, [symbol]: true }));
        }
      } else {
        const res = await fetch(`/api/wishlist/${symbol}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const result = await res.json();
        if (result.success) {
          setWishlistItems(prev => ({ ...prev, [symbol]: false }));
        }
      }
    } catch (err) {
      console.error("찜 처리 오류:", err);
    }
  };

  return (
    <Container ref={listRef}>
      {!isUserReport ? (
        <>
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
                        <StatusWithHeart>
                          <HeartIconSmall
                            $active={wishlistItems[item.id]}
                            onClick={(e) => handleWishlistToggle(e, item)}
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
                          </HeartIconSmall>
                          <StatusBadge $status={item.status}>{item.status}</StatusBadge>
                        </StatusWithHeart>
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
                $featured={isMobile}
                onClick={() => handleClick(item)}
              >
                {isMobile ? (
                  <>
                    <CardHeader>
                      <CategoryInfo>
                        <Category>{item.category}</Category>
                        {!isReportPage && (
                          <StatusWithHeart>
                            <HeartIconSmall
                              $active={wishlistItems[item.id]}
                              onClick={(e) => handleWishlistToggle(e, item)}
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
                            </HeartIconSmall>
                            <StatusBadge $status={item.status}>{item.status}</StatusBadge>
                          </StatusWithHeart>
                        )}
                      </CategoryInfo>
                      <Title>{item.title}</Title>
                    </CardHeader>
                    <Description>{item.description}</Description>
                    <CardFooter>
                      <Source>{item.source}</Source>
                      <Date>{item.date}</Date>
                    </CardFooter>
                  </>
                ) : (
                  <Row>
                    <LeftColumn>
                      <Category>{item.category}</Category>
                      <Source>{item.source}</Source>
                    </LeftColumn>
                    <CenterColumn>
                      <BadgeAndText>
                        {!isReportPage && (
                          <StatusWithHeart>
                            <HeartIconSmall
                              $active={wishlistItems[item.id]}
                              onClick={(e) => handleWishlistToggle(e, item)}
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
                            </HeartIconSmall>
                            <StatusBadge $status={item.status}>{item.status}</StatusBadge>
                          </StatusWithHeart>
                        )}
                        <TextWrapper>
                          <Title>{item.title}</Title>
                          <Description>{item.description}</Description>
                        </TextWrapper>
                      </BadgeAndText>
                    </CenterColumn>
                    <RightColumn>
                      <Date>{item.date}</Date>
                    </RightColumn>
                  </Row>
                )}
              </ContentCard>
            ))}
          </BottomSection>
        </>
      ) : (
        <BottomSection>
          {data.map((item, index) => (
            <ContentCard
              key={item.id || index}
              $featured={isMobile}
              onClick={() => handleClick(item)}
            >
              <CardHeader>
                <CategoryInfo>
                  <Category>{item.category}</Category>
                  {!isReportPage && (
                    <StatusWithHeart>
                      <HeartIconSmall
                        $active={wishlistItems[item.id]}
                        onClick={(e) => handleWishlistToggle(e, item)}
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
                      </HeartIconSmall>
                      <StatusBadge $status={item.status}>{item.status}</StatusBadge>
                    </StatusWithHeart>
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

      <PaginationContainer>
        <PageButton onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          이전
        </PageButton>
        <PageButton onClick={() => handlePageChange(currentPage + 1)} disabled={hasNext === false}>
          다음
        </PageButton>
      </PaginationContainer>
    </Container>
  );
};

export default ContentList;

// ===== styled-components =====

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
  box-shadow: ${({ $featured }) => $featured ? '0 4px 12px rgba(0, 0, 0, 0.1)' : 'none'};
  flex: ${({ $featured }) => ($featured ? '1' : 'none')};
  min-width: ${({ $featured }) => ($featured ? '30%' : '100%')};
  width: 100%;
  max-width: 100%;
  cursor: pointer;
  transition: transform 0.15s ease;
  position: relative;

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
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
`;

const StatusWithHeart = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const HeartIconSmall = styled.svg`
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

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  min-width: 120px;
  gap: 8px;

  @media (max-width: 768px) {
    min-width: auto;
  }
`;


const CenterColumn = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 2;
  padding-left: 120px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    padding-left: 0;
  }
`;

const BadgeAndText = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  min-width: 80px;
`;

const BadgeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 48px;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  gap: 4px;

  @media (max-width: 768px) {
    width: 100%;
    padding-left: 0;
  }
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
  white-space: nowrap;

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
