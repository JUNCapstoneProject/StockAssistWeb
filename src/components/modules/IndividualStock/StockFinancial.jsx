import React from 'react';
import styled from 'styled-components';

const StockFinancials = () => {
  return (
    <Container>
      <FinancialItem>
        <Label>총자산</Label>
        <Value>
          <Amount>$128.11B</Amount>
          <Change positive>+14.2% ↑</Change>
        </Value>
      </FinancialItem>

      <FinancialItem>
        <Label>총부채</Label>
        <Value>
          <Amount>$41.37B</Amount>
          <Change positive>+6.9% ↑</Change>
        </Value>
      </FinancialItem>

      <FinancialItem>
        <Label>자본금</Label>
        <Value>
          <Amount>$86.74B</Amount>
          <Change positive>+17.3% ↑</Change>
        </Value>
      </FinancialItem>

      <FinancialItem>
        <Label>부채비율</Label>
        <Value>
          <Amount>32.3%</Amount>
          <Change negative>-4.8% ↓</Change>
        </Value>
      </FinancialItem>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 20px auto;
`;

const FinancialItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled.span`
  font-size: 14px;
  color: #666;
`;

const Value = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Amount = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

const Change = styled.span`
  font-size: 14px;
  color: ${props => props.positive ? '#22c55e' : '#ef4444'};
`;

export default StockFinancials;