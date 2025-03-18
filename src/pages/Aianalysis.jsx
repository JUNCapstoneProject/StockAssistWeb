import AiHeader from "../components/modules/Aianalysis/AiHeader";
import AiTab from "../components/modules/Aianalysis/AiTab";
import ContentList from "../components/common/ContentList";
import newsJson from "../data/news.json";

const AiAnalysis = () => {
  return (
    <div>
      <AiHeader />
      <AiTab />
      <ContentList data={newsJson.newsData} />
    </div>
  );
};

export default AiAnalysis;


