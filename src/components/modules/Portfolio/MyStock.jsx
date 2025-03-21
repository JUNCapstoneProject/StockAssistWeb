import React from 'react';
import styled from 'styled-components';

const MyStock = () => {
  const stockData = [
    {
      name: '테슬라',
      symbol: 'TSLA',
      broker: '미래증권',
      currentPrice: 175.21,
      priceChange: 208.15,
      quantity: 15,
      purchaseAmount: 2420.00,
      currentAmount: 2628.15,
      returnRate: 8.4
    },
    {
      name: '엔비디아',
      symbol: 'NVDA',
      broker: '한국증권',
      currentPrice: 824.18,
      priceChange: 1593.44,
      quantity: 8,
      purchaseAmount: 5000.00,
      currentAmount: 6593.44,
      returnRate: 32.1
    },
    {
      name: '애플',
      symbol: 'AAPL',
      broker: '글로벌증권',
      currentPrice: 182.52,
      priceChange: 135.36,
      quantity: 18,
      purchaseAmount: 3150.00,
      currentAmount: 3285.36,
      returnRate: 4.2
    },
    {
      name: '알파벳',
      symbol: 'GOOGL',
      broker: '대신증권',
      currentPrice: 142.65,
      priceChange: -78.63,
      quantity: 10,
      purchaseAmount: 1505.13,
      currentAmount: 1426.50,
      returnRate: -5.2
    }
  ];

  return (
    <StockContainer>
      <h2>보유 주식</h2>
      <StockTable>
        <thead>
          <tr>
            <th>종목명</th>
            <th>증권사</th>
            <th>현재가</th>
            <th>평가 손익</th>
            <th>보유수량</th>
            <th>매입금액</th>
            <th>평가금액</th>
            <th>수익률</th>
          </tr>
        </thead>
        <tbody>
          {stockData.map((stock) => (
            <tr key={stock.symbol}>
              <td>
                <StockName>{stock.name}</StockName>
                <StockSymbol>{stock.symbol}</StockSymbol>
              </td>
              <td>{stock.broker}</td>
              <td>${stock.currentPrice.toFixed(2)}</td>
              <td>
                <PriceChange $positive={stock.priceChange >= 0}>
                  {stock.priceChange >= 0 ? '+' : ''}
                  ${Math.abs(stock.priceChange).toFixed(2)}
                </PriceChange>
              </td>
              <td>{stock.quantity}주</td>
              <td>${stock.purchaseAmount.toFixed(2)}</td>
              <td>${stock.currentAmount.toFixed(2)}</td>
              <td>
                <ReturnRate $positive={stock.returnRate >= 0}>
                  {stock.returnRate >= 0 ? '+' : ''}
                  {stock.returnRate}%
                </ReturnRate>
              </td>
            </tr>
          ))}
        </tbody>
      </StockTable>
    </StockContainer>
  );
};

const StockContainer = styled.div`
  padding: 16px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  max-width: 1000px;
  margin: 24px auto 0;
  
  h2 {
    margin-bottom: 16px;
    padding: 0 8px;
    font-size: 18px;
  }
`;

const StockTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 8px;
    text-align: left;
    border-bottom: 1px solid #eee;
    font-size: 14px;
  }

  th {
    background-color: white;
    font-weight: 600;
    border-bottom: 2px solid #eee;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
`;

const StockName = styled.div`
  font-weight: 500;
  font-size: 14px;
`;

const StockSymbol = styled.div`
  color: #666;
  font-size: 12px;
`;

const PriceChange = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== '$positive',
})`
  color: ${({ $positive }) => $positive ? '#2ecc71' : '#e74c3c'};
`;

const ReturnRate = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== '$positive',
})`
  color: ${({ $positive }) => $positive ? '#2ecc71' : '#e74c3c'};
  font-weight: 500;
`;

export default MyStock;
