/**
 * 홈페이지 컴포넌트
 * 웹사이트의 메인 페이지를 구성하며, AI 분석 종목과 투자 리포트를 표시
 */

import { useState, useEffect } from "react";
import HomeHero from "../components/layout/mainsection";
import MainStockCard from "../components/modules/Main/MainStockCard";
import mockStocks from "../data/mockStocks.json"; // 뉴스 기반 AI 분석 종목 더미 데이터
import mockFinancialStocks from "../data/mockFinancialStocks.json"; // 재무제표 기반 AI 분석 종목 더미 데이터
import MainInvestmentReports from "../components/modules/Main/MainInvestmentReports";

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

        {/* 투자 리포트 섹션 */}
        <MainInvestmentReports />
      </div>
    </>
  );
}

export default Home;
