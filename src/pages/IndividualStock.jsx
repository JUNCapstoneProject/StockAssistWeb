/**
 * 개별 종목 상세 페이지 컴포넌트
 * 특정 주식 종목의 상세 정보, 재무제표, 뉴스를 표시하는 페이지
 */

import { useParams, useLocation } from "react-router-dom";
import StockHeader from "../components/modules/IndividualStock/StockHeader";
import StockNews from "../components/modules/IndividualStock/StockNews";
import StockFinancial from "../components/modules/IndividualStock/StockFinancial";

const IndividualStock = () => {
  // URL 파라미터와 라우터 상태에서 종목 정보 가져오기
  const { symbol } = useParams(); // URL에서 종목 코드 추출
  const location = useLocation();
  const stockName = location.state?.name || symbol; // 종목명이 없으면 종목 코드 사용

  return (
    <>
      {/* 종목 헤더 섹션 */}
      <StockHeader ticker={symbol} name={stockName} />
      {/* 재무제표 섹션 */}
      <StockFinancial />
      {/* 뉴스 섹션 */}
      <StockNews ticker={symbol} />
    </>
  );
};

export default IndividualStock;
