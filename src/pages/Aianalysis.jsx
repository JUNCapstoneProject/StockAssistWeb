import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import AiHeader from "../components/modules/Aianalysis/AiHeader";
import AiTab from "../components/modules/Aianalysis/AiTab";
import ContentList from "../components/common/ContentList";
import FinancialStatement from "../components/modules/Aianalysis/FinancialStatement";
import MacroEconomy from "../components/modules/Aianalysis/MacroEconomy";
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
    } catch (_) {
      setStockSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (item) => {
    if (!selectedStocks.some(stock => stock.ticker === item.ticker)) {
      setSelectedStocks([item, ...selectedStocks]);
    }
  
    setSearchKeyword(""); // ✅ 입력값 초기화
    setStockSuggestions([]); // ✅ 제안 목록 초기화
    setShowSuggestions(false);
    setNewsPage(1);
  
    // ✅ 강제 input 초기화 (ref 사용)
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  
    inputRef.current.blur(); // 포커스 제거
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
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "12px",
            marginTop: "24px",
            marginBottom: "16px",
            position: "relative",
            zIndex: 10,
          }}
        >
          <form
            onSubmit={handleSearch}
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
              position: "relative"
            }}
            autoComplete="off"
          >
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {selectedStocks.map((stock) => (
                <div
                  key={stock.ticker}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "4px 8px",
                    background: "#f3f4f6",
                    borderRadius: "16px",
                    fontSize: "14px"
                  }}
                >
                  <span>{stock.nameKr} ({stock.ticker})</span>
                  <button
                    onClick={() => removeSelectedStock(stock.ticker)}
                    style={{
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      padding: "0 4px",
                      fontSize: "16px"
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div style={{ position: "relative" }}>
              <input
                ref={inputRef}
                type="text"
                value={searchKeyword}
                autoComplete="off"
                onChange={handleStockInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder="종목 검색"
                style={{
                  padding: "8px 40px 8px 16px",
                  borderRadius: "24px",
                  border: "1px solid #e5e7eb",
                  fontSize: "16px",
                  width: "200px",
                }}
              />
              <button
                type="submit"
                style={{
                  position: "absolute",
                  right: "8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  display: "flex",
                  alignItems: "center"
                }}
                tabIndex={-1}
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {showSuggestions && stockSuggestions.length > 0 && (
                <ul
                  style={{
                    position: "absolute",
                    top: "110%",
                    left: 0,
                    width: "100%",
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    zIndex: 100,
                    maxHeight: "200px",
                    overflowY: "auto",
                    margin: 0,
                    padding: 0,
                    listStyle: "none"
                  }}
                >
                  {stockSuggestions.map((item) => (
                    <li
                      key={item.ticker}
                      onMouseDown={() => handleSuggestionClick(item)}
                      style={{
                        padding: "8px 16px",
                        cursor: "pointer",
                        borderBottom: "1px solid #f0f0f0",
                        background: item.ticker === searchKeyword ? "#f3f4f6" : "#fff"
                      }}
                    >
                      {item.nameKr} ({item.ticker})
                      {item.nameEn && ` - ${item.nameEn}`}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <select
  value={selectedSentiment}
  onChange={(e) => setSelectedSentiment(e.target.value)}
  style={{
    padding: "8px 16px",
    borderRadius: "24px",
    border: "1px solid #e5e7eb",
    fontSize: "16px",
    background:
      selectedSentiment === "2"
        ? "#4CAF50"
        : selectedSentiment === "1"
        ? "#9E9E9E"
        : selectedSentiment === "0"
        ? "#F44336"
        : "#fff",
    color: selectedSentiment === "all" ? "#000" : "#fff",
    textAlign: "center",
    textAlignLast: "center",
    cursor: "pointer",
    transition: "all 0.3s ease"
  }}
>
  <option value="all" style={{ background: "#fff", color: "#000" }}>전체 AI 분석 결과</option>
  <option value="2" style={{ background: "#fff", color: "#000" }}>긍정</option>
  <option value="1" style={{ background: "#fff", color: "#000" }}>중립</option>
  <option value="0" style={{ background: "#fff", color: "#000" }}>부정</option>
</select>
          </form>
          <button
            onClick={toggleLanguage}
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 24,
              padding: "8px 24px",
              fontWeight: 500,
              fontSize: 18,
              display: "flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
              cursor: "pointer",
            }}
          >
            <span style={{ marginRight: 8 }} role="img" aria-label="globe">
              🌐
            </span>
            {isEnglish ? "KO" : "EN"}
          </button>
        </div>
      )}
      <AiTab onTabChange={handleTabChange} currentTab={currentTab} />
      {currentTab === "뉴스" && (
        <div style={{ minHeight: "100vh" }}>
          {isLoading ? (
            <div></div>
          ) : newsData && newsData.length > 0 ? (
            <ContentList
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
        />
      )}
    </div>
  );
};

export default AiAnalysis;