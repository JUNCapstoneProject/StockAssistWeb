import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from '../../../redux/features/auth/authSelectors';
import LoginModal from '../../common/LoginModal';

const ReportHeader = () => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleCreateClick = () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }
    navigate('/report/create');
  };

  return (
    <>
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

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSignupClick={() => {
          setIsLoginModalOpen(false);
          // 회원가입 모달로 전환하는 로직은 필요하다면 추가
        }}
      />
    </>
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
