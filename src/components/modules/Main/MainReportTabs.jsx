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
      <style jsx>{`
        .report-tabs {
          display: flex;
          gap: 10px;
        }
        .tab-button {
          padding: 8px 16px;
          font-size: 14px;
          border: 1px solid #e0e0e0;
          border-radius: 20px;
          background: transparent;
          color: #666;
          cursor: pointer;
        }
        .tab-button.active {
          background: #fff;
          color: #2D7CFF;
          border-color: #2D7CFF;
        }
      `}</style>
    </div>
  );
};

export default ReportTabs;