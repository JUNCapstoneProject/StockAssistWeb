import React, { useState } from 'react';
import styled from 'styled-components';

const dummyData = [
  {
    name: '삼성전자',
    ticker: '005930',
    price: '78,000',
    change: 2.5,
    status: '긍정',
    손익계산서: [
      { name: '매출액', value: '2,796,048억', change: 1.2 },
      { name: '영업이익', value: '365,855억', change: -3.5 },
      { name: '당기순이익', value: '289,934억', change: 2.8 }
    ],
    대차대조표: [
      { name: '자산총계', value: '4,265,223억', change: 0.8 },
      { name: '부채총계', value: '1,205,501억', change: -1.2 },
      { name: '자본총계', value: '3,059,722억', change: 1.5 }
    ],
    현금흐름표: [
      { name: '영업활동현금흐름', value: '446,857억', change: 5.2 },
      { name: '투자활동현금흐름', value: '-285,914억', change: -2.1 },
      { name: '재무활동현금흐름', value: '-124,503억', change: -0.9 }
    ],
    주요비율: [
      { name: 'ROE', value: '9.45%', change: 0.5 },
      { name: '부채비율', value: '39.4%', change: -1.8 },
      { name: '유동비율', value: '265.8%', change: 2.3 }
    ]
  }
];

const FinancialStatement = () => {
  const [activeTab, setActiveTab] = useState('손익계산서');

  return (
    <Container>
      {dummyData.map((stock, index) => (
        <StockContainer key={index}>
          <StockHeader>
            <StockInfo>
              <StockName>{stock.name} ({stock.ticker})</StockName>
              <StockPrice>
                {stock.price} <PriceChange $change={stock.change}>{stock.change}%</PriceChange>
              </StockPrice>
            </StockInfo>
            <StatusBadge $status={stock.status}>{stock.status}</StatusBadge>
            </StockHeader>

          <TabWrapper>
            <TabItem $active={activeTab === '손익계산서'} onClick={() => setActiveTab('손익계산서')}>손익계산서</TabItem>
            <TabItem $active={activeTab === '대차대조표'} onClick={() => setActiveTab('대차대조표')}>대차대조표</TabItem>
            <TabItem $active={activeTab === '현금흐름표'} onClick={() => setActiveTab('현금흐름표')}>현금흐름표</TabItem>
            <TabItem $active={activeTab === '주요비율'} onClick={() => setActiveTab('주요비율')}>주요 비율</TabItem>
          </TabWrapper>

          <Table>
            {stock[activeTab === '주요비율' ? '주요비율' : activeTab].map((item, idx) => (
              <Row key={idx}>
                <Column>{item.name}</Column>
                <Column>{item.value}</Column>
                <Column $change={item.change}>{item.change}%</Column>
              </Row>
            ))}
          </Table>
        </StockContainer>
      ))}
    </Container>
  );
};

// ✅ 스타일 컴포넌트 수정
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
`;

const StockContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const StockHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StockInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const StockName = styled.h2`
  font-size: 18px;
  font-weight: bold;
`;

const StockPrice = styled.span`
  font-size: 16px;
`;

const PriceChange = styled.span`
  color: ${({ $change }) => ($change >= 0 ? 'green' : 'red')};
  margin-left: 5px;
`;

const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  color: white;
  background-color: ${({ $status }) => ($status === '긍정' ? '#4CAF50' : $status === '부정' ? '#FF5252' : '#757575')};
`;


const TabWrapper = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 10px;
`;

const TabItem = styled.div`
  padding: 10px 15px;
  cursor: pointer;
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  color: ${({ $active }) => ($active ? '#000' : '#666')};
  border-bottom: ${({ $active }) => ($active ? '2px solid #000' : 'none')};
`;

const Table = styled.div`
  margin-top: 15px;
`;

const Row = styled.div`  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
`;

const Column = styled.div`
  flex: 1;
  text-align: right;
  &:first-child {
    text-align: left;
  }
  color: ${({ $change }) => ($change !== undefined ? ($change >= 0 ? 'green' : 'red') : 'black')};
`;

export default FinancialStatement;

