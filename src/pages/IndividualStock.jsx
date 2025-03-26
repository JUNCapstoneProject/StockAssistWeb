import { useParams, useLocation } from "react-router-dom";
import StockHeader from "../components/modules/IndividualStock/StockHeader";
import StockNews from "../components/modules/IndividualStock/StockNews";
import StockFinancial from "../components/modules/IndividualStock/StockFinancial";

const IndividualStock = () => {
  const { symbol } = useParams();
  const location = useLocation();
  const stockName = location.state?.name || symbol;

  return (
    <>
      <StockHeader ticker={symbol} name={stockName} />
      <StockFinancial />
      <StockNews ticker={symbol} />
    </>
  );
};

export default IndividualStock;
