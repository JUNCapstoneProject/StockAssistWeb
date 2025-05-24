import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSearchParams } from 'react-router-dom';
import fetchWithAssist from '../../../fetchWithAssist';

const baseURL = import.meta.env.VITE_API_BASE_URL;

const MarketCapTable = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = Number(searchParams.get('page')) || 1;
  const [page, setPage] = useState(initialPage);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const itemsPerPage = 10;

  // 현재 묶음 기준 페이지 수
  const totalPages = Math.ceil(total / itemsPerPage);
  const pageGroup = Math.floor((page - 1) / 10);
  const startPage = pageGroup * 10 + 1;
  const endPage = startPage + totalPages - 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetchWithAssist(`${baseURL}api/stocks/marketcap?page=${page}&size=${itemsPerPage}`);
        const json = await res.json();
        if (json.success) {
          setData(json.response.data);
          setTotal(json.response.total);
          setHasNext(json.response.hasNext);
        } else {
          throw new Error(json.error || '데이터 로드 실패');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page]);

  // 쿼리스트링이 바뀌면 page도 동기화
  useEffect(() => {
    const pageParam = Number(searchParams.get('page')) || 1;
    setPage(pageParam);
  }, [searchParams]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSearchParams({ page: newPage });
  };

  const handlePrevGroup = () => {
    setPage(Math.max(1, startPage - 10));
  };

  const handleNextGroup = () => {
    if (hasNext) setPage(startPage + 10);
  };

  return (
    <TableContainer>
      <HeaderRow>
        <Title>시가총액 상위 종목</Title>
      </HeaderRow>

      {loading ? (
        <p>📡 데이터 불러오는 중...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>❌ 오류: {error}</p>
      ) : (
        <>
          <StyledTable>
            <thead>
              <tr>
                <th style={{ width: 48 }}>순위</th>
                <th style={{ minWidth: 120 }}>종목</th>
                <th>시가총액</th>
                <th>주가</th>
                <th>변화율</th>
                <th>거래량</th>
                <th>P/E</th>
                <th>EPS</th>
                <th>배당수익</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={item.symbol}>
                  <td style={{ textAlign: 'center' }}>{(page - 1) * itemsPerPage + idx + 1}</td>
                  <td>
                    <Name>{item.symbol}</Name>
                    <Symbol>{item.name}</Symbol>
                  </td>
                  <td style={{ textAlign: 'right' }}>${(item.marketCap / 1000).toFixed(2)}T</td>
                  <td style={{ textAlign: 'right' }}>${item.price.toLocaleString()}</td>
                  <td style={{ textAlign: 'right' }}>
                    <Change $positive={item.change >= 0}>
                      {item.change >= 0 ? '+' : ''}{item.change}%
                    </Change>
                  </td>
                  <td style={{ textAlign: 'right' }}>{item.volume >= 1_000_000 ? (item.volume / 1_000_000).toFixed(1) + 'M' : item.volume.toLocaleString()}</td>
                  <td style={{ textAlign: 'right' }}>{item.pe}</td>
                  <td style={{ textAlign: 'right' }}>${item.eps}</td>
                  <td style={{ textAlign: 'right' }}>{item.dividend}%</td>
                </tr>
              ))}
            </tbody>
          </StyledTable>

          <PaginationContainer>
            <PageBtn onClick={handlePrevGroup} disabled={page <= 10}>
              &lt;
            </PageBtn>
            {Array.from({ length: totalPages }, (_, i) => (
              <PageBtn
                key={startPage + i}
                onClick={() => handlePageChange(startPage + i)}
                $active={page === startPage + i}
              >
                {startPage + i}
              </PageBtn>
            ))}
            <PageBtn onClick={handleNextGroup} disabled={!hasNext}>
              &gt;
            </PageBtn>
          </PaginationContainer>
        </>
      )}
    </TableContainer>
  );
};

const TableContainer = styled.div`
  background: #fff;
  padding: 24px 24px 12px 24px;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  margin-bottom: 32px;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 700;
  margin: 0;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 15px;
  th, td {
    padding: 10px 8px;
    border-bottom: 1px solid #eee;
    background: #fff;
    vertical-align: middle;
  }
  th {
    background: #fafbfc;
    font-weight: 600;
    position: sticky;
    top: 0;
    z-index: 1;
    text-align: right;
  }
  th:first-child, td:first-child {
    text-align: center;
  }
  th:nth-child(2), td:nth-child(2) {
    text-align: left;
  }
`;

const Name = styled.div`
  font-weight: 600;
  font-size: 15px;
`;
const Symbol = styled.div`
  color: #888;
  font-size: 12px;
`;
const Change = styled.span.withConfig({ shouldForwardProp: (prop) => prop !== '$positive' })`
  color: ${({ $positive }) => $positive ? '#2ecc71' : '#e74c3c'};
  font-weight: 600;
`;
const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  margin-top: 16px;
`;
const PageBtn = styled.button.withConfig({ shouldForwardProp: (prop) => prop !== '$active' })`
  background: ${({ $active }) => $active ? '#2ecc71' : '#f4f6fa'};
  color: ${({ $active }) => $active ? '#fff' : '#333'};
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  padding: 4px 10px;
  min-width: 32px;
  font-weight: ${({ $active }) => $active ? 700 : 400};
  transition: background 0.15s, color 0.15s;
  &:hover:not(:disabled) {
    background: #e9eef5;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default MarketCapTable; 