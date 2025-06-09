import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";
import { Table, Select, Input, Tag } from "antd";
import fetchWithAssist from '../../../fetchWithAssist';

const { Option } = Select;

const PERIODS = [
  { key: '1M', label: '1M' },
  { key: '6M', label: '6M' },
  { key: 'YTD', label: 'YTD' },
  { key: '1Y', label: '1Y' },
  { key: '5Y', label: '5Y' },
  { key: '10Y', label: '10Y' },
  { key: 'MAX', label: 'MAX' },
  { key: 'ALL', label: 'ALL' },
];
// ✅ utils: 기간(period)에 따른 start, end 날짜 계산 유틸 함수
const getDateRangeByPeriod = (period) => {
  const endDate = new Date();
  const startDate = new Date();
  switch (period) {
    case '1M': startDate.setMonth(endDate.getMonth() - 1); break;
    case '6M': startDate.setMonth(endDate.getMonth() - 6); break;
    case 'YTD': startDate.setMonth(0); startDate.setDate(1); break;
    case '1Y': startDate.setFullYear(endDate.getFullYear() - 1); break;
    case '5Y': startDate.setFullYear(endDate.getFullYear() - 5); break;
    case '10Y': startDate.setFullYear(endDate.getFullYear() - 10); break;
    case 'MAX':
    case 'ALL': startDate.setFullYear(endDate.getFullYear() - 20); break;
    default: startDate.setFullYear(endDate.getFullYear() - 1);
  }
  return {
    start: startDate.toISOString().slice(0, 10),
    end: endDate.toISOString().slice(0, 10)
  };
};

const StockCompareChart = () => {
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [metric, setMetric] = useState("주가");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [period, setPeriod] = useState('10Y');
  const [chartData, setChartData] = useState([]);
  const [loadedStocks, setLoadedStocks] = useState([]);
  const [stockInfo, setStockInfo] = useState([]);
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  // 테이블 컬럼 정의 (컴포넌트 내부에 위치해야 함)
  const columns = [
    { title: "종목", dataIndex: "name", key: "name", ellipsis: true },
    { title: "현재가", dataIndex: "price", key: "price", ellipsis: true },
    { title: "변화율", dataIndex: "change", key: "change", ellipsis: true },
    { title: "시가총액", dataIndex: "marketCap", key: "marketCap", ellipsis: true },
    { title: "거래량", dataIndex: "volume", key: "volume", ellipsis: true },
    { title: "P/E", dataIndex: "pe", key: "pe", ellipsis: true },
    { title: "EPS", dataIndex: "eps", key: "eps", ellipsis: true },
    { title: "배당수익", dataIndex: "dividend", key: "dividend", ellipsis: true },
  ];

  const handleClose = (removedStock) => {
    setSelectedStocks(selectedStocks.filter((stock) => stock !== removedStock));
  };

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchQuery("");
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    try {
      const url = `${baseURL}/api/stocks/search?query=${encodeURIComponent(query)}`;
      const res = await fetchWithAssist(url);
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data.response?.searchData) ? data.response.searchData : [];
        setSuggestions(list);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('검색 결과 fetch 실패:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (ticker) => {
    setSelectedStocks(prev => prev.includes(ticker) ? prev : [...prev, ticker]);
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  useEffect(() => {
    const { start, end } = getDateRangeByPeriod(period);
  
    const fetchAndMerge = async (symbol) => {
      const url = `${baseURL}/api/stocks/prices?symbol=${symbol}&start=${start}&end=${end}&period=${period}`;
      try {
        const res = await fetchWithAssist(url);
        if (res.ok) {
          const data = await res.json();
          let stockData = data.response?.data || [];
          if (metric === '주가변화율') {
            stockData = stockData.map((row) => {
              const first = stockData[0]?.[symbol];
              return {
                ...row,
                [symbol]: (first && row[symbol] != null) ? ((row[symbol] - first) / first) * 100 : null
              };
            });
          }
          setChartData(prev => {
            if (prev.length === 0) return stockData;
            return prev.map((row, i) => ({ ...row, [symbol]: stockData[i]?.[symbol] }));
          });
        }
      } catch (error) {
        console.error('주가 데이터 fetch 실패:', error);
      }
    };
  
    setChartData([]); // 기존 chartData 비움
    Promise.all(selectedStocks.map(fetchAndMerge)).then(() => {
      setLoadedStocks(selectedStocks);
    });
  
    if (loadedStocks.some(s => !selectedStocks.includes(s))) {
      setChartData(prev => prev.map(row => {
        const newRow = { ...row };
        loadedStocks.forEach(s => {
          if (!selectedStocks.includes(s)) delete newRow[s];
        });
        return newRow;
      }));
    }
  }, [selectedStocks, period, metric, baseURL, loadedStocks]);
  
  useEffect(() => {
    const newStocks = selectedStocks.filter(s => !loadedStocks.includes(s));
    const removedStocks = loadedStocks.filter(s => !selectedStocks.includes(s));

    if (removedStocks.length > 0) {
      setStockInfo(prev =>
        prev.filter(item => !removedStocks.includes(item.key))
      );
      setLoadedStocks(prev =>
        prev.filter(s => !removedStocks.includes(s))
      );
    }

    if (newStocks.length === 0) return;
    const fetchStockInfo = async () => {
      try {
        const symbols = newStocks.join(',');
        const url = `${baseURL}/api/stocks/summary?symbols=${symbols}`;
        const res = await fetchWithAssist(url);
        const json = await res.json();
        if (json.success && Array.isArray(json.response?.data)) {
          const info = json.response.data
            .map(item => ({
              key: item.symbol,
              name: <a href="#">{item.name || item.symbol}</a>,
              price: `$${item.price?.toLocaleString()}`,
              change: <span style={{ color: item.change >= 0 ? "#1dc186" : "#e74c3c" }}>{item.change >= 0 ? "+" : ""}{item.change}%</span>,
              marketCap: item.marketCap ? `$${formatMarketCapValue(item.marketCap)}` : '-',
              volume: item.volume ? (item.volume >= 1_000_000 ? (item.volume / 1_000_000).toFixed(1) + 'M' : item.volume.toLocaleString()) : '-',
              pe: item.pe ?? '-',
              eps: item.eps ? `$${item.eps}` : '-',
              dividend: item.dividend !== undefined ? `${item.dividend}%` : '-',
            }));
          setStockInfo(prev => [
            ...prev.filter(item => !newStocks.includes(item.key)),
            ...info
          ]);
          setLoadedStocks(prev => [...prev, ...newStocks]);
        }
      } catch (error) {
        console.error('주식 정보 fetch 실패:', error);
      }
    };
    fetchStockInfo();
  }, [selectedStocks, baseURL, loadedStocks]);

  function formatMarketCapValue(value) {
    if (value >= 1_000_000_000_000) {
      return (value / 1_000_000_000_000).toFixed(2) + 'T';
    } else if (value >= 1_000_000_000) {
      return (value / 1_000_000_000).toFixed(2) + 'B';
    } else if (value >= 1_000_000) {
      return (value / 1_000_000).toFixed(2) + 'M';
    } else if (value >= 1_000) {
      return (value / 1_000).toFixed(2) + 'K';
    } else {
      return value;
    }
  }

  // ✅ 스타일: 컴포넌트 상단에 CSS-in-JS로 스타일 추가
  const customStyles = `
    .stock-compare-root {
      background: #fff;
      border-radius: 14px;
      padding: 32px 24px 16px 24px;
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .stock-compare-title {
      font-weight: 700;
      font-size: 22px;
      margin-bottom: 20px;
      text-align: center;
    }
    .stock-compare-tags {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 8px;
      justify-content: center;
    }
    .stock-compare-search-wrap {
      margin-bottom: 12px;
      position: relative;
      width: 100%;
      max-width: 400px;
      align-self: center;
    }
    .stock-compare-metric {
      margin-bottom: 8px;
      align-self: flex-end;
    }
    .period-btn-group {
      display: flex;
      gap: 8px;
      flex-wrap: nowrap;
      justify-content: center;
      margin-bottom: 8px;
      overflow-x: auto;
      white-space: nowrap;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    .period-btn-group::-webkit-scrollbar {
      display: none;
    }
    .period-btn {
      border: none;
      background: #f2f4f8;
      color: #222;
      padding: 7px 18px;
      border-radius: 20px;
      font-size: 15px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s, color 0.2s;
      outline: none;
      white-space: nowrap;
      min-width: 44px;
    }
    .period-btn.selected {
      background: #3498ff;
      color: #fff;
      font-weight: 700;
      box-shadow: 0 2px 8px rgba(52,152,255,0.08);
    }
    @media (max-width: 700px) {
      .period-btn-group {
        gap: 2px;
        overflow-x: auto;
        flex-wrap: nowrap;
      }
      .period-btn {
        padding: 4px 8px;
        font-size: 11px;
        min-width: 32px;
      }
    }
    @media (max-width: 480px) {
      .period-btn {
        padding: 2px 6px;
        font-size: 9px;
        min-width: 24px;
      }
    }
    .recharts-cartesian-axis-tick-value {
      font-size: 14px;
      transition: font-size 0.2s;
    }
    @media (max-width: 900px) {
      .stock-compare-root {
        max-width: 100vw;
      }
    }
    @media (max-width: 700px) {
      .stock-compare-root {
        padding: 16px 4px 8px 4px;
        max-width: 100vw;
      }
      .stock-compare-title {
        font-size: 18px;
      }
      .stock-compare-search-wrap {
        max-width: 100vw;
        width: 100%;
      }
      .period-btn-group {
        gap: 4px;
      }
      .period-btn {
        padding: 6px 10px;
        font-size: 13px;
      }
      .recharts-cartesian-axis-tick-value {
        font-size: 11px !important;
      }
    }
    @media (max-width: 480px) {
      .stock-compare-root {
        padding: 8px 0 4px 0;
      }
      .stock-compare-title {
        font-size: 16px;
      }
      .recharts-cartesian-axis-tick-value {
        font-size: 9px !important;
      }
    }
    .recharts-tooltip-wrapper {
      font-size: 12px !important;
    }
    .recharts-default-tooltip {
      font-size: 12px !important;
    }
    @media (max-width: 700px) {
      .recharts-cartesian-axis-tick-value {
        font-size: 11px !important;
      }
      .recharts-tooltip-wrapper,
      .recharts-default-tooltip {
        font-size: 10px !important;
      }
    }
    @media (max-width: 480px) {
      .recharts-cartesian-axis-tick-value {
        font-size: 9px !important;
      }
      .recharts-tooltip-wrapper,
      .recharts-default-tooltip {
        font-size: 9px !important;
      }
    }
  `;

  return (
    <div className="stock-compare-root">
      <style>{customStyles}</style>
      <h2 className="stock-compare-title">주식 비교</h2>
      <div className="stock-compare-tags">
        {selectedStocks.map((stock) => (
          <Tag key={stock} closable onClose={() => handleClose(stock)}>{stock}</Tag>
        ))}
      </div>
      <div className="stock-compare-search-wrap" style={{ width: '240px' }}>
  <form
    className="search-container"
    onSubmit={e => e.preventDefault()}
    style={{ width: '100%', position: 'relative' }}
  >
    <input
      type="text"
      placeholder="종목 검색"
      value={searchQuery}
      onChange={handleSearchChange}
      onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
      className="search-input"
      autoComplete="off"
      style={{
        width: '100%',
        padding: '8px 36px 8px 12px',
        border: '1px solid #ccc',
        borderRadius: '6px',
        fontSize: '14px',
        boxSizing: 'border-box',
      }}
    />
    {searchQuery && (
      <button
        type="button"
        className="clear-button"
        onClick={clearSearch}
        style={{
          position: 'absolute',
          right: 36,
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '5px',
        }}
      >
        ✕
      </button>
    )}
    <button
      type="submit"
      className="search-button"
      style={{
        position: 'absolute',
        right: 8,
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
      }}
      tabIndex={-1}
      aria-label="검색"
    >
      <svg className="search-icon" viewBox="0 0 24 24" width="20" height="20" style={{ display: 'block' }}>
        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    </button>

    {showSuggestions && (
      <ul
        className="suggestions-dropdown"
        style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          width: '100%',
          zIndex: 1000,
          background: '#fff',
          border: '1px solid #ccc',
          borderTop: 'none',
          maxHeight: '240px',
          overflowY: 'auto',
          listStyle: 'none',
          padding: 0,
          margin: 0,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          borderBottomLeftRadius: '6px',
          borderBottomRightRadius: '6px',
        }}
      >
        {suggestions
          .filter(item => !selectedStocks.includes(item.ticker))
          .map(item => (
            <li
              key={item.ticker}
              className="suggestion-item"
              onMouseDown={() => handleSuggestionClick(item.ticker)}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                borderBottom: '1px solid #eee',
              }}
            >
              {item.nameKr} ({item.ticker}){item.nameEn && ` - ${item.nameEn}`}
            </li>
        ))}
      </ul>
    )}
  </form>
</div>

<div className="period-metric-wrap" style={{
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '16px',
}}>
  <Select value={metric} onChange={setMetric} style={{ width: 140 }}>
    <Option value="주가">주가</Option>
    <Option value="주가변화율">주가 변화율</Option>
  </Select>

  <div className="period-btn-group" style={{ display: 'flex', gap: 4, flexWrap: 'nowrap', overflowX: 'auto', whiteSpace: 'nowrap' }}>
    {PERIODS.map((p) => (
      <button
        key={p.key}
        className={`period-btn${period === p.key ? ' selected' : ''}`}
        onClick={() => setPeriod(p.key)}
        type="button"
        style={{
          flex: '0 0 auto',
          padding: '4px 8px',
          fontSize: '12px',
          minWidth: '40px',
        }}
      >
        {p.label}
      </button>
    ))}
  </div>
</div>


      <ResponsiveContainer width="100%" height={340} minWidth={350} minHeight={250}>
        <LineChart data={chartData} margin={{ left: 8, right: 32 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 14 }}
            tickFormatter={(date) => date}
          />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip 
            contentStyle={{ fontSize: 12, padding: 8 }}
            formatter={(value) =>
              typeof value === 'number' ? value.toFixed(2) : value
            }
          />
          <Legend />
          {selectedStocks.map((stock, idx) => (
            <Line
              key={stock}
              type="monotone"
              dataKey={stock}
              stroke={idx === 0 ? "#3498ff" : "#ff4d4f"}
              activeDot={false}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <Table
        columns={columns}
        dataSource={stockInfo}
        pagination={false}
        style={{ marginTop: 24, width: '100%' }}
        rowKey="key"
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
};

export default StockCompareChart;
