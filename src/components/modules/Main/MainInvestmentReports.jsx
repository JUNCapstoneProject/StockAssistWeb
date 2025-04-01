import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReportCard from "./MainReportCard.jsx";
import ReportTabs from "./MainReportTabs.jsx";
import "./MainInvestmentReports.css";

const InvestmentReports = ({ defaultTab = "expert" }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  // 데이터 로드 함수
  const fetchReports = async (tab) => {
    setLoading(true);
    try {
      const reportType = tab === "user" ? "user" : "expert";
      const response = await fetch(
        `http://localhost:8080/api/reports?page=1&limit=3&type=${reportType}`,
        { credentials: "include" }
      );
      const result = await response.json();

      if (result.response?.reports) {
        // source를 analyst로 사용하도록 데이터 설정
        const reportsWithAnalyst = result.response.reports.map(report => ({
          ...report,
          analyst: report.source || (reportType === "expert" ? "전문가" : "사용자")
        }));
        setReports(reportsWithAnalyst);
      }
    } catch (error) {
      console.error("리포트 데이터를 불러오는 중 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  // 탭 변경 시 데이터 로드
  useEffect(() => {
    fetchReports(activeTab);
  }, [activeTab]);

  const handleMoreClick = () => {
    const type = activeTab === "user" ? "사용자 리포트" : "전문가 리포트";
    navigate(`/report?type=${type}&page=1`);
  };

  const handleReportClick = (report) => {
    if (activeTab === "expert" && report.link) {
      window.open(report.link, "_blank");
    } else {
      const reportToStore = {
        id: report.id,
        title: report.title,
        category: report.category,
        date: report.date,
        source: report.source,
        description: report.description,
      };
      localStorage.setItem(`report_${report.id}`, JSON.stringify(reportToStore));
      navigate(`/report/${report.id}`);
    }
  };

  return (
    <div className="investment-reports">
      <h2 className="title">투자 리포트</h2>
      <p className="subtitle">전문가의 분석 리포트를 확인하고 나만의 투자 리포트를 작성해보세요.</p>

      {/* 탭 메뉴 */}
      <ReportTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 로딩 중 메시지 */}
      {loading ? (
        <p>리포트를 불러오는 중...</p>
      ) : (
        <div className="report-list">
          {reports.map((report) => (
            <div key={report.id} onClick={() => handleReportClick(report)} style={{ cursor: "pointer" }}>
              <ReportCard 
                {...report} 
                analyst={report.source}
              />
            </div>
          ))}
        </div>
      )}

      {/* 더보기 버튼 */}
      {!loading && (
        <button className="more-btn" onClick={handleMoreClick}>
          {activeTab === "user" ? "사용자 리포트 더보기" : "전문가 리포트 더보기"}
        </button>
      )}
    </div>
  );
};

export default InvestmentReports;
