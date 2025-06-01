export default function fetchWithAssist(url, options = {}) {
  const defaultOptions = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(import.meta.env.MODE !== 'development' ? { destination: 'assist' } : {})
    },
    ...options,
  };
  return fetch(url, defaultOptions);
} 