/**
 * @파일명 StockFinancial.jsx
 * @설명 주식 재무정보 컴포넌트
 * @주요기능
 * - 재무제표 데이터 표시
 * - 탭 전환 (손익계산서/대차대조표 등)
 * @데이터처리
 * - 재무 데이터 fetch
 * - 데이터 포맷팅
 */
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
      setStock(null);
      try {
        const res = await fetch(`http://localhost:8080/api/financial?ticker=${cleanSymbol}`);
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

  if (isLoading) return <Wrapper>로딩 중...</Wrapper>;
  if (!stock) return (
    <Wrapper>
      <ErrorMessage>
        {cleanSymbol ? `'${cleanSymbol}' 종목에 대한 재무데이터를 찾을 수 없습니다.` : '종목 데이터가 없습니다.'}
      </ErrorMessage>
    </Wrapper>
  );

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

const ErrorMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
  font-size: 16px;
  background-color: #f8f8f8;
  border-radius: 8px;
  margin-top: 20px;
`;
