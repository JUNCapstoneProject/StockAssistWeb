import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

const ContentList = ({ data, totalItems, currentPage, onPageChange }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const itemsPerPage = 6;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const listRef = React.useRef(null);
 
  useEffect(() => {
    const pageParam = searchParams.get('page');
    if (pageParam) {
      onPageChange(Number(pageParam));
    }
  }, [onPageChange, searchParams]); // ✅ 의존성 추가

  const handlePageChange = (pageNumber) => {
    // URL 파라미터 업데이트
    setSearchParams({ page: pageNumber });
    onPageChange(pageNumber);
  };

  return (
    <Container ref={listRef}>
      <TopSection>
        {data.slice(0, 3).map((item, index) => (
          <ContentCard
            key={item.id || index}
            $featured
            onClick={() => window.open(item.link, '_blank')}
          >
            <CardHeader>
              <CategoryInfo>
                <Category>{item.category}</Category>
                <StatusBadge $status={item.status}>{item.status}</StatusBadge>
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
      <BottomSection>
        {data.slice(3).map((item, index) => (
          <ContentCard
            key={item.id || index}
            onClick={() => window.open(item.link, '_blank')}
          >
            <CardHeader>
              <CategoryInfo>
                <Category>{item.category}</Category>
                <StatusBadge $status={item.status}>{item.status}</StatusBadge>
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
      <PaginationContainer>
        <PageButton 
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          이전
        </PageButton>
        <PageButton 
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          다음
        </PageButton>
      </PaginationContainer>
    </Container>
  );
};

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

export default ContentList;
