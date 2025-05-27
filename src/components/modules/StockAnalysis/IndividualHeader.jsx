import React from 'react';
import styled from 'styled-components';

const IndividualHeader = () => {
  return (
    <HeaderWrapper>
      <Title>주식 분석</Title>
      <Description>
        시총 상위 종목과 관심 종목의 주요 지표를 비교하고, 주가 흐름을 한눈에 확인해보세요.
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

export default IndividualHeader;
