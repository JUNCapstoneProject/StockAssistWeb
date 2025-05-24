import React from 'react';
import styled from 'styled-components';
import axiosInstance from '../../../api/axiosInstance';

const MyStock = ({ stocks, loading, error }) => {
  if (loading) return <StockContainer>로딩 중...</StockContainer>;
  if (error) return <StockContainer>{error}</StockContainer>;
  if (!stocks.length) return <StockContainer>보유 주식이 없습니다.</StockContainer>;

  return (
    <StockContainer>
      <h2>보유 주식</h2>
      <StockTable>
        <thead>
          <tr>
            <th>종목명</th>
            <th>현재가</th>
            <th>평가 손익</th>
            <th>보유수량</th>
            <th>매입금액</th>
            <th>평가금액</th>
            <th>수익률</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr key={stock.symbol}>
              <td>
                <StockName>{stock.name}</StockName>
                <StockSymbol>{stock.symbol}</StockSymbol>
              </td>
              <td>${Number(stock.currentPrice).toLocaleString()}</td>
              <td>
                <PriceChange $positive={Number(stock.evalProfit) >= 0}>
                  {Number(stock.evalProfit) >= 0 ? '+' : ''}
                  {Number(stock.evalProfit).toLocaleString()}원
                </PriceChange>
              </td>
              <td>{stock.quantity}주</td>
              <td>${Number(stock.purchaseAmount).toLocaleString()}</td>
              <td>${Number(stock.evalAmount).toLocaleString()}</td>
              <td>
                <ReturnRate $positive={Number(stock.profitRate) >= 0}>
                  {Number(stock.profitRate) >= 0 ? '+' : ''}
                  {Number(stock.profitRate).toFixed(2)}%
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
