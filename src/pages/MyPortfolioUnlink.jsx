import React from 'react';
import styled from 'styled-components';

const MyPortfolioUnlink = () => {
  return (
    <Container>
      <Header>
        <Title>나의 포트폴리오</Title>
        <ConnectButton>+ 증권사 연동하기</ConnectButton>
      </Header>
      <EmptyStateWrapper>
        <EmptyMessage>연동된 증권사가 없습니다</EmptyMessage>
      </EmptyStateWrapper>
    </Container>
  );
};

const Container = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
`;

const ConnectButton = styled.button`
  background-color: #4B50E6;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background-color: #3A3FB9;
  }
`;

const EmptyStateWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-radius: 12px;
  padding: 100px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const EmptyMessage = styled.p`
  color: #666;
  font-size: 16px;
`;

export default MyPortfolioUnlink;
