/**
 * AI 분석 페이지 컴포넌트
 * 뉴스와 재무제표를 기반으로 한 AI 분석 결과를 표시하는 페이지
 */

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import AiHeader from "../components/modules/Aianalysis/AiHeader";
import AiTab from "../components/modules/Aianalysis/AiTab";
import ContentList from "../components/common/ContentList";
import FinancialStatement from "../components/modules/Aianalysis/FinancialStatement";
import MacroEconomy from "../components/modules/Aianalysis/MacroEconomy";

// 페이지 새로고침 여부를 확인하는 함수
const isPageReloaded = () => {
  const navEntries = performance.getEntriesByType("navigation");
  return navEntries[0]?.type === "reload";
};

// 초기 탭 상태를 결정하는 함수
const getInitialTab = () => {
  if (isPageReloaded()) {
    const storedTab = sessionStorage.getItem("aiAnalysisTab");
    return storedTab || "뉴스";
  } else {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    const initialTab = tabParam || "뉴스";
    sessionStorage.setItem("aiAnalysisTab", initialTab);
    return initialTab;
  }
};

const AiAnalysis = () => {
  // 상태 관리
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentTab, setCurrentTab] = useState(getInitialTab);
  const [newsData, setNewsData] = useState([]);
  const [newsPage, setNewsPage] = useState(
    parseInt(searchParams.get("newsPage")) || 1
  );
  const [hasNextNews, setHasNextNews] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 페이지 새로고침 시 스크롤 위치 초기화
  useEffect(() => {
    if (isPageReloaded()) {
      window.scrollTo(0, 0);
    }
  }, []);

  // URL 파라미터 업데이트
  useEffect(() => {
    if (currentTab === "뉴스") {
      setSearchParams({ newsPage: newsPage.toString() });
    }
  }, [newsPage, currentTab, setSearchParams]);

  // 뉴스 데이터 로드
  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `http://192.168.25.137:8080/api/news?page=${newsPage}&limit=6`,
          { credentials: "include" }
        );
        const result = await response.json();

        if (result.response?.news) {
          const newData = result.response.news.map(news => ({
            ...news,
            link: news.url || news.link // url 또는 link 필드가 있는 경우 사용
          }));
          setNewsData((prevData) =>
            JSON.stringify(prevData) === JSON.stringify(newData) ? prevData : newData
          );
          setHasNextNews(result.response.hasNext);
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

  // 탭 변경 핸들러
  const handleTabChange = (tab) => {
    setCurrentTab(tab);
    sessionStorage.setItem("aiAnalysisTab", tab);
    if (tab === "뉴스") {
      setSearchParams({ newsPage: newsPage.toString() });
    } else if (tab === "재무제표") {
      setSearchParams({ financialPage: "1" });
    }
  };

  // 뉴스 페이지 변경 핸들러
  const handleNewsPageChange = (newPage) => {
    setNewsPage(newPage);
  };

  return (
    <div>
      {/* AI 분석 헤더 */}
      <AiHeader />
      {/* 거시경제 분석 섹션 */}
      {currentTab === "재무제표" && <MacroEconomy />}
      {/* 탭 네비게이션 */}
      <AiTab onTabChange={handleTabChange} currentTab={currentTab} />
      
      {/* 뉴스 탭 컨텐츠 */}
      {currentTab === "뉴스" && (
        <div style={{ minHeight: "100vh" }}>
          {isLoading ? (
            <div></div>
          ) : newsData && newsData.length > 0 ? (
            <ContentList
              key="news-list"
              data={newsData}
              currentPage={newsPage}
              hasNext={hasNextNews}
              onPageChange={handleNewsPageChange}
            />
          ) : (
            <div></div>
          )}
        </div>
      )}
      
      {/* 재무제표 탭 컨텐츠 */}
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
