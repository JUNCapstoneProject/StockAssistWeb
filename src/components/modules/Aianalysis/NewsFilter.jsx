import React, { useLayoutEffect, useState } from "react";

const NewsFilter = ({
  selectedStocks,
  searchKeyword,
  handleStockInputChange,
  handleSuggestionClick,
  stockSuggestions,
  showSuggestions,
  inputRef,
  removeSelectedStock,
  handleSearch,
  handleInputFocus,
  handleInputBlur,
  selectedSentiment,
  setSelectedSentiment,
  isEnglish,
  toggleLanguage
}) => {
  const [inputPosition, setInputPosition] = useState({ top: 0, left: 0, width: 0 });

  useLayoutEffect(() => {
    if (inputRef?.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setInputPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, [showSuggestions, searchKeyword]);

  return (
    <>
      <div style={{ width: "100%", marginBottom: "16px" }}>
        <div style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
          <div style={{ minWidth: "100%" }}>
            <div
              style={{
                width: "max-content",
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <form
                onSubmit={handleSearch}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  position: "relative",
                  width: "max-content",
                }}
                autoComplete="off"
              >
                <div style={{ display: "flex", gap: "8px" }}>
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
                      width: "200px"
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
                  <option value="all">전체 AI 분석 결과</option>
                  <option value="2">긍정</option>
                  <option value="1">중립</option>
                  <option value="0">부정</option>
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
                  cursor: "pointer"
                }}
              >
                <span style={{ marginRight: 8 }} role="img" aria-label="globe">
                  🌐
                </span>
                {isEnglish ? "KO" : "EN"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showSuggestions && stockSuggestions.length > 0 && (
        <ul
          style={{
            position: "fixed",
            top: inputPosition.top,
            left: inputPosition.left,
            width: inputPosition.width,
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            zIndex: 1000,
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
              {item.nameKr} ({item.ticker}){item.nameEn && ` - ${item.nameEn}`}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default NewsFilter;
