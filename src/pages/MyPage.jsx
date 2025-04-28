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

const Section = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  color: #333;
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
`;

const UserInfoGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.span`
  color: #666;
  font-size: 0.9rem;
`;

const Value = styled.span`
  color: #333;
  font-size: 0.9rem;
`;

const BrokerageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 3rem;
`;

const BrokerageItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-radius: 4px;
`;

const BrokerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const BrokerIcon = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #4A55A7;
`;

const UnlinkButton = styled.button`
  padding: 0.25rem 0.75rem;
  background: white;
  color: #666;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background: #f8f9fa;
  }
`;

const AddBrokerButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: white;
  border: 1px dashed #dee2e6;
  border-radius: 4px;
  color: #4A55A7;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background: #f8f9fa;
  }
`;

const AccountManagement = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: #666;
  font-size: 0.9rem;
`;

const DeleteAccountButton = styled.button`
  padding: 0.75rem 0.75rem;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  margin-top: 0.5rem;
  width: fit-content;

  &:hover {
    background: #d32f2f;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: #4A55A7;
  }
`;

const ChangePasswordButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #4A55A7;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  width: fit-content;

  &:hover {
    background: #3c4688;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const FormLabel = styled.label`
  font-size: 0.9rem;
  color: #333;
`;

const SecurityContent = () => {
  return (
    <Section>
      <SectionTitle>비밀번호 변경</SectionTitle>
      <form>
        <FormGroup>
          <FormLabel>현재 비밀번호</FormLabel>
          <Input type="password" />
        </FormGroup>
        <FormGroup>
          <FormLabel>새 비밀번호</FormLabel>
          <Input type="password" />
        </FormGroup>
        <FormGroup>
          <FormLabel>새 비밀번호 확인</FormLabel>
          <Input type="password" />
        </FormGroup>
        <ChangePasswordButton type="submit">비밀번호 변경</ChangePasswordButton>
      </form>
    </Section>
  );
};

const AccountContent = () => {
  return (
    <>
      <Section>
        <SectionTitle>기본 정보</SectionTitle>
        <UserInfoGrid>
          <InfoItem>
            <Label>닉네임</Label>
            <Value>투자의신</Value>
          </InfoItem>
          <InfoItem>
            <Label>이메일</Label>
            <Value>hong@example.com</Value>
          </InfoItem>
        </UserInfoGrid>
      </Section>

      <Section>
        <SectionTitle>증권사 연동 현황</SectionTitle>
        <BrokerageList>
          <BrokerageItem>
            <BrokerInfo>
              <BrokerIcon>미</BrokerIcon>
              <Value>미래에셋증권</Value>
            </BrokerInfo>
            <UnlinkButton>연동 해제</UnlinkButton>
          </BrokerageItem>
          <BrokerageItem>
            <BrokerInfo>
              <BrokerIcon>한</BrokerIcon>
              <Value>한국투자증권</Value>
            </BrokerInfo>
            <UnlinkButton>연동 해제</UnlinkButton>
          </BrokerageItem>
          <BrokerageItem>
            <BrokerInfo>
              <BrokerIcon>삼</BrokerIcon>
              <Value>삼성증권</Value>
            </BrokerInfo>
            <UnlinkButton>연동 해제</UnlinkButton>
          </BrokerageItem>
          <AddBrokerButton>+ 새 증권사 연동하기</AddBrokerButton>
        </BrokerageList>
      </Section>

      <Section>
        <SectionTitle>계정 관리</SectionTitle>
        <AccountManagement>
          회원 탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
          <DeleteAccountButton>회원 탈퇴</DeleteAccountButton>
        </AccountManagement>
      </Section>
    </>
  );
};

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