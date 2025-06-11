import React from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from '../../../redux/features/auth/authSelectors';

const ReportHeader = ({ currentTab }) => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const handleCreateClick = () => {
    if (!isLoggedIn) {
    navigate('/login', { state: { from: '/report?type=사용자 리포트&page=1' } });
      return;
    }
    navigate('/report/create');
  };

  return (
    <>
      <HeaderWrapper>
        <Row>
          <Title>리포트 센터</Title>
          {currentTab === '사용자 리포트' && (
            <CreateButton onClick={handleCreateClick}>+ 리포트 작성</CreateButton>
          )}
        </Row>
        <Description>전문가 분석과 사용자 리포트를 확인하고 공유하세요</Description>
      </HeaderWrapper>
    </>
  );
};

const HeaderWrapper = styled.div`
  padding: 40px 0;
  text-align: center;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: relative;
  width: 100%;
  margin-bottom: 0;
  padding-right: 24px;
  min-height: 56px;

  @media (max-width: 600px) {
    padding-right: 12px;
    min-height: 40px;
  }
`;

const CreateButton = styled.button`
  padding: 12px 20px;
  background-color: #4B3FFF;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  align-self: flex-start;
  white-space: nowrap;
  transition: all 0.2s;
  margin-top: 0;
  min-width: 100px;
  min-height: 40px;

  &:hover {
    background-color: #3D32E6;
  }

  @media (max-width: 600px) {
    font-size: 11px;
    padding: 6px 10px;
    border-radius: 5px;
    margin-top: 12px;
    align-self: center;
    min-width: unset;
    min-height: unset;
  }
`;

const PlusIcon = styled.span`
  font-size: 16px;
  font-weight: 600;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 16px;
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  pointer-events: none;

  @media (max-width: 600px) {
    font-size: 32px;
  }
`;

const Description = styled.p`
  font-size: 16px;
  color: #666666;
  line-height: 1.5;
`;

export default ReportHeader;
