import React, { useState, useEffect } from "react";
import FinancialCard from "../../../components/common/FinancialCard";
import styled from "styled-components";

const FinancialStatementPage = ({ initialPage, onPageChange }) => {
  const [activeTabs, setActiveTabs] = useState({});
  const [financialData, setFinancialData] = useState([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [hasNext, setHasNext] = useState(false);
  const itemsPerPage = 3;

  useEffect(() => {
    fetchFinancialData(currentPage);
  }, [currentPage]);

  const fetchFinancialData = async (page) => {
    try {
      console.log("Fetching data for page:", page); // 디버깅용 로그
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(
        `${baseURL}/api/financial?page=${page}&size=${itemsPerPage}`,
        {
          credentials: "include",
        }
      );
      const result = await response.json();
      console.log("API Response:", result); // 디버깅용 로그

      if (result.success && result.response) {
        const stocks = result.response.financials;
        setFinancialData(stocks);
        setHasNext(result.response.hasNext);

        const initialTabs = {};
        stocks.forEach((stock) => {
          initialTabs[stock.ticker] = "손익계산서";
        });
        setActiveTabs(initialTabs);
      } else {
        console.error("재무제표 데이터 로드 실패: 데이터 구조가 올바르지 않습니다");
      }
    } catch (error) {
      console.error("재무제표 데이터를 불러오는 중 오류가 발생했습니다:", error);
    }
  };

  const handleTabChange = (ticker, tab) => {
    setActiveTabs((prev) => ({
      ...prev,
      [ticker]: tab,
    }));
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    onPageChange(pageNumber);
  };

  if (!financialData || financialData.length === 0) return <div></div>;

  return (
    <Container>
      {financialData.map((stock) => (
        <FinancialCard
          key={stock.ticker}
          stock={stock}
          activeTab={activeTabs[stock.ticker]}
          onTabChange={handleTabChange}
        />
      ))}
      <PaginationContainer>
        <PageButton
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          이전
        </PageButton>
        <PageButton
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!hasNext}
        >
          다음
        </PageButton>
      </PaginationContainer>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 20px;
`;

const PageButton = styled.button`
  padding: 8px 16px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default FinancialStatementPage;
