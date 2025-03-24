import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const FinancialStatement = () => {
  const [activeTabs, setActiveTabs] = useState({});
  const [financialData, setFinancialData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    fetchFinancialData(1);
  }, []);

  const fetchFinancialData = async (page) => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8080/api/financial?page=${page}&size=${itemsPerPage}`, {
        credentials: 'include'
      });
      const result = await response.json();
      
      if (result.success && result.data) {
        setFinancialData(result.data);
        const initialTabs = {};
        result.data.forEach(stock => {
          initialTabs[stock.ticker] = '손익계산서';
        });
        setActiveTabs(initialTabs);
      } else {
        console.error('재무제표 데이터 로드 실패: 데이터 구조가 올바르지 않습니다');
      }
    } catch (error) {
      console.error('재무제표 데이터를 불러오는 중 오류가 발생했습니다:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (ticker, tab) => {
    setActiveTabs(prev => ({
      ...prev,
      [ticker]: tab
    }));
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    fetchFinancialData(pageNumber);
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (!financialData || financialData.length === 0) {
    return <div>데이터가 없습니다.</div>;
  }

  return (
    <Container>
      {financialData.map((stock, index) => (
        <StockContainer key={index}>
          <StockHeader>
            <StockInfo>
              <StockName>{stock.name} ({stock.ticker})</StockName>
              <StockPrice>
                ${stock.price} <PriceChange $change={stock.change}>{stock.change}%</PriceChange> 
              </StockPrice>
            </StockInfo>
            <StatusBadge $status={stock.status}>{stock.status}</StatusBadge>
          </StockHeader>

          <TabWrapper>
            <TabItem 
              $active={activeTabs[stock.ticker] === '손익계산서'} 
              onClick={() => handleTabChange(stock.ticker, '손익계산서')}
            >
              손익계산서
            </TabItem>
            <TabItem 
              $active={activeTabs[stock.ticker] === '대차대조표'} 
              onClick={() => handleTabChange(stock.ticker, '대차대조표')}
            >
              대차대조표
            </TabItem>
            <TabItem 
              $active={activeTabs[stock.ticker] === '현금흐름표'} 
              onClick={() => handleTabChange(stock.ticker, '현금흐름표')}
            >
              현금흐름표
            </TabItem>
            <TabItem 
              $active={activeTabs[stock.ticker] === '주요비율'} 
              onClick={() => handleTabChange(stock.ticker, '주요비율')}
            >
              주요 비율
            </TabItem>
          </TabWrapper>

          <Table>
            {stock[activeTabs[stock.ticker] === '주요비율' ? '주요비율' : activeTabs[stock.ticker]].map((item, idx) => (
              <Row key={idx}>
                <Column>{item.name}</Column>
                <Column>{item.value}</Column>
                <Column $change={item.change}>{item.change}%</Column>
              </Row>
            ))}
          </Table>
        </StockContainer>
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
          disabled={financialData.length < itemsPerPage}
        >
          다음
        </PageButton>
      </PaginationContainer>
    </Container>
  );
};

// 📦 스타일 컴포넌트들 (withConfig 포함)

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
`;

const StockContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
`;

const StockHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StockInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const StockName = styled.h2`
  font-size: 18px;
  font-weight: bold;
`;

const StockPrice = styled.span`
  font-size: 16px;
`;

const PriceChange = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== '$change',
})`
  color: ${({ $change }) => ($change >= 0 ? 'green' : 'red')};
  margin-left: 5px;
`;

const StatusBadge = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== '$status',
})`
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  color: white;
  background-color: ${({ $status }) =>
    $status === '긍정' ? '#4CAF50' :
    $status === '부정' ? '#FF5252' :
    '#757575'};
`;

const TabWrapper = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 10px;
`;

const TabItem = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== '$active',
})`
  padding: 10px 15px;
  cursor: pointer;
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  color: ${({ $active }) => ($active ? '#000' : '#666')};
  border-bottom: ${({ $active }) => ($active ? '2px solid #000' : 'none')};
`;

const Table = styled.div`
  margin-top: 15px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
`;

const Column = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== '$change',
})`
  flex: 1;
  text-align: right;

  &:first-child {
    text-align: left;
  }

  color: ${({ $change }) =>
    $change !== undefined ? ($change >= 0 ? 'green' : 'red') : 'black'};
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
  padding: 20px 0;
`;

const PageButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  font-size: 14px;

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
    opacity: 0.7;
  }

  &:hover:not(:disabled) {
    background-color: #f0f0f0;
  }
`;

export default FinancialStatement;
