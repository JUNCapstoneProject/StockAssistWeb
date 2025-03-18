import React, { useState } from 'react';
import styled from 'styled-components';
import StockFinancials from './StockFinancial';

const StockTab = () => {
  const [activeTab, setActiveTab] = useState('손익계산서');

  const tabs = ['손익계산서', '대차대조표', '현금흐름표', '주요 비율'];

  const renderContent = () => {
    switch (activeTab) {
      case '대차대조표':
        return <StockFinancials type="balance" />;
      case '손익계산서':
        return <StockFinancials type="income" />;
      case '현금흐름표':
        return <StockFinancials type="cashflow" />;
      case '주요 비율':
        return <StockFinancials type="ratio" />;
      default:
        return null;
    }
  };

  return (
    <div>
      <Container>
        <StockHeader>
          <StockInfo>
            <StockName>
              테슬라 (TSLA)
              <StockTag>주식</StockTag>
            </StockName>
            <PriceInfo>
              <Price>$180.05</Price>
              <PriceChange positive>+2.3% ↑</PriceChange>
            </PriceInfo>
          </StockInfo>
        </StockHeader>

        <TabList>
          {tabs.map((tab) => (
            <TabItem
              key={tab}
              active={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </TabItem>
          ))}
        </TabList>
        <ContentArea>
          {renderContent()}
        </ContentArea>
      </Container>
    </div>
  );
};

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

const StockHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
`;

const StockInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StockName = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 600;
`;

const StockTag = styled.span`
  background-color: #22c55e;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
`;

const PriceInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Price = styled.span`
  font-size: 24px;
  font-weight: 700;
`;

const PriceChange = styled.span`
  color: ${props => props.positive ? '#22c55e' : '#ef4444'};
  font-size: 16px;
`;

const TabList = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 0 4px;
  background-color: #f8f9fa;
  margin: 4px;
  border-radius: 6px;
  gap: 4px;
`;

const TabItem = styled.button`
  padding: 12px 0;
  border: none;
  background: ${props => props.active ? '#fff' : 'transparent'};
  font-size: 14px;
  cursor: pointer;
  color: ${props => props.active ? '#000' : '#666'};
  border-radius: 6px;
  transition: all 0.2s ease-in-out;
  font-weight: ${props => props.active ? '600' : '400'};

  &:hover {
    background: ${props => props.active ? '#fff' : '#f1f3f5'};
  }
`;

const ContentArea = styled.div`
  background-color: #fff;
  padding: 20px;
`;

export default StockTab;