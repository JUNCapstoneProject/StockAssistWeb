import { useState, useEffect } from "react";
import HomeHero from "../components/layout/mainsection";
import MainStockCard from "../components/modules/Main/MainStockCard";
import mockStocks from "../data/mockStocks.json"; // 더미 데이터 불러오기
import mockFinancialStocks from "../data/mockFinancialStocks.json"; // 재무제표 더미 데이터 추가
import MainInvestmentReports from "../components/modules/Main/MainInvestmentReports";

function Home() {
  const [stocks, setStocks] = useState([]);
  const [financialStocks, setFinancialStocks] = useState([]); // 재무제표 종목 상태 추가
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 두 종류의 데이터를 모두 불러옴
    setTimeout(() => {
      setStocks(mockStocks);
      setFinancialStocks(mockFinancialStocks);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <>
      <HomeHero />
      <div className="container">
        <h1 className="title">뉴스 AI 분석 종목</h1>
        <p className="subtitle">
          최신 뉴스 및 미디어 분석을 통해 AI가 선별한 종목 입니다.
        </p>

        {loading ? (
          <p>로딩 중...</p>
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
        <h1 className="title">재무제표 AI 분석 종목</h1>
        <p className="subtitle">
          재무제표 분석을 통해 AI가 선별한 종목 입니다.
        </p>
        {loading ? (
          <p>로딩 중...</p>
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
        <MainInvestmentReports />
      </div>
    </>
  );
}

export default Home;
