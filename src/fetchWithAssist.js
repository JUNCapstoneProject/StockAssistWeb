export default function fetchWithAssist(url, options = {}) {
  const headers = {
    ...(options.headers || {}),
    destination: 'assist',
  };
  return fetch(url, { ...options, headers });
} 