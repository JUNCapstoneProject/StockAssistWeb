import React from 'react';
import MarketCapTable from '../components/modules/StockAnalysis/MarketCapTable';
import StockCompareChart from '../components/modules/StockAnalysis/StockCompareChart';

const StockAnalysis = () => {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 0' }}>
      <MarketCapTable />
      <StockCompareChart />
    </div>
  );
};

export default StockAnalysis;
