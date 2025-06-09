/**
 * 미연동 포트폴리오 페이지 컴포넌트
 * 증권사와 연동되지 않은 사용자를 위한 빈 상태 페이지
 * 증권사 연동 기능을 제공
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn, selectIsLoginChecked } from '../redux/features/auth/authSelectors';
import { useNavigate } from 'react-router-dom';

const MyPortfolioUnlink = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isLoginChecked = useSelector(selectIsLoginChecked);
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState([]);

  useEffect(() => {
    if (isLoginChecked && !isLoggedIn) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }
  }, [isLoggedIn, isLoginChecked, navigate]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isLoggedIn) return;
      
      const token = localStorage.getItem("accessToken");
      try {
        const response = await fetch('/api/wishlist', {
          headers: {
            'Authorization': `${token}`,
            "Destination": "assist"
          }
        });
        const data = await response.json();
        if (data.success) {
          setPortfolio(data.response);
        }
      } catch (err) {
        console.error("찜 목록 조회 오류:", err);
      }
    };

    fetchFavorites();
  }, [isLoggedIn]);

  const handleUnlinkClick = () => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    // TODO: 증권사 연동 로직 구현
  };

  const handleWishlistToggle = async (e, symbol) => {
    e.stopPropagation();
    
    if (!isLoggedIn) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    const token = localStorage.getItem("accessToken");

    try {
      const res = await fetch(`/api/wishlist/${symbol}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `${token}`,
          "Destination": "assist"
        },
      });
      const result = await res.json();
      if (result.success) {
        setPortfolio(prev => prev.filter(item => item.symbol !== symbol));
      }
    } catch (err) {
      console.error("찜 처리 오류:", err);
    }
  };

  const handleStockClick = (symbol, name) => {
    navigate(`/stock/${symbol}`, { state: { name } });
  };

  return (
    <Container>
      {/* 페이지 헤더 */}
      <Header>
        <Title>나의 포트폴리오</Title>
        <ConnectButton onClick={handleUnlinkClick}>+ 증권사 연동하기</ConnectButton>
      </Header>
      
      <PortfolioList>
        {portfolio.map((item) => (
          <PortfolioItem 
            key={item.symbol}
            onClick={() => handleStockClick(item.symbol, item.name)}
            style={{ cursor: 'pointer' }}
          >
            <HeartIconSmall
              $active={item.wished}
              onClick={(e) => handleWishlistToggle(e, item.symbol)}
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
            <StockInfo>
              <TickerLogo>
                <img 
                  src={`https://static.toss.im/png-icons/securities/icn-sec-fill-${item.symbol}.png?20240617`} 
                  alt={item.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://static.toss.im/png-icons/securities/icn-sec-fill-default.png?20240617';
                  }}
                />
              </TickerLogo>
              <StockName>{item.name}</StockName>
              <StockPrice>{parseFloat(item.price).toLocaleString()} USD</StockPrice>
            </StockInfo>
          </PortfolioItem>
        ))}
      </PortfolioList>
    </Container>
  );
};

// 스타일 컴포넌트 정의
const Container = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
`;

const ConnectButton = styled.button`
  background-color: #4B50E6;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background-color: #3A3FB9;
  }
`;

const PortfolioList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PortfolioItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding: 16px 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  gap: 24px;
`;

const StockInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
`;

const TickerLogo = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const StockName = styled.span`
  font-size: 16px;
  font-weight: 500;
  flex: 1;
`;

const StockPrice = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  text-align: right;
  min-width: 120px;
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

export default MyPortfolioUnlink;
