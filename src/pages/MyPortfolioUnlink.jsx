/**
 * 미연동 포트폴리오 페이지 컴포넌트
 * 증권사와 연동되지 않은 사용자를 위한 빈 상태 페이지
 * 증권사 연동 기능을 제공
 */

import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from '../redux/features/auth/authSelectors';
import LoginModal from '../components/common/LoginModal';

const MyPortfolioUnlink = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const [isLoginModalOpen, setIsLoginModalOpen] = React.useState(false);

  const handleConnectClick = () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }
    // TODO: 증권사 연동 로직 구현
  };

  return (
    <Container>
      {/* 페이지 헤더 */}
      <Header>
        <Title>나의 포트폴리오</Title>
        <ConnectButton onClick={handleConnectClick}>+ 증권사 연동하기</ConnectButton>
      </Header>
      {/* 빈 상태 메시지 */}
      <EmptyStateWrapper>
        <EmptyMessage>연동된 증권사가 없습니다</EmptyMessage>
      </EmptyStateWrapper>

      {/* 로그인 모달 */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSignupClick={() => {
          setIsLoginModalOpen(false);
          // TODO: 회원가입 모달로 전환하는 로직 추가
        }}
      />
    </Container>
  );
};

// 스타일 컴포넌트 정의
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
