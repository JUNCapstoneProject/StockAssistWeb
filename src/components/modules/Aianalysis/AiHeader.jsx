import React from 'react';
import styled from 'styled-components';

const AiHeader = () => {
  return (
    <HeaderWrapper>
      <Title>AI 투자 분석</Title>
      <Description>
        최신 뉴스와 재무제표를 AI가 분석하여 투자 인사이트를 제공합니다
      </Description>
    </HeaderWrapper>
  );
};

const HeaderWrapper = styled.div`
  padding: 40px 0;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 16px;
`;

const Description = styled.p`
  font-size: 16px;
  color: #666666;
  line-height: 1.5;
`;

export default AiHeader;
