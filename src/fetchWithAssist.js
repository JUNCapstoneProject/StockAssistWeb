export default function fetchWithAssist(url, options = {}) {
  let headers = {
    "Content-Type": "application/json",
    ...(import.meta.env.MODE !== 'development' ? { destination: 'assist' } : {})
  };

  // 뉴스 API 또는 재무제표 API일 때만 accessToken 추가
  if (url.includes('/api/news') || url.includes('/api/financial')) {
    const token = localStorage.getItem('accessToken');
    if (token) {
      headers = {
        ...headers,
        Authorization: token
      };
    }
  }

  const defaultOptions = {
    credentials: "include",
    headers: {
      ...headers,
      ...(options.headers || {})
    },
    ...options,
  };
  return fetch(url, defaultOptions);
} 