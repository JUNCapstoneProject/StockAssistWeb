import React, { useState, useEffect } from "react";
import ReportCard from "./MainReportCard.jsx";
import ReportTabs from "./MainReportTabs.jsx";
import "./MainInvestmentReports.css";

const InvestmentReports = ({ defaultTab = "expert" }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  // 데이터 로드 함수
  const fetchReports = async (tab) => {
    setLoading(true); // 로딩 상태 활성화
    try {
      if (tab === "user") {
        const response = await import("../../../data/userReports.json");
        setReports(response.default);
      } else if (tab === "expert") {
        const response = await import("../../../data/expertReports.json");
        setReports(response.default);
      }
    } catch (error) {
      console.error("데이터 로드 오류:", error);
    } finally {
      setLoading(false); // 로딩 상태 비활성화
    }
  };

  // 탭 변경 시 데이터 로드
  useEffect(() => {
    fetchReports(activeTab);
  }, [activeTab]);

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
          {reports.map((report, index) => (
            <ReportCard key={index} {...report} />
          ))}
        </div>
      )}

      {/* 더보기 버튼 */}
      {!loading && (
        <button className="more-btn">
          {activeTab === "user" ? "사용자 리포트 더보기" : "전문가 리포트 더보기"}
        </button>
      )}
    </div>
  );
};

export default InvestmentReports;
