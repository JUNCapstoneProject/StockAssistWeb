import AiHeader from "../components/modules/Aianalysis/AiHeader";
import AiTab from "../components/modules/Aianalysis/AiTab";
import ContentList from "../components/common/ContentList";
import { useState, useEffect } from "react";
import FinancialStatement from "../components/modules/Aianalysis/FinancialStatement";
import MacroEconomy from "../components/modules/Aianalysis/MacroEconomy";

const getInitialTab = () => {
  const navEntries = performance.getEntriesByType('navigation');
  const isReload = navEntries[0]?.type === 'reload';

  if (isReload) {
    const storedTab = sessionStorage.getItem('aiAnalysisTab');
    return storedTab || '뉴스';
  } else {
    sessionStorage.setItem('aiAnalysisTab', '뉴스');
    return '뉴스';
  }
};

const AiAnalysis = () => {
  const [currentTab, setCurrentTab] = useState(getInitialTab);
  const [newsData, setNewsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:8080/api/news', {
          credentials: 'include'
        });
        const result = await response.json();
        
        if (result.data?.newsData) {
          setNewsData(result.data.newsData);
          console.log('받아온 뉴스 데이터:', result.data.newsData);
        }else {
          console.error('뉴스 데이터 로드 실패: 데이터 구조가 올바르지 않습니다');
        }
      } catch (error) {
        console.error('뉴스 데이터를 불러오는 중 오류가 발생했습니다:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    if (currentTab === '뉴스') {
      fetchNewsData();
    }
  }, [currentTab]);
  
  useEffect(() => {
    console.log('현재 newsData 상태:', newsData);
  }, [newsData]);

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
    sessionStorage.setItem('aiAnalysisTab', tab);
  };

  return (
    <div>
      <AiHeader />
      {currentTab === '재무제표' && <MacroEconomy />}
      <AiTab onTabChange={handleTabChange} currentTab={currentTab} />
      {currentTab === '뉴스' && (
        isLoading ? (
          <div>로딩 중...</div>
        ) : newsData && newsData.length > 0 ? (
          <ContentList data={newsData} />
        ) : (
          <div>뉴스 데이터가 없습니다.</div>
        )
      )}
      {currentTab === '재무제표' && <FinancialStatement />}
    </div>
  );
};

export default AiAnalysis;
