import React from "react";

const FinancialFilter = ({
  selectedSort,
  setSelectedSort,
  selectedSentiment,
  setSelectedSentiment
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
      <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
        {/* 정렬 */}
        <div>
          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            style={{
              padding: "8px 16px",
              borderRadius: "24px",
              border: "1px solid #e5e7eb",
              fontSize: "16px",
              background: "#fff",
              color: "#000",
              textAlign: "center",
              textAlignLast: "center",
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
          >
            <option value="" disabled hidden>정렬</option>
            <option value="revenue_desc">매출액 높은순</option>
            <option value="revenue_asc">매출액 낮은순</option>
            <option value="price_desc">주가 높은순</option>
            <option value="price_asc">주가 낮은순</option>
          </select>
        </div>

        {/* AI 분석 결과 */}
        <div>
          <select
            value={selectedSentiment}
            onChange={(e) => setSelectedSentiment(e.target.value)}
            style={{
              padding: "8px 16px",
              borderRadius: "24px",
              border: "1px solid #e5e7eb",
              fontSize: "16px",
              background:
                selectedSentiment === "1"
                  ? "#4CAF50"
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
            <option value="1" style={{ background: "#fff", color: "#000" }}>긍정</option>
            <option value="0" style={{ background: "#fff", color: "#000" }}>부정</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FinancialFilter;
