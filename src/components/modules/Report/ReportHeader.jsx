import React from 'react';
import styled from 'styled-components';

const ReportHeader = () => {
  return (
    <HeaderWrapper>
      <Title>리포트 센터</Title>
      <Description>
        진단가 보고서 사용자 리포트를 확인하고 공유하세요
      </Description>
    </HeaderWrapper>
  );
};

const HeaderWrapper = styled.div`
  padding: 40px 0 24px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #111111;
  margin-bottom: 8px;
`;

const Description = styled.p`
  font-size: 16px;
  color: #666666;
  line-height: 1.5;
`;

export default ReportHeader;
