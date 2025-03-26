import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams, useLocation } from 'react-router-dom';
import FinancialCard from '../../../components/common/FinancialCard';

const StockFinancial = () => {
  const { symbol: rawSymbol } = useParams();
  const location = useLocation();
  const stockName = location.state?.name || rawSymbol;
  const cleanSymbol = rawSymbol?.replace(':', '');
  const [stock, setStock] = useState(null);
  const [activeTab, setActiveTab] = useState('손익계산서');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!cleanSymbol) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        console.log('재무제표 데이터 요청:', cleanSymbol);
        const res = await fetch(`http://localhost:8080/api/financial/${cleanSymbol}`);
        const json = await res.json();
        console.log('재무제표 응답:', json);

        if (json.success && json.data) {
          setStock(json.data);
        } else {
          console.error('❌ 재무 데이터 없음:', json);
        }
      } catch (err) {
        console.error('❌ API 오류:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [cleanSymbol]); // 의존성 배열을 cleanSymbol로 변경

  if (isLoading) return <Wrapper>로딩 중...</Wrapper>;
  if (!stock) return <Wrapper>데이터 없음</Wrapper>;

  return (
    <Wrapper>
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
  padding: 40px 20px;
`;
