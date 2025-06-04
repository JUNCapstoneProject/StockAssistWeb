import React from "react";
import { useNavigate } from "react-router-dom"; // navigate 추가
import "./MainStockCard.css";

const MainStockCard = ({ stockName, aiAnalysis, imageSrc, ticker, type = "news" }) => {
  const navigate = useNavigate();

  // 추천 상태에 따른 CSS 클래스와 표시 텍스트
  let analysisClass = "";
  let displayText = "";

  if (aiAnalysis === "분석 결과 없음") {
    analysisClass = "hold";
    displayText = "분석 결과 없음";
  } else if (type === "news") {
    // 뉴스 분석 결과 처리
    switch (aiAnalysis) {
      case "0":
        analysisClass = "sell";
        displayText = "부정";
        break;
      case "1":
        analysisClass = "hold";
        displayText = "중립";
        break;
      case "2":
        analysisClass = "buy";
        displayText = "긍정";
        break;
      default:
        analysisClass = "hold";
        displayText = "분석 결과 없음";
    }
  } else {
    // 재무제표 분석 결과 처리
    switch (aiAnalysis) {
      case "0":
        analysisClass = "sell";
        displayText = "부정";
        break;
      case "1":
        analysisClass = "buy";
        displayText = "긍정";
        break;
      default:
        analysisClass = "hold";
        displayText = "분석 결과 없음";
    }
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
        {displayText}
      </p>
    </div>
  );
};

export default MainStockCard;
