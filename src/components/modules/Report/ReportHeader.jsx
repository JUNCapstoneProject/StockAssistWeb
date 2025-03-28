import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; // ✅ 추가

const ReportHeader = () => {
  const navigate = useNavigate(); // ✅ navigate 선언

  const handleCreateClick = () => {
    navigate('/report/create'); // ✅ 원하는 경로로 이동
  };

  return (
    <HeaderWrapper>
      <ContentWrapper>
        <div>
          <Title>리포트 센터</Title>
          <Description>
            진단가 보고서 사용자 리포트를 확인하고 공유하세요
          </Description>
        </div>
        <CreateButton onClick={handleCreateClick}>
          <PlusIcon>+</PlusIcon>
          리포트 작성하기
        </CreateButton>
      </ContentWrapper>
    </HeaderWrapper>
  );
};

const HeaderWrapper = styled.div`
  padding: 40px 0 24px;
`;

const ContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const CreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background-color: #4B3FFF;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background-color: #3D32E6;
  }
`;

const PlusIcon = styled.span`
  font-size: 16px;
  font-weight: 600;
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
