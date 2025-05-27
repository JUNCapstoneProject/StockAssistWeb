/**
 * 주식 종목의 재무 정보를 표시하는 카드 컴포넌트
 * 손익계산서, 대차대조표, 현금흐름표, 주요비율 등의 재무 정보를 탭으로 구분하여 표시
 */

import React from 'react';
import styled from 'styled-components';

const FinancialCard = ({ stock, activeTab, onTabChange }) => {
  return (
    <CardContainer>
      {/* 종목 정보 헤더 */}
      <Header>
        <Info>
          <Name>{stock.name} ({stock.ticker})</Name>
          <Price>
            ${stock.price}{' '}
            <Change $change={stock.change}>
              {stock.change >= 0 ? '▲' : '▼'} {Number(stock.change).toFixed(2)}%
            </Change>
          </Price>
        </Info>
        <Badge $status={stock.status}>{stock.status}</Badge>
      </Header>

      {/* 재무 정보 탭 */}
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

      {/* 재무 정보 테이블 */}
      <Table>
        {stock[activeTab === '주요비율' ? '주요비율' : activeTab].map((item, idx) => (
          <Row key={idx}>
            <Col align="left">{item.name}</Col>
            <Col align="right">
              <RightGroup>
                <span>{item.value}</span>
                <Change $change={item.change}>
                  {item.change >= 0 ? '+' : ''}{Number(item.change).toFixed(2)}%
                </Change>
              </RightGroup>
            </Col>
          </Row>
        ))}
      </Table>
    </CardContainer>
  );
};

export default FinancialCard;

// 스타일 컴포넌트 정의
const CardContainer = styled.div`
  background: #fff;
  padding: 28px 32px 20px 32px;
  border-radius: 18px;
  box-shadow: 0 4px 16px rgba(30, 34, 40, 0.08);
  margin-bottom: 28px;
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 8px 24px rgba(30, 34, 40, 0.13);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Name = styled.h2`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Price = styled.div`
  font-size: 18px;
  font-weight: 500;
  margin-top: 2px;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Change = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== '$change',
})`
  color: ${({ $change }) => ($change >= 0 ? '#1db954' : '#e53935')};
  font-weight: 600;
  font-size: 15px;
  margin-left: 2px;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Badge = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== '$status',
})`
  padding: 6px 16px;
  font-size: 13px;
  border-radius: 16px;
  background-color: ${({ $status }) =>
    $status === '긍정' ? '#1db954' :
    $status === '부정' ? '#e53935' :
    '#757575'};
  color: white;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Tabs = styled.div`
  display: flex;
  gap: 0;
  margin-top: 18px;
  border-bottom: 1.5px solid #e0e0e0;
  overflow-x: auto;
`;

const Tab = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== '$active',
})`
  flex: 1;
  min-width: 0;
  padding: 0.5em 1em 0.4em 1em;
  cursor: pointer;
  font-size: clamp(11px, 1.2vw, 16px);
  font-weight: ${({ $active }) => ($active ? '700' : '400')};
  color: ${({ $active }) => ($active ? '#222' : '#888')};
  border-bottom: ${({ $active }) => ($active ? '3px solid #1db954' : 'none')};
  background: #fff;
  transition: color 0.15s, border-bottom 0.15s;
  white-space: nowrap;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Table = styled.div`
  margin-top: 18px;
`;

const LeftGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 13px 0;
  border-bottom: 1px solid #f0f0f0;
  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background: #fafbfc;
  }
`;

const Col = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== '$change' && prop !== 'align',
})`
  flex: 1;
  text-align: ${({ align }) => align || 'right'};
  font-size: 16px;
  font-family: 'Pretendard', 'Noto Sans KR', sans-serif;
  &:first-child {
    font-weight: 500;
    color: #222;
  }
  color: ${({ $change }) =>
    $change !== undefined ? ($change >= 0 ? '#1db954' : '#e53935') : '#222'};
  font-weight: ${({ $change }) => ($change !== undefined ? 600 : 400)};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-end;
`;
