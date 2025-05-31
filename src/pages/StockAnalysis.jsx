import React from 'react';
import MarketCapTable from '../components/modules/StockAnalysis/MarketCapTable';
import StockCompareChart from '../components/modules/StockAnalysis/StockCompareChart';
import IndividualHeader from '../components/modules/StockAnalysis/IndividualHeader';

const StockAnalysis = () => {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0px 0' }}>
      <IndividualHeader />
      <MarketCapTable />
      <StockCompareChart />
    </div>
  );
};

export default StockAnalysis;
