export default function fetchWithAssist(url, options = {}) {
  let headers = options.headers || {};
  // 로컬 환경이 아닐 때만 destination: assist 헤더 추가
  if (import.meta.env.MODE !== 'development') {
    headers = { ...headers, destination: 'assist' };
  }
  return fetch(url, { ...options, headers });
} 