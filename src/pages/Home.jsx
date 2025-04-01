/**
 * 홈페이지 컴포넌트
 * 웹사이트의 메인 페이지를 구성하며, AI 분석 종목과 투자 리포트를 표시
 */

import { useState, useEffect } from "react";
import styled from "styled-components";
import HomeHero from "../components/layout/mainsection";
import MainStockCard from "../components/modules/Main/MainStockCard";
import mockStocks from "../data/mockStocks.json"; // 뉴스 기반 AI 분석 종목 더미 데이터
import mockFinancialStocks from "../data/mockFinancialStocks.json"; // 재무제표 기반 AI 분석 종목 더미 데이터
import MainInvestmentReports from "../components/modules/Main/MainInvestmentReports";

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin: 2rem 0 1rem;
  color: #212529;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #6c757d;
  margin-bottom: 2rem;
`;

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const MoreButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 2rem 0;
`;

const MoreButton = styled.button`
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 30px;
  padding: 0.8rem 2rem;
  font-size: 1rem;
  color: #495057;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #e9ecef;
    color: #212529;
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

function Home() {
  // 상태 관리
  const [stocks, setStocks] = useState([]); // 뉴스 기반 AI 분석 종목
  const [financialStocks, setFinancialStocks] = useState([]); // 재무제표 기반 AI 분석 종목
  const [loading, setLoading] = useState(true);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    setTimeout(() => {
      setStocks(mockStocks);
      setFinancialStocks(mockFinancialStocks);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <>
      {/* 메인 히어로 섹션 */}
      <HomeHero />
      <div className="container">
        {/* 뉴스 기반 AI 분석 종목 섹션 */}
        <h1 className="title">뉴스 AI 분석 종목</h1>
        <p className="subtitle">
          최신 뉴스 및 미디어 분석을 통해 AI가 선별한 종목 입니다.
        </p>

        {loading ? (
          <p></p>
        ) : (
          <div className="card-container">
            {stocks.map((stock) => (
              <MainStockCard
                key={stock.id}
                stockName={stock.name}
                aiAnalysis={stock.analysis}
                imageSrc={stock.image}
              />
            ))}
          </div>
        )}
        <div className="more-button-container">
          <button className="more-button" onClick={() => window.location.href='/ai-analysis'}>
            뉴스 AI 분석 더보기
          </button>
        </div>

        {/* 재무제표 기반 AI 분석 종목 섹션 */}
        <h1 className="title">재무제표 AI 분석 종목</h1>
        <p className="subtitle">
          재무제표 분석을 통해 AI가 선별한 종목 입니다.
        </p>
        {loading ? (
          <p></p>
        ) : (
          <div className="card-container">
            {financialStocks.map((stock) => (
              <MainStockCard
                key={stock.id}
                stockName={stock.name}
                aiAnalysis={stock.analysis}
                imageSrc={stock.image}
              />
            ))}
          </div>
        )}
        <div className="more-button-container">
          <button className="more-button" onClick={() => window.location.href='/ai-analysis?tab=재무제표'}>
            재무제표 AI 분석 더보기
          </button>
        </div>

        {/* 투자 리포트 섹션 */}
        <MainInvestmentReports />
      </div>
    </>
  );
}

export default Home;
