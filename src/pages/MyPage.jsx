import React from 'react';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from '../redux/features/auth/authSelectors';
import { Navigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Tab = styled.button`
  padding: 0.5rem 1rem;
  background: ${props => props.active ? '#4A55A7' : 'transparent'};
  color: ${props => props.active ? 'white' : '#333'};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background: ${props => props.active ? '#4A55A7' : '#f0f0f0'};
  }
`;

const Content = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const UserInfoGrid = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  align-items: center;
  margin-bottom: 2rem;
`;

const Label = styled.span`
  color: #666;
  font-size: 0.9rem;
`;

const Value = styled.span`
  color: #333;
  font-weight: 500;
`;

const BrokerageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

const BrokerageItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 8px;
`;

const BrokerLogo = styled.div`
  width: 32px;
  height: 32px;
  background: #eee;
  border-radius: 4px;
  margin-right: 1rem;
`;

const BrokerInfo = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

const UnlinkButton = styled.button`
  padding: 0.5rem 1rem;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #d32f2f;
  }
`;

const AddBrokerButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: #f8f9fa;
  border: 1px dashed #dee2e6;
  border-radius: 8px;
  color: #4A55A7;
  cursor: pointer;
  margin-top: 1rem;

  &:hover {
    background: #e9ecef;
  }
`;

const DeleteAccountButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 2rem;

  &:hover {
    background: #d32f2f;
  }
`;

const SectionTitle = styled.h2`
  color: #333;
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
`;

const MyPage = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const [activeTab, setActiveTab] = React.useState('계정 설정');

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Container>
      <TabContainer>
        <Tab active={activeTab === '계정 설정'} onClick={() => setActiveTab('계정 설정')}>
          계정 설정
        </Tab>
        <Tab active={activeTab === '보안'} onClick={() => setActiveTab('보안')}>
          보안
        </Tab>
      </TabContainer>

      <Content>
        <SectionTitle>기본 정보</SectionTitle>
        <UserInfoGrid>
          <Label>닉네임</Label>
          <Value>투자의신</Value>
          <Label>이메일</Label>
          <Value>hong@example.com</Value>
        </UserInfoGrid>

        <SectionTitle>증권사 연동 현황</SectionTitle>
        <BrokerageList>
          <BrokerageItem>
            <BrokerInfo>
              <BrokerLogo />
              <Value>미래에셋증권</Value>
            </BrokerInfo>
            <UnlinkButton>연동 해제</UnlinkButton>
          </BrokerageItem>
          <BrokerageItem>
            <BrokerInfo>
              <BrokerLogo />
              <Value>한국투자증권</Value>
            </BrokerInfo>
            <UnlinkButton>연동 해제</UnlinkButton>
          </BrokerageItem>
          <BrokerageItem>
            <BrokerInfo>
              <BrokerLogo />
              <Value>삼성증권</Value>
            </BrokerInfo>
            <UnlinkButton>연동 해제</UnlinkButton>
          </BrokerageItem>
          <AddBrokerButton>+ 새 증권사 연동하기</AddBrokerButton>
        </BrokerageList>

        <SectionTitle>계정 관리</SectionTitle>
        <div>
          회원 탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
          <DeleteAccountButton>회원 탈퇴</DeleteAccountButton>
        </div>
      </Content>
    </Container>
  );
};

export default MyPage; 