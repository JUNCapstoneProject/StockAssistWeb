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
    { title: "종목", dataIndex: "name", key: "name" },
    { title: "현재가", dataIndex: "price", key: "price" },
    { title: "변화율", dataIndex: "change", key: "change" },
    { title: "시가총액", dataIndex: "marketCap", key: "marketCap" },
    { title: "거래량", dataIndex: "volume", key: "volume" },
    { title: "P/E", dataIndex: "pe", key: "pe" },
    { title: "EPS", dataIndex: "eps", key: "eps" },
    { title: "배당수익", dataIndex: "dividend", key: "dividend" },
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

  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: 32, minWidth: 700 }}>
      <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 20 }}>주식 비교</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {selectedStocks.map((stock) => (
          <Tag key={stock} closable onClose={() => handleClose(stock)}>{stock}</Tag>
        ))}
      </div>
      <div style={{ marginBottom: 12, position: 'relative', width: 400 }}>
        <div className="search-container">
          <input
            type="text"
            placeholder="종목 검색"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            style={{ width: 400, background: "#f6f8fa", borderRadius: 8, border: "none" }}
            autoComplete="off"
          />
          {searchQuery && (
            <button onClick={clearSearch} style={{ position: "absolute", right: 40 }}>✕</button>
          )}
          {showSuggestions && (
            <ul className="suggestions-dropdown">
              {suggestions.filter(item => !selectedStocks.includes(item.ticker)).map((item) => (
                <li key={item.ticker} onMouseDown={() => handleSuggestionClick(item.ticker)}>
                  {item.nameKr} ({item.ticker}) {item.nameEn && ` - ${item.nameEn}`}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <Select value={metric} onChange={setMetric} style={{ width: 140 }}>
          <Option value="주가">주가</Option>
          <Option value="주가변화율">주가 변화율</Option>
        </Select>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        {PERIODS.map((p) => (
          <button key={p.key} onClick={() => setPeriod(p.key)}>{p.label}</button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip />
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
        style={{ marginTop: 24 }}
        rowKey="key"
      />
    </div>
  );
};

export default StockCompareChart;
