/**
 * 주식 종목의 재무 정보를 표시하는 카드 컴포넌트
 * 손익계산서, 대차대조표, 현금흐름표, 주요비율 등의 재무 정보를 탭으로 구분하여 표시
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from '../../redux/features/auth/authSelectors';

const FinancialCard = ({ stock, activeTab, onTabChange }) => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const statusText = stock.status === 1 ? "긍정" : "부정";
  const [isWishlisted, setIsWishlisted] = useState(stock.isFavorite || false);

  useEffect(() => {
    setIsWishlisted(stock.isFavorite || false);
  }, [stock.isFavorite]);

  const handleCardClick = () => {
    navigate(`/stock/${stock.ticker}`, { state: { name: stock.name } });
  };

  const handleWishlistToggle = async (e) => {
    e.stopPropagation(); // 카드 클릭 방지
    
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const token = localStorage.getItem("accessToken");
    const symbol = stock.ticker;

    try {
      if (!isWishlisted) {
        const res = await fetch('/api/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ symbol }),
        });
        const result = await res.json();
        if (result.success) setIsWishlisted(true);
      } else {
        const res = await fetch(`/api/wishlist/${symbol}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const result = await res.json();
        if (result.success) setIsWishlisted(false);
      }
    } catch (err) {
      console.error("찜 처리 오류:", err);
    }
  };

  return (
    <CardContainer onClick={handleCardClick}>
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
        <BadgeContainer>
          <HeartIconSmall
            $active={isWishlisted}
            onClick={handleWishlistToggle}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5
              -1.935 0-3.597 1.126-4.312 2.733
              -.715-1.607-2.377-2.733-4.313-2.733
              C5.1 3.75 3 5.765 3 8.25
              c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </HeartIconSmall>
          <Badge $status={statusText}>{statusText}</Badge>
        </BadgeContainer>
      </Header>

      <Tabs>
        {['손익계산서', '대차대조표', '현금흐름표', '주요비율'].map((tab) => (
          <Tab
            key={tab}
            $active={activeTab === tab}
            onClick={(e) => { e.stopPropagation(); onTabChange(stock.ticker, tab); }}
          >
            {tab}
          </Tab>
        ))}
      </Tabs>

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


// styled-components는 이전과 동일
// (CardContainer, Header, BadgeContainer, HeartIconSmall, Badge, Info, Name, Price, Change, Tabs, Tab, Table, Row, Col, RightGroup 등)


const CardContainer = styled.div`
  background: #fff;
  padding: 28px 32px 20px 32px;
  border-radius: 18px;
  box-shadow: 0 4px 16px rgba(30, 34, 40, 0.08);
  margin-bottom: 28px;
  transition: box-shadow 0.2s;
  cursor: pointer;
  &:hover {
    box-shadow: 0 8px 24px rgba(30, 34, 40, 0.13);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const BadgeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const HeartIconSmall = styled.svg`
  width: 24px;
  height: 24px;
  cursor: pointer;
  stroke: ${({ $active }) => ($active ? '#e53935' : '#888')};
  fill: ${({ $active }) => ($active ? '#e53935' : 'none')};
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.2);
    stroke: #e53935;
  }

  &:active {
    transform: scale(1);
  }
`;

const Badge = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== '$status',
})`
  padding: 6px 16px;
  font-size: 13px;
  border-radius: 16px;
  background-color: ${({ $status }) =>
    $status === '긍정' ? '#1db954' :
    $status === '부정' ? '#e53935' : '#757575'};
  color: white;
  font-weight: 500;
  white-space: nowrap;
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
  display: flex;
  align-items: center;
  gap: 8px;
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
`;

const Tabs = styled.div`
  display: flex;
  border-bottom: 1.5px solid #e0e0e0;
  margin-top: 18px;
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
