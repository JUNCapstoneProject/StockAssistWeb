export default function fetchWithAssist(url, options = {}) {
  const defaultOptions = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(import.meta.env.MODE !== 'development' ? { destination: 'assist' } : {})
    },
    cache: 'no-store', // 캐시 비활성화
    ...options,
  };
  return fetch(url, defaultOptions);
} 