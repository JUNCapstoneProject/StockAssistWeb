/**
 * 홈페이지 컴포넌트
 * 웹사이트의 메인 페이지를 구성하며, AI 분석 종목과 투자 리포트를 표시
 */
import { useState, useEffect } from "react";
import HomeHero from "../components/layout/mainsection";
import MainStockCard from "../components/modules/Main/MainStockCard";
import MainInvestmentReports from "../components/modules/Main/MainInvestmentReports";

function Home() {
  const [stocks, setStocks] = useState([]); // 뉴스 기반 AI 분석 종목
  const [financialStocks, setFinancialStocks] = useState([]); // 재무제표 기반 AI 분석 종목
  const [loading, setLoading] = useState(true);

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  // API로 데이터 불러오기
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const [newsRes, financialRes] = await Promise.all([
          fetch(`${baseURL}/api/stock-analysis?type=news`),
          fetch(`${baseURL}/api/stock-analysis?type=financial`),
        ]);
  
        const newsData = await newsRes.json();
        const financialData = await financialRes.json();
  
        if (newsData.success) {
          setStocks(newsData.response);
        }
        if (financialData.success) {
          setFinancialStocks(financialData.response);
        }
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchStockData(); // 함수 내부에서 바로 호출
  }, [baseURL]);
  

  return (
    <>
      <HomeHero />
      <div className="container">
        {/* 뉴스 기반 AI 분석 종목 섹션 */}
        <h1 className="title">뉴스 AI 분석 종목</h1>
        <p className="subtitle">
          최신 뉴스 및 미디어 분석을 통해 AI가 선별한 종목 입니다.
        </p>
        {/* 뉴스 기반 AI 분석 종목 섹션 */}
        {loading ? (
          <p>로딩 중...</p>
        ) : (
          <div className="card-container">
            {stocks.map((stock) => (
              <MainStockCard
                key={`news-${stock.ticker}`}
                ticker={stock.ticker}
                stockName={stock.name}
                aiAnalysis={stock.status}
                imageSrc={`https://static.toss.im/png-icons/securities/icn-sec-fill-${stock.ticker}.png?20240617`}
                />
            ))}
          </div>
        )}

        <div className="more-button-container">
          <button
            className="more-button"
            onClick={() => (window.location.href = "/ai-analysis")}
          >
            뉴스 AI 분석 더보기
          </button>
        </div>

        {/* 재무제표 기반 AI 분석 종목 섹션 */}
        <h1 className="title">재무제표 AI 분석 종목</h1>
        <p className="subtitle">
          재무제표 분석을 통해 AI가 선별한 종목 입니다.
        </p>
        {/* 재무제표 기반 AI 분석 종목 섹션 */}
        {loading ? (
          <p>로딩 중...</p>
        ) : (
          <div className="card-container">
            {financialStocks.map((stock) => (
              <MainStockCard
                key={`financial-${stock.ticker}`}
                ticker={stock.ticker}
                stockName={stock.name}
                aiAnalysis={stock.status}
                imageSrc={`https://static.toss.im/png-icons/securities/icn-sec-fill-${stock.ticker}.png?20240617`}
                />
            ))}
          </div>
        )}

        <div className="more-button-container">
          <button
            className="more-button"
            onClick={() => (window.location.href = "/ai-analysis?tab=재무제표")}
          >
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
