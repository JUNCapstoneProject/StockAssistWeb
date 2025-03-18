import AiHeader from "../components/modules/Aianalysis/AiHeader";
import AiTab from "../components/modules/Aianalysis/AiTab";
import ContentList from "../components/common/ContentList";
import newsJson from "../data/news.json";
import { useState } from "react";
import FinancialStatement from "../components/modules/Aianalysis/FinancialStatement";
const AiAnalysis = () => {
  const [currentTab, setCurrentTab] = useState('뉴스');

  return (
    <div>
      <AiHeader />
      <AiTab onTabChange={setCurrentTab} />
      {currentTab === '뉴스' && <ContentList data={newsJson.newsData} />}
      {currentTab === '재무제표' && <FinancialStatement />} 
    </div>
  );
};

export default AiAnalysis;


