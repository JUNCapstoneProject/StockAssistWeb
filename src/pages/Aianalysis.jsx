import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import AiHeader from "../components/modules/Aianalysis/AiHeader";
import AiTab from "../components/modules/Aianalysis/AiTab";
import ContentList from "../components/common/ContentList";
import FinancialStatement from "../components/modules/Aianalysis/FinancialStatement";
import MacroEconomy from "../components/modules/Aianalysis/MacroEconomy";

// 새로고침 여부 판별 함수
const isPageReloaded = () => {
  const navEntries = performance.getEntriesByType("navigation");
  return navEntries[0]?.type === "reload";
};

const getInitialTab = () => {
  if (isPageReloaded()) {
    const storedTab = sessionStorage.getItem("aiAnalysisTab");
    return storedTab || "뉴스";
  } else {
    sessionStorage.setItem("aiAnalysisTab", "뉴스");
    return "뉴스";
  }
};

const AiAnalysis = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentTab, setCurrentTab] = useState(getInitialTab);
  const [newsData, setNewsData] = useState([]);
  const [newsPage, setNewsPage] = useState(
    parseInt(searchParams.get("newsPage")) || 1
  );
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ 새로고침 시에만 스크롤 맨 위로 이동
  useEffect(() => {
    if (isPageReloaded()) {
      window.scrollTo(0, 0);
    }
  }, []);

  useEffect(() => {
    // URL 파라미터 업데이트
    if (currentTab === "뉴스") {
      setSearchParams({ newsPage: newsPage.toString() });
    }
  }, [newsPage, currentTab, setSearchParams]);

  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `http://localhost:8080/api/news?page=${newsPage}&limit=6`,
          { credentials: "include" }
        );
        const result = await response.json();

        if (result.data?.newsData) {
          setNewsData((prevData) => {
            const newData = result.data.newsData;
            return JSON.stringify(prevData) === JSON.stringify(newData)
              ? prevData
              : newData;
          });
          setTotalItems(result.data.totalItems);
        } else {
          console.error("뉴스 데이터 로드 실패: 데이터 구조가 올바르지 않습니다");
        }
      } catch (error) {
        console.error("뉴스 데이터를 불러오는 중 오류:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentTab === "뉴스") {
      fetchNewsData();
    }
  }, [currentTab, newsPage]);

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
    sessionStorage.setItem("aiAnalysisTab", tab);
    // 탭 변경 시 해당 탭의 페이지 파라미터만 URL에 표시
    if (tab === "뉴스") {
      setSearchParams({ newsPage: newsPage.toString() });
    } else if (tab === "재무제표") {
      setSearchParams({ financialPage: "1" });
    }
  };

  const handleNewsPageChange = (newPage) => {
    setNewsPage(newPage);
  };

  return (
    <div>
      <AiHeader />
      {currentTab === "재무제표" && <MacroEconomy />}
      <AiTab onTabChange={handleTabChange} currentTab={currentTab} />
      {currentTab === "뉴스" && (
        <div style={{ minHeight: "100vh" }}>
          {isLoading ? (
            <div>로딩 중...</div>
          ) : newsData && newsData.length > 0 ? (
            <ContentList
              key="news-list"
              data={newsData}
              totalItems={totalItems}
              currentPage={newsPage}
              onPageChange={handleNewsPageChange}
            />
          ) : (
            <div>뉴스 데이터가 없습니다.</div>
          )}
        </div>
      )}
      {currentTab === "재무제표" && (
        <FinancialStatement 
          initialPage={parseInt(searchParams.get("financialPage")) || 1}
          onPageChange={(page) => setSearchParams({ financialPage: page.toString() })}
        />
      )}
    </div>
  );
};

export default AiAnalysis;
