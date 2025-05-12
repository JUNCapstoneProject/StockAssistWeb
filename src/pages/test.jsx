import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const API_KEY = '708d0bdadea9457d879286ff483ef8b4'; // 본인 Twelve Data API 키로 교체

const fetchStockData = async (symbol) => {
  const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&outputsize=5000&apikey=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.values) return [];
  // 날짜 오름차순 정렬
  return data.values.reverse().map(item => ({
    date: item.datetime,
    [symbol]: parseFloat(item.close),
  }));
};

const mergeData = (data1, data2, symbol1, symbol2) => {
  // 날짜 기준으로 두 종목 데이터 병합
  const map = {};
  data1.forEach(item => { map[item.date] = { date: item.date, [symbol1]: item[symbol1] }; });
  data2.forEach(item => {
    if (map[item.date]) {
      map[item.date][symbol2] = item[symbol2];
    } else {
      map[item.date] = { date: item.date, [symbol2]: item[symbol2] };
    }
  });
  // 날짜 오름차순 정렬
  return Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
};

const PERIODS = [
  { label: '1M', days: 22 },
  { label: '6M', days: 132 },
  { label: '1Y', days: 264 },
  { label: '5Y', days: 1320 },
  { label: '10Y', days: 2640 },
  { label: 'MAX', days: null },
];

// 변동률(%) 데이터로 변환
const toReturnData = (data, symbol1, symbol2) => {
  if (!data.length) return [];
  const base1 = data[0][symbol1];
  const base2 = data[0][symbol2];
  return data.map(item => ({
    date: item.date,
    [symbol1]: base1 ? ((item[symbol1] / base1 - 1) * 100) : null,
    [symbol2]: base2 ? ((item[symbol2] / base2 - 1) * 100) : null,
  }));
};

const StockComparison = () => {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('1Y');

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [msft, aapl] = await Promise.all([
        fetchStockData('MSFT'),
        fetchStockData('AAPL'),
      ]);
      const merged = mergeData(msft, aapl, 'MSFT', 'AAPL');
      setData(merged);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!data.length) return;
    const days = PERIODS.find(p => p.label === period).days;
    if (!days) {
      setFiltered(data);
    } else {
      setFiltered(data.slice(-days));
    }
  }, [data, period]);

  // 기존 filtered 대신 변동률 데이터로 변환
  const returnData = toReturnData(filtered, 'MSFT', 'AAPL');

  if (loading) return <div>로딩 중...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Twelve Data API 주가 변동률 비교 (MSFT vs AAPL)</h2>
      <div style={{ marginBottom: 16 }}>
        {PERIODS.map(p => (
          <button
            key={p.label}
            onClick={() => setPeriod(p.label)}
            style={{
              marginRight: 8,
              padding: '6px 14px',
              background: period === p.label ? '#1976d2' : '#fff',
              color: period === p.label ? '#fff' : '#1976d2',
              border: '1px solid #1976d2',
              borderRadius: 4,
              fontWeight: period === p.label ? 'bold' : 'normal',
              cursor: 'pointer'
            }}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div style={{ height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={returnData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" minTickGap={20} />
            <YAxis
              tickFormatter={v => `${v > 0 ? '+' : ''}${v.toFixed(2)}%`}
              domain={['auto', 'auto']}
            />
            <Tooltip
              formatter={(value) => `${value > 0 ? '+' : ''}${value.toFixed(2)}%`}
            />
            <Legend />
            <Line type="monotone" dataKey="MSFT" stroke="#1976d2" name="MSFT" dot={false} />
            <Line type="monotone" dataKey="AAPL" stroke="#ff7300" name="AAPL" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StockComparison;
