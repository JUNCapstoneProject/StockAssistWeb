import { useParams, useLocation } from "react-router-dom";
import { useState } from "react";
import StockHeader from "../components/modules/IndividualStock/StockHeader";
import StockNews from "../components/modules/IndividualStock/StockNews";
import StockFinancial from "../components/modules/IndividualStock/StockFinancial";

const IndividualStock = () => {
  const { symbol } = useParams();
  const location = useLocation();
  const stockName = location.state?.name || symbol;

  const [wishlist, setWishlist] = useState({}); // ✅ 찜 상태 공유용

  return (
    <>
      <StockHeader ticker={symbol} name={stockName} />
      <StockFinancial
        ticker={symbol}
        name={stockName}
        wishlist={wishlist}
        setWishlist={setWishlist}
      />
      <StockNews
        ticker={symbol}
        name={stockName}
        wishlist={wishlist}
        setWishlist={setWishlist}
      />
    </>
  );
};

export default IndividualStock;
