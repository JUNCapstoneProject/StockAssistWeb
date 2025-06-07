import React from "react";

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
  return (
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
  );
};

export default NewsFilter;
