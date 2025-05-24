import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid
} from 'recharts';

// 예시 종목
const allStocks = [
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' }
];

// 색상 배열
const colors = ['#3366CC', '#DC3912', '#FF9900', '#109618', '#990099'];

const StockCompareChart = () => {
  const [selectedStocks, setSelectedStocks] = useState(['TSLA', 'AAPL']);
  const [searchInput, setSearchInput] = useState('');
  const [chartData, setChartData] = useState([]);
  const [range, setRange] = useState('1M');

  // 날짜 계산 유틸
  const getStartDate = (range) => {
    const today = new Date();
    const d = new Date(today);
    if (range === '1M') d.setMonth(d.getMonth() - 1);
    else if (range === '3M') d.setMonth(d.getMonth() - 3);
    else if (range === '6M') d.setMonth(d.getMonth() - 6);
    else if (range === '1Y') d.setFullYear(d.getFullYear() - 1);
    return d.toISOString().slice(0, 10);
  };

// 차트 데이터 fetch
useEffect(() => {
  const fetchData = async () => {
    try {
      const start = getStartDate(range);
      const end = new Date().toISOString().slice(0, 10); // 오늘 날짜
      const symbols = selectedStocks.join(',');
      const res = await axios.get(`http://localhost:8080/api/stocks/prices?symbols=${symbols}&start=${start}&end=${end}`);
      setChartData(res.data);
    } catch (e) {
      console.error(e);
    }
  };
  fetchData();
}, [selectedStocks, range]);


  const addStock = (symbol) => {
    if (!selectedStocks.includes(symbol)) setSelectedStocks([...selectedStocks, symbol]);
    setSearchInput('');
  };
  const removeStock = (symbol) => setSelectedStocks(selectedStocks.filter(s => s !== symbol));

  const filteredStocks = allStocks.filter(
    s => (s.name + s.symbol).toLowerCase().includes(searchInput.toLowerCase()) && !selectedStocks.includes(s.symbol)
  );

  return (
    <Container>
      <Title>📈 주식 비교 차트</Title>
      <TopBar>
        {selectedStocks.map(symbol => (
          <Tag key={symbol}>
            {symbol} <RemoveBtn onClick={() => removeStock(symbol)}>×</RemoveBtn>
          </Tag>
        ))}
        <SearchBox>
          <input
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="종목 추가..."
          />
          {searchInput && (
            <Dropdown>
              {filteredStocks.map(s => (
                <DropdownItem key={s.symbol} onClick={() => addStock(s.symbol)}>
                  {s.symbol} {s.name}
                </DropdownItem>
              ))}
            </Dropdown>
          )}
        </SearchBox>
        <RangeSelector>
          {['1M', '3M', '6M', '1Y'].map(r => (
            <RangeBtn key={r} active={range === r} onClick={() => setRange(r)}>
              {r}
            </RangeBtn>
          ))}
        </RangeSelector>
      </TopBar>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 0 }}>
          <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={date => new Date(date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
          />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip formatter={(v) => `$${v.toFixed(2)}`} />
          <Legend />
          {selectedStocks.map((symbol, idx) => (
            <Line
              key={symbol}
              type="monotone"
              dataKey={symbol}
              stroke={colors[idx % colors.length]}
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={true}
              animationDuration={800}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Container>
  );
};

const Container = styled.div`
  background: #fff;
  padding: 24px;
  border-radius: 14px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  max-width: 1000px;
  margin: 0 auto 40px;
`;

const Title = styled.h3`
  margin-bottom: 16px;
  font-size: 22px;
`;

const TopBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const Tag = styled.span`
  background-color: #f0f0f0;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 14px;
`;

const RemoveBtn = styled.button`
  margin-left: 6px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #888;
`;

const SearchBox = styled.div`
  position: relative;
`;

const Dropdown = styled.div`
  position: absolute;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  top: 100%;
  width: 250px;
`;

const DropdownItem = styled.div`
  padding: 8px 12px;
  cursor: pointer;
  &:hover {
    background-color: #f8f8f8;
  }
`;

const RangeSelector = styled.div`
  display: flex;
  gap: 6px;
  margin-left: auto;
`;

const RangeBtn = styled.button`
  padding: 5px 10px;
  font-size: 13px;
  background: ${props => props.active ? '#0077cc' : '#eee'};
  color: ${props => props.active ? 'white' : '#333'};
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

export default StockCompareChart;
