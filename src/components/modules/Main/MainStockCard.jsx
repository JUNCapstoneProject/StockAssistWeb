import React from "react";
import { useNavigate } from "react-router-dom"; // navigate 추가
import "./MainStockCard.css";

const MainStockCard = ({ stockName, aiAnalysis, imageSrc, ticker }) => {
  const navigate = useNavigate();

  // 추천 상태에 따른 CSS 클래스
  let analysisClass = "";
  if (aiAnalysis === "긍정") {
    analysisClass = "buy";
  } else if (aiAnalysis === "부정") {
    analysisClass = "sell";
  } else if (aiAnalysis === "보류") {
    analysisClass = "hold";
  }

  // 클릭 시 개별 종목 페이지로 이동
  const handleClick = () => {
    navigate(`/stock/${ticker}`, { state: { name: stockName } });
  };

  return (
    <div className="stock-card" onClick={handleClick} style={{ cursor: "pointer" }}>
      <div className="stock-card-image">
        <img src={imageSrc} alt={stockName} />
      </div>
      <h2 className="stock-card-title">{stockName}</h2>
      <p className={`stock-card-analysis ${analysisClass}`}>
        {aiAnalysis}
      </p>
    </div>
  );
};

export default MainStockCard;
