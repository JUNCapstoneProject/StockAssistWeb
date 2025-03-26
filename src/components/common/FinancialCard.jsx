import React from 'react';
import styled from 'styled-components';

const FinancialCard = ({ stock, activeTab, onTabChange }) => {
  return (
    <CardContainer>
      <Header>
        <Info>
          <Name>{stock.name} ({stock.ticker})</Name>
          <Price>
            ${stock.price}{' '}
            <Change $change={stock.change}>
              {stock.change >= 0 ? '▲' : '▼'} {stock.change}%
            </Change>
          </Price>
        </Info>
        <Badge $status={stock.status}>{stock.status}</Badge>
      </Header>

      <Tabs>
        {['손익계산서', '대차대조표', '현금흐름표', '주요비율'].map((tab) => (
          <Tab
            key={tab}
            $active={activeTab === tab}
            onClick={() => onTabChange(stock.ticker, tab)}
          >
            {tab}
          </Tab>
        ))}
      </Tabs>

      <Table>
        {stock[activeTab === '주요비율' ? '주요비율' : activeTab].map((item, idx) => (
          <Row key={idx}>
            <Col>{item.name}</Col>
            <Col>{item.value}</Col>
            <Col $change={item.change}>
              {item.change >= 0 ? '+' : ''}
              {item.change}%
            </Col>
          </Row>
        ))}
      </Table>
    </CardContainer>
  );
};

export default FinancialCard;

// ----------------------- styled-components -----------------------

const CardContainer = styled.div`
  background: #ffffff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
`;

const Name = styled.h2`
  font-size: 18px;
  font-weight: bold;
`;

const Price = styled.div`
  font-size: 16px;
  margin-top: 4px;
`;

const Change = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== '$change',
})`
  color: ${({ $change }) => ($change >= 0 ? '#4CAF50' : '#FF5252')};
  margin-left: 6px;
`;

const Badge = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== '$status',
})`
  padding: 6px 12px;
  font-size: 12px;
  border-radius: 16px;
  background-color: ${({ $status }) =>
    $status === '긍정' ? '#4CAF50' :
    $status === '부정' ? '#FF5252' :
    '#757575'};
  color: white;
`;

const Tabs = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 14px;
`;

const Tab = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== '$active',
})`
  padding: 10px 16px;
  cursor: pointer;
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  color: ${({ $active }) => ($active ? '#000' : '#666')};
  border-bottom: ${({ $active }) => ($active ? '2px solid #000' : 'none')};
`;

const Table = styled.div`
  margin-top: 15px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #e0e0e0;
`;

const Col = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== '$change',
})`
  flex: 1;
  text-align: right;

  &:first-child {
    text-align: left;
  }

  color: ${({ $change }) =>
    $change !== undefined ? ($change >= 0 ? '#4CAF50' : '#FF5252') : '#000'};
`;
