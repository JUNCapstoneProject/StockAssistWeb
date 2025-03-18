import React from 'react';
import styled from 'styled-components';

const StockHeader = () => {
  return (
    <HeaderContainer>
      <Title>테슬라 (TSLA) 분석</Title>
      <Description>테슬라의 최신 뉴스와 재무제표를 시가 분석하여 투자 인사이트를 제공합니다</Description>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.div`
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 20px auto 20px;
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: bold;
  margin: 0;
  margin-bottom: 8px;
`;

const Description = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
`;

export default StockHeader;
