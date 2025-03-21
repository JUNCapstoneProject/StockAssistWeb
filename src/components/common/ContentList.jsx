import React from 'react';
import styled from 'styled-components';

const ContentList = ({ data }) => {
  return (
    <Container>
      <TopSection>
        {data.slice(0, 3).map((item, index) => (
          <ContentCard
            key={index}
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
            key={index}
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

export default ContentList;
