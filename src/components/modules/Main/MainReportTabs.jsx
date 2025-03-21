import React from 'react';
import "./MainReportTabs.css";

const ReportTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="report-tabs">
      <button 
        className={`tab-button ${activeTab === 'expert' ? 'active' : ''}`}
        onClick={() => setActiveTab('expert')}
      >
        전문가 리포트
      </button>
      <button 
        className={`tab-button ${activeTab === 'user' ? 'active' : ''}`}
        onClick={() => setActiveTab('user')}
      >
        사용자 리포트
      </button>
    </div>
  );
};

export default ReportTabs;
