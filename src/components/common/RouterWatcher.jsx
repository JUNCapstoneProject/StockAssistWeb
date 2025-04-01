/**
 * 라우트 변경 감시 컴포넌트
 * 페이지 이동 시 localStorage의 report 관련 데이터를 관리
 */

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const RouteWatcher = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;

    // report 상세 페이지가 아닐 경우에만 localStorage의 report 관련 데이터 삭제
    if (!path.startsWith("/report/")) {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("report_")) {
          localStorage.removeItem(key);
        }
      });
    }
  }, [location]);

  return null; // UI를 렌더링하지 않는 순수 기능 컴포넌트
};

export default RouteWatcher;
