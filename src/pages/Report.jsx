import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ReportHeader from "../components/modules/Report/ReportHeader";
import ReportTab from "../components/modules/Report/ReportTab";
import ContentList from "../components/common/ContentList";

const Report = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(searchParams.get("type") || "전문가 리포트");
  const [reportData, setReportData] = useState([]);
  const [reportPage, setReportPage] = useState(
    parseInt(searchParams.get("page")) || 1
  );
  const [hasNextReport, setHasNextReport] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setIsLoading(true);
        const reportType = currentTab === "전문가 리포트" ? "expert" : "user";
        const response = await fetch(
          `http://assist-server-service:4003/api/reports?page=${reportPage}&limit=6&type=${reportType}`,
          { credentials: "include" }
        );
        const result = await response.json();

        if (result.response?.reports) {
          const newData = result.response.reports;
          setReportData((prevData) =>
            JSON.stringify(prevData) === JSON.stringify(newData)
              ? prevData
              : newData
          );
          setHasNextReport(result.response.hasNext);
        }
      } catch (error) {
        console.error("리포트 데이터를 불러오는 중 오류:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, [currentTab, reportPage]);

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
    setReportPage(1);
    setSearchParams({ type: tab, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setReportPage(newPage);
  };

  const handleItemClick = (reportId) => {
    const report = reportData.find((r) => r.id === reportId);
    if (!report) return;

    if (currentTab === "전문가 리포트") {
      if (report.link) {
        window.open(report.link, "_blank");
      }
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
      navigate(`/report/${reportId}`);
    }
  };

  return (
    <div>
      <ReportHeader />
      <ReportTab onTabChange={handleTabChange} currentTab={currentTab} />
      <div style={{ minHeight: "100vh" }}>
        {isLoading ? (
          <div>로딩 중...</div>
        ) : reportData && reportData.length > 0 ? (
          <ContentList
            key="report-list"
            data={reportData}
            currentPage={reportPage}
            hasNext={hasNextReport}
            onPageChange={handlePageChange}
            onItemClick={handleItemClick}
          />
        ) : (
          <div>리포트가 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default Report;
