import React from 'react';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from '../redux/features/auth/authSelectors';
import { Navigate } from 'react-router-dom';
import AccountContent from '../components/modules/mypage/AccountContent';
import SecurityContent from '../components/modules/mypage/SecurityContent';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 2rem;
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 2rem;
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${props => props.active ? '#fff' : '#f8f9fa'};
  color: ${props => props.active ? '#4A55A7' : '#666'};
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: ${props => props.active ? '600' : '400'};

  &:hover {
    background: ${props => props.active ? '#fff' : '#f1f3f5'};
    color: ${props => props.active ? '#4A55A7' : '#333'};
  }

  &:first-child {
    border-right: 1px solid #dee2e6;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const MyPage = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const [activeTab, setActiveTab] = React.useState('계정 설정');

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Container>
      <PageTitle>마이페이지</PageTitle>
      <TabContainer>
        <Tab active={activeTab === '계정 설정'} onClick={() => setActiveTab('계정 설정')}>
          계정 설정
        </Tab>
        <Tab active={activeTab === '보안'} onClick={() => setActiveTab('보안')}>
          보안
        </Tab>
      </TabContainer>

      <Content>
        {activeTab === '계정 설정' ? <AccountContent /> : <SecurityContent />}
      </Content>
    </Container>
  );
};

export default MyPage;