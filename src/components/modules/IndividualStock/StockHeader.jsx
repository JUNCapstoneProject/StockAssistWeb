import React from 'react';
import styled from 'styled-components';

const StockHeader = ({ ticker, name }) => {
  return (
    <Wrapper>
      <HeaderContainer>
        <Title>{name} ({ticker})</Title>
        <Description>{name}의 최신 뉴스와 재무제표를 시가 분석하여 투자 인사이트를 제공합니다</Description>
      </HeaderContainer>
    </Wrapper>
  );
};

const HeaderContainer = styled.div`
  padding: 28px 24px 20px 24px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  max-width: 850px;
  margin: 32px auto;
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

const Wrapper = styled.div`
  padding-left: 24px;
  padding-right: 24px;
`;

export default StockHeader;
