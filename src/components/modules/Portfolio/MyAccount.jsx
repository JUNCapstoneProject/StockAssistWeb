import React from 'react';
import styled from 'styled-components';
import refresh from '../../../../public/images/refresh.svg';

const MyAccount = () => {
  return (
    <Container>
      <Header>
        <Title>나의 잔고</Title>
        <RefreshButton>
          <img src={refresh} alt="refresh" /> 새로고침
        </RefreshButton>
      </Header>

      <AccountGrid>
        <AccountItem>
          <Label>총 자산</Label>
          <Value>$12,458.32</Value>
          <Change $positive>
            +2.4% ($293.45)
          </Change>
        </AccountItem>

        <AccountItem>
          <Label>투자 금액</Label>
          <Value>$11,200.00</Value>
        </AccountItem>

        <AccountItem>
          <Label>평가 손익</Label>
          <Value className="profit">+$1,258.32</Value>
          <ProfitRate>
            <Highlight>수익률 +11.2%</Highlight>
          </ProfitRate>
        </AccountItem>

        <AccountItem>
          <Label>예수금</Label>
          <Value>$3,245.67</Value>
        </AccountItem>
      </AccountGrid>
    </Container>
  );
};

const Container = styled.div`
  padding: 16px;
  margin-top: 20px;
  background: white;
  border-radius: 12px;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
`;

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  border: none;
  background: none;
  color: #666;
  cursor: pointer;

  &:hover {
    color: #333;
  }
`;

const AccountGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const AccountItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.span`
  font-size: 14px;
  color: #666;
`;

const Value = styled.span`
  font-size: 24px;
  font-weight: 600;

  &.profit {
    color: #2ecc71;
  }
`;

// ✅ DOM에 전달되지 않도록 `$positive` + withConfig 사용
const Change = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== '$positive',
})`
  font-size: 14px;
  color: ${({ $positive }) => $positive ? '#2ecc71' : '#e74c3c'};
`;

const ProfitRate = styled.span`
  font-size: 14px;
  color: #2ecc71;
`;

const Highlight = styled.span`
  background: rgba(46, 204, 113, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
`;

export default MyAccount;
