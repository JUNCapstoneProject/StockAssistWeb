import React from "react";
import "./MainStockCard.css";
const MainStockCard = ({ stockName, aiAnalysis, imageSrc }) => {
  // 추천 상태에 따른 CSS 클래스를 결정
  let analysisClass = "";
  if (aiAnalysis === "매수 추천") {
    analysisClass = "buy";
  } else if (aiAnalysis === "매도 추천") {
    analysisClass = "sell";
  } else if (aiAnalysis === "보류 추천") {
    analysisClass = "hold";
  }

  return (
    <div className="stock-card">
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