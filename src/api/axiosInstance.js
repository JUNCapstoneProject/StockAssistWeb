import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

// ✅ 1. Axios 인스턴스 생성 (기본 설정 포함)
// axiosInstance는 모든 API 요청에 공통적으로 사용할 axios 인스턴스입니다.
// baseURL: 모든 요청의 기본 URL로 사용됩니다.
// withCredentials: 쿠키(특히 refreshToken)를 요청에 포함시킵니다.
const axiosInstance = axios.create({
  baseURL,
  withCredentials: true, // ✅ 쿠키 전송 허용 (refreshToken 쿠키 포함됨)
});

// ✅ 2. 요청 인터셉터: accessToken 자동으로 Authorization 헤더에 추가
// 모든 요청 전에 실행되어 localStorage에 저장된 accessToken을 Authorization 헤더에 추가합니다.
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken"); // accessToken을 localStorage에서 가져옴
  if (token) {
    config.headers.Authorization = `${token}`; // accessToken을 Authorization 헤더에 추가
  }
  return config;
});

// === 🔄 토큰 갱신 관련 변수 ===
let isRefreshing = false; // 현재 refresh 요청이 진행 중인지 여부
let refreshSubscribers = []; // refresh 완료 후 재시도할 요청들의 콜백 함수 배열

// refresh가 완료되면 대기 중인 모든 요청에 새 토큰을 전달
function onRefreshed(newToken) {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
}

// refresh가 끝나길 기다리는 요청의 콜백을 배열에 추가
function addRefreshSubscriber(callback) {
  refreshSubscribers.push(callback);
}

// ✅ 3. 응답 인터셉터: accessToken이 만료되었을 경우 자동으로 refresh 요청
// 모든 응답에서 401(Unauthorized) 에러가 발생하면 accessToken을 갱신하고,
// 갱신된 토큰으로 원래 요청을 재시도합니다.
axiosInstance.interceptors.response.use(
  (response) => {
    // loggedIn: false 응답 체크
    if (response.data?.success && response.data?.response?.isLogin === false) {
      const originalRequest = response.config;
      
      // 현재 refresh 요청이 없으면 refresh 요청을 보냄
      if (!isRefreshing) {
        isRefreshing = true;
        console.log("refresh 요청 (loggedIn: false)");
        return axios.post(
          baseURL + "/api/auth/refresh",
          {},
          { 
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            credentials: 'include'
          }
        ).then((res) => {
          console.log("refresh API 응답 전체:", res);
          console.log("refresh API 응답 데이터:", res.data);
          console.log("refresh API 응답 구조:", {
            success: res.data?.success,
            accessToken: res.data?.accessToken,
            response: res.data?.response
          });

          if (res.data?.success && res.data?.response?.accessToken) {
            const newAccessToken = res.data.response.accessToken;
            localStorage.setItem("accessToken", newAccessToken);
            onRefreshed(newAccessToken);
            isRefreshing = false;
            
            // 원래 요청 재시도
            originalRequest.headers.Authorization = newAccessToken;
            return axiosInstance(originalRequest);
          } else {
            throw new Error(res.data?.message || "토큰 갱신 실패");
          }
        }).catch((refreshError) => {
          console.error("❌ refreshToken도 만료됨: 로그아웃 처리 필요");
          localStorage.removeItem("accessToken");
          isRefreshing = false;
          return Promise.reject(refreshError);
        });
      }
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이면서, 이미 재시도한 요청이 아니면
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      // 현재 refresh 요청이 없으면 refresh 요청을 보냄
      if (!isRefreshing) {
        isRefreshing = true;
        console.log("refresh 요청 (401)");
        console.log("현재 쿠키:", document.cookie);
        try {
          // refreshToken을 이용해 accessToken 재발급 요청
          const res = await axios.post(
            baseURL + "/api/auth/refresh",
            {},
            { 
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              credentials: 'include'
            }
          );

          console.log("refresh API 응답 전체:", res);
          console.log("refresh API 응답 데이터:", res.data);
          console.log("refresh API 응답 구조:", {
            success: res.data?.success,
            accessToken: res.data?.accessToken,
            response: res.data?.response
          });

          if (res.data?.success && res.data?.response?.accessToken) {
            const newAccessToken = res.data.response.accessToken;
            localStorage.setItem("accessToken", newAccessToken);
            onRefreshed(newAccessToken);
            isRefreshing = false;
            
            // 원래 요청 재시도
            originalRequest.headers.Authorization = newAccessToken;
            return axiosInstance(originalRequest);
          } else {
            throw new Error(res.data?.message || "토큰 갱신 실패");
          }
        } catch (refreshError) {
          console.error("❌ refreshToken도 만료됨: 로그아웃 처리 필요");
          localStorage.removeItem("accessToken");
          isRefreshing = false;
          return Promise.reject(refreshError);
        }
      }

      // refresh가 끝날 때까지 대기 후, 새 토큰으로 원래 요청 재시도
      return new Promise((resolve) => {
        addRefreshSubscriber((newToken) => {
          originalRequest.headers.Authorization = newToken;
          resolve(axiosInstance(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

// axiosInstance를 외부에서 사용할 수 있도록 export
export default axiosInstance;
