import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const API_KEY = '708d0bdadea9457d879286ff483ef8b4';

const STOCK_LIST = [
  { label: '마이크로소프트(MSFT)', value: 'MSFT' },
  { label: '애플(AAPL)', value: 'AAPL' },
  { label: '구글(GOOGL)', value: 'GOOGL' },
  { label: '아마존(AMZN)', value: 'AMZN' },
  { label: '테슬라(TSLA)', value: 'TSLA' },
  { label: '엔비디아(NVDA)', value: 'NVDA' },
  { label: '메타(META)', value: 'META' },
  { label: '넷플릭스(NFLX)', value: 'NFLX' },
  { label: 'AMD(AMD)', value: 'AMD' },
  { label: '인텔(INTC)', value: 'INTC' },
];

const INDICATORS = [
  { label: '주가', value: 'price' },
  { label: '변화율', value: 'change' },
  // { label: '영업이익', value: 'profit' }, // 필요시 추가
];

const fetchStockData = async (symbol, period) => {
  let interval = '1month';
  let outputsize = 120;
  if (period === '1M') {
    interval = '1day';
    outputsize = 30;
  } else if (period === '3M') {
    interval = '1day';
    outputsize = 90;
  }
  const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${interval}&outputsize=${outputsize}&apikey=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.values) return [];
  return data.values.reverse().map(item => ({
    date: item.datetime,
    price: parseFloat(item.close),
  }));
};

const fetchStockMeta = async (symbol) => {
  const url = `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  return {
    name: data.name,
    price: parseFloat(data.close),
    change: parseFloat(data.percent_change),
    marketCap: data.market_cap,
    pe: data.pe,
    eps: data.eps,
    symbol: symbol,
  };
};

const PERIODS = [
  { label: '1M', months: 1 },
  { label: '3M', months: 3 },
  { label: '6M', months: 6 },
  { label: '1Y', months: 12 },
  { label: '5Y', months: 60 },
  { label: '10Y', months: 120 },
  { label: 'MAX', months: null },
];

const StockComparison = () => {
  const [selectedStocks, setSelectedStocks] = useState([
    STOCK_LIST[0], STOCK_LIST[1]
  ]);
  const [indicator, setIndicator] = useState(INDICATORS[0].value);
  const [period, setPeriod] = useState('1Y');
  const [chartData, setChartData] = useState([]);
  const [metaData, setMetaData] = useState([]);

  // 데이터 fetch
  useEffect(() => {
    if (selectedStocks.length === 0) return;
    Promise.all(selectedStocks.map(s => fetchStockData(s.value, period)))
      .then(allData => {
        // 날짜 기준으로 병합
        const dateSet = new Set();
        allData.forEach(arr => arr.forEach(d => dateSet.add(d.date)));
        const dates = Array.from(dateSet).sort();
        const merged = dates.map(date => {
          const obj = { date };
          selectedStocks.forEach((s, idx) => {
            const found = allData[idx].find(d => d.date === date);
            obj[s.value] = found ? found[indicator] : null;
          });
          return obj;
        });
        // 기간 필터링
        if (period === '1M') {
          setChartData(merged.slice(-30)); // 최근 30일
        } else if (period === '3M') {
          setChartData(merged.slice(-90)); // 최근 90일
        } else {
          const months = PERIODS.find(p => p.label === period).months;
          setChartData(months ? merged.slice(-months) : merged);
        }
      });
  }, [selectedStocks, indicator, period]);

  // 종목별 메타데이터 fetch
  useEffect(() => {
    if (selectedStocks.length === 0) return;
    Promise.all(selectedStocks.map(s => fetchStockMeta(s.value)))
      .then(setMetaData);
  }, [selectedStocks]);

  return (
    <div style={{
      background: '#f7f9fb', minHeight: '100vh', padding: 32
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #eee', padding: 32, maxWidth: 900, margin: '0 auto'
      }}>
        <h2 style={{ fontWeight: 700, fontSize: 28, marginBottom: 24 }}>주식 비교</h2>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
          <Select
            isMulti
            options={STOCK_LIST}
            value={selectedStocks}
            onChange={setSelectedStocks}
            placeholder="종목 추가..."
            styles={{ container: base => ({ ...base, minWidth: 300 }) }}
            maxMenuHeight={150}
          />
          <select value={indicator} onChange={e => setIndicator(e.target.value)} style={{ height: 36, borderRadius: 6, border: '1px solid #ddd', padding: '0 12px' }}>
            {INDICATORS.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
          </select>
          <select value={period} onChange={e => setPeriod(e.target.value)} style={{ height: 36, borderRadius: 6, border: '1px solid #ddd', padding: '0 12px', minWidth: 80 }}>
            {PERIODS.map(p => (
              <option key={p.label} value={p.label}>{p.label}</option>
            ))}
          </select>
        </div>
        <div style={{ height: 360, marginBottom: 24 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" minTickGap={20} />
              <YAxis tickFormatter={v => v?.toLocaleString()} domain={['auto', 'auto']} />
              <Tooltip />
              <Legend />
              {selectedStocks.map((s, idx) => (
                <Line
                  key={s.value}
                  type="monotone"
                  dataKey={s.value}
                  stroke={['#1976d2', '#ff7300', '#2ecc40', '#e84393', '#00b894'][idx % 5]}
                  name={s.value}
                  dot
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <table style={{
          width: '100%', background: '#fafbfc', borderRadius: 8, boxShadow: '0 1px 4px #eee', fontSize: 15
        }}>
          <thead>
            <tr style={{ background: '#f1f3f6', fontWeight: 600 }}>
              <th style={{ padding: 8 }}>종목</th>
              <th>현재가</th>
              <th>변화율</th>
              <th>시가총액</th>
              <th>P/E</th>
              <th>EPS</th>
            </tr>
          </thead>
          <tbody>
            {metaData.map((m, idx) => (
              <tr key={m.symbol} style={{ textAlign: 'center', background: idx % 2 ? '#fff' : '#f7f9fb' }}>
                <td style={{ padding: 8, fontWeight: 500 }}>{m.symbol} <span style={{ color: '#888', fontWeight: 400, fontSize: 13 }}>{m.name}</span></td>
                <td>${m.price?.toLocaleString()}</td>
                <td style={{ color: m.change > 0 ? 'green' : m.change < 0 ? 'red' : '#222' }}>
                  {m.change > 0 ? '+' : ''}{m.change?.toFixed(2)}%
                </td>
                <td>{m.marketCap}</td>
                <td>{m.pe}</td>
                <td>{m.eps}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockComparison;