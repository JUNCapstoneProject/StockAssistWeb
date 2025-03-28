// RouteWatcher.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const RouteWatcher = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;

    // report 상세 페이지가 아닐 경우에만 삭제
    if (!path.startsWith("/report/")) {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("report_")) {
          localStorage.removeItem(key);
        }
      });
    }
  }, [location]);

  return null; // 아무 것도 렌더링하지 않음
};

export default RouteWatcher;
