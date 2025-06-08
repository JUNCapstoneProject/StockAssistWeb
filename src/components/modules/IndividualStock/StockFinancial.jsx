import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams, useLocation } from 'react-router-dom';
import FinancialCard from '../../../components/common/FinancialCard';
import fetchWithAssist from '../../../fetchWithAssist';

const baseURL = import.meta.env.VITE_API_BASE_URL;

const StockFinancial = ({ ticker: propSymbol, name: propName, wishlist, setWishlist }) => {
  const { symbol: routeSymbol } = useParams();
  const location = useLocation();
  const symbol = propSymbol || routeSymbol;
  const stockName = propName || location.state?.name || symbol;
  const cleanSymbol = symbol?.replace(':', '');

  const [stock, setStock] = useState(null);
  const [activeTab, setActiveTab] = useState('손익계산서');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!cleanSymbol) return;

    const fetchData = async () => {
      setIsLoading(true);
      setStock(null);
      try {
        const res = await fetchWithAssist(`${baseURL}/api/financial?ticker=${cleanSymbol}`);
        const json = await res.json();

        if (json.success && json.response && Object.keys(json.response).length > 0) {
          setStock(json.response);
        } else {
          console.error('❌ 재무 데이터 없음:', json);
          setStock(null);
        }
      } catch (err) {
        console.error('❌ API 오류:', err);
        setStock(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [cleanSymbol]);

  const toggleWishlist = async () => {
    const token = localStorage.getItem("accessToken");
    const isFav = wishlist[cleanSymbol];

    try {
      if (!isFav) {
        const res = await fetch('/api/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`,
            "Destination": "assist"
          },
          body: JSON.stringify({ symbol: cleanSymbol })
        });
        const result = await res.json();
        if (result.success) {
          setWishlist(prev => ({ ...prev, [cleanSymbol]: true }));
          window.location.reload();
        }
      } else {
        const res = await fetch(`/api/wishlist/${cleanSymbol}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `${token}`,
            "Destination": "assist"
          }
        });
        const result = await res.json();
        if (result.success) {
          setWishlist(prev => ({ ...prev, [cleanSymbol]: false }));
          window.location.reload();
        }
      }
    } catch (err) {
      console.error("📌 찜 처리 실패:", err);
    }
  };

  if (isLoading) return <Wrapper>로딩 중...</Wrapper>;
  if (!stock) {
    return (
      <Wrapper>
        <ErrorMessage>
          {cleanSymbol ? `'${cleanSymbol}' 종목에 대한 재무데이터를 찾을 수 없습니다.` : '종목 데이터가 없습니다.'}
        </ErrorMessage>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <HeaderRow>
        <h2>{stockName} 재무제표</h2>
      </HeaderRow>

      <FinancialCard
        stock={stock}
        activeTab={activeTab}
        onTabChange={(ticker, tab) => setActiveTab(tab)}
        ticker={cleanSymbol}
        name={stockName}
      />
    </Wrapper>
  );
};

export default StockFinancial;


const Wrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding-left: 24px;
  padding-right: 24px;
  margin-bottom: 12px;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;

  h2 {
    font-size: 24px;
    font-weight: 600;
    margin: 0;
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
  font-size: 16px;
  background-color: #f8f8f8;
  border-radius: 8px;
  margin-top: 20px;
`;
