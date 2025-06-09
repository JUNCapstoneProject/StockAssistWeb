import React from 'react';
import MarketCapTable from '../components/modules/StockAnalysis/MarketCapTable';
import StockCompareChart from '../components/modules/StockAnalysis/StockCompareChart';
import IndividualHeader from '../components/modules/StockAnalysis/IndividualHeader';

const StockAnalysis = () => {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', boxSizing: 'border-box' }}>
      <IndividualHeader />
      <MarketCapTable />
      <div style={{ marginBottom: '60px' }}>
        <StockCompareChart />
      </div>
    </div>
  );
};

export default StockAnalysis;
