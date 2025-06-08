import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import AiHeader from "../components/modules/Aianalysis/AiHeader";
import AiTab from "../components/modules/Aianalysis/AiTab";
import ContentList from "../components/common/ContentList";
import FinancialStatement from "../components/modules/Aianalysis/FinancialStatement";
import MacroEconomy from "../components/modules/Aianalysis/MacroEconomy";
import NewsFilter from "../components/modules/Aianalysis/NewsFilter";
import FinancialFilter from "../components/modules/Aianalysis/FinancialFilter";
import fetchWithAssist from '../fetchWithAssist';

const baseURL = import.meta.env.VITE_API_BASE_URL;

const isPageReloaded = () => {
  const navEntries = performance.getEntriesByType("navigation");
  return navEntries[0]?.type === "reload";
};

const getInitialTab = () => {
  if (isPageReloaded()) {
    const storedTab = sessionStorage.getItem("aiAnalysisTab");
    return storedTab || "뉴스";
  } else {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get("tab");
    const hasFinancialPage = urlParams.has("financialPage");

    let initialTab;
    if (tabParam) {
      initialTab = tabParam;
    } else if (hasFinancialPage) {
      initialTab = "재무제표";
    } else {
      initialTab = "뉴스";
    }

    sessionStorage.setItem("aiAnalysisTab", initialTab);
    return initialTab;
  }
};

const AiAnalysis = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentTab, setCurrentTab] = useState(getInitialTab);
  const [newsData, setNewsData] = useState([]);
  const [newsPage, setNewsPage] = useState(
    parseInt(searchParams.get("newsPage")) || 1
  );
  const [hasNextNews, setHasNextNews] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [financialPage, setFinancialPage] = useState(
    parseInt(searchParams.get("financialPage")) || 1
  );
  const [isEnglish, setIsEnglish] = useState(() => {
    const stored = sessionStorage.getItem("aiAnalysisLang");
    return stored === "true";
  });
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedSentiment, setSelectedSentiment] = useState("all");
  const [selectedFinancialSentiment, setSelectedFinancialSentiment] = useState("all");
const [selectedSort, setSelectedSort] = useState("");  // ✅ ""로 변경
  const [stockSuggestions, setStockSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedStocks, setSelectedStocks] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    sessionStorage.setItem("aiAnalysisLang", isEnglish);
  }, [isEnglish]);

  useEffect(() => {
    if (isPageReloaded()) {
      window.scrollTo(0, 0);
    }
  }, []);

  useEffect(() => {
    if (currentTab === "뉴스") {
      const params = new URLSearchParams();
      params.set("newsPage", newsPage.toString());
      if (searchKeyword) params.set("category", searchKeyword);
      if (selectedSentiment !== "all") params.set("sentiment", selectedSentiment);
      setSearchParams(params);
    } else if (currentTab === "재무제표") {
      setSearchParams({ financialPage: financialPage.toString() });
    }
  }, [newsPage, financialPage, currentTab, setSearchParams, searchKeyword, selectedSentiment]);

  useEffect(() => {
    if (!searchKeyword.trim()) {
      setStockSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchKeyword]);

  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        setIsLoading(true);
        const queryParams = new URLSearchParams({
          page: newsPage.toString(),
          limit: "6",
          lang: isEnglish ? "en" : "ko"
        });

        if (selectedStocks.length > 0) {
          selectedStocks.forEach((stock, index) => {
            if (index === 0) {
              queryParams.set("category", stock.ticker);
            } else {
              queryParams.append("category", stock.ticker);
            }
          });
        }
        if (selectedSentiment !== "all") queryParams.set("sentiment", selectedSentiment);

        const response = await fetchWithAssist(
          `${baseURL}/api/news?${queryParams.toString()}`,
          {
            credentials: "include"
          }
        );
        
        if (response.status === 404) {
          setNewsData([]);
          setHasNextNews(false);
          return;
        }
        
        const result = await response.json();

        if (result.response?.news) {
          if (result.response.news.length === 0) {
            setNewsPage(1);
            return;
          }

          const newData = result.response.news.map((news) => {
            let category = '';
            let status = '';
            let aiScore = '';
            if (Array.isArray(news.categories) && news.categories.length > 0) {
              category = news.categories.map(c => c.name).join(', ');
              status = news.categories.map(c => c.status).join(', ');
              aiScore = news.categories.map(c => c.aiScore).join(', ');
            }
            return {
              ...news,
              link: news.url || news.link,
              category,
              status,
              aiScore,
            };
          });

          setNewsData(newData);
          setHasNextNews(result.response.hasNext);
        } else {
          console.error("뉴스 데이터 구조 오류");
        }
      } catch (error) {
        console.error("뉴스 데이터 요청 실패:", error);
        setNewsData([]);
        setHasNextNews(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentTab === "뉴스") {
      fetchNewsData();
    }
  }, [currentTab, newsPage, isEnglish, selectedStocks, selectedSentiment]);

  const toggleLanguage = () => {
    setIsEnglish(!isEnglish);
  };

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
    sessionStorage.setItem("aiAnalysisTab", tab);
    if (tab === "뉴스") {
      const params = new URLSearchParams();
      params.set("newsPage", newsPage.toString());
      if (searchKeyword) params.set("category", searchKeyword);
      if (selectedSentiment !== "all") params.set("sentiment", selectedSentiment);
      setSearchParams(params);
    } else if (tab === "재무제표") {
      setSearchParams({ financialPage: "1" });
    }
  };

  const handleNewsPageChange = (newPage) => {
    setNewsPage(newPage);
  };

  const handleStockInputChange = async (e) => {
    const value = e.target.value;
    setSearchKeyword(value);
    if (!value.trim()) {
      setStockSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    try {
      const url = `${baseURL}/api/stocks/search?query=${encodeURIComponent(value)}`;
      const res = await fetchWithAssist(url);
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data.response?.searchData) ? data.response.searchData : [];
        setStockSuggestions(list);
        setShowSuggestions(true);
      } else {
        setStockSuggestions([]);
        setShowSuggestions(false);
      }
      
    } catch (err) { // eslint-disable-line no-unused-vars
      setStockSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (item) => {
    if (!selectedStocks.some(stock => stock.ticker === item.ticker)) {
      setSelectedStocks([item, ...selectedStocks]);
    }
    setSearchKeyword("");
    setStockSuggestions([]);
    setShowSuggestions(false);
    setNewsPage(1);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    inputRef.current.blur();
  };

  const removeSelectedStock = (ticker) => {
    setSelectedStocks(selectedStocks.filter(stock => stock.ticker !== ticker));
    setNewsPage(1);
  };

  const handleInputFocus = () => {
    if (stockSuggestions.length > 0) setShowSuggestions(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => setShowSuggestions(false), 150);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setNewsPage(1);
  };

  return (
    <div style={{ position: "relative" }}>
      <AiHeader />
      {currentTab === "재무제표" && <MacroEconomy />}
      {currentTab === "뉴스" && (
        <NewsFilter
          selectedStocks={selectedStocks}
          searchKeyword={searchKeyword}
          handleStockInputChange={handleStockInputChange}
          handleSuggestionClick={handleSuggestionClick}
          stockSuggestions={stockSuggestions}
          showSuggestions={showSuggestions}
          inputRef={inputRef}
          removeSelectedStock={removeSelectedStock}
          handleSearch={handleSearch}
          handleInputFocus={handleInputFocus}
          handleInputBlur={handleInputBlur}
          selectedSentiment={selectedSentiment}
          setSelectedSentiment={setSelectedSentiment}
          isEnglish={isEnglish}
          toggleLanguage={toggleLanguage}
        />
      )}
      {currentTab === "재무제표" && (
        <FinancialFilter
          selectedSort={selectedSort}
          setSelectedSort={setSelectedSort}
          selectedSentiment={selectedFinancialSentiment}
          setSelectedSentiment={setSelectedFinancialSentiment}
          isEnglish={isEnglish}
          toggleLanguage={toggleLanguage}
        />
      )}
      <AiTab onTabChange={handleTabChange} currentTab={currentTab} />
      {currentTab === "뉴스" && (
  <div>
    {isLoading ? (
      <div style={{ padding: "40px 0", textAlign: "center" }}>로딩 중...</div>
    ) : newsData && newsData.length > 0 ? (
      <ContentList
        data={newsData}
        currentPage={newsPage}
        hasNext={hasNextNews}
        onPageChange={handleNewsPageChange}
      />
    ) : (
      <div style={{ padding: "40px 0", textAlign: "center" }}>
        {selectedStocks.length > 0 ? "해당 종목 뉴스가 없습니다." : "뉴스가 없습니다."}
      </div>
    )}
  </div>
)}

      {currentTab === "재무제표" && (
        <FinancialStatement
          initialPage={financialPage}
          onPageChange={(page) => {
            setFinancialPage(page);
            setSearchParams((prev) => {
              const newParams = new URLSearchParams(prev);
              newParams.set("financialPage", page.toString());
              return newParams;
            });
          }}
          selectedSort={selectedSort}
          selectedSentiment={selectedFinancialSentiment}
        />
      )}
    </div>
  );
};

export default AiAnalysis;
