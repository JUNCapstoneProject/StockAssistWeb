import axiosInstance from "../../../api/axiosInstance";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const checkLoginStatusAPI = async () => {
  const token = localStorage.getItem("accessToken");
  console.log("token:", token);

  if (!token) {
    // accessToken이 없으면 refreshToken(쿠키)로 바로 갱신 시도
    try {
      const refreshResponse = await axios.post(
        baseURL + "/api/auth/refresh",
        {},
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'destination': 'assist',
          },
          credentials: 'include',
        }
      );

      if (refreshResponse.data?.success && refreshResponse.data?.response) {
        const newAccessToken = refreshResponse.data.response;
        localStorage.setItem("accessToken", newAccessToken);
        const checkResponse = await axiosInstance.get("/api/auth/check");
        return checkResponse.data?.success && checkResponse.data?.response?.isLogin;
      } else {
        throw new Error(refreshResponse.data?.message || "토큰 갱신 실패");
      }
    } catch (refreshError) {
      console.error("🚨 토큰 갱신 실패:", refreshError.response?.data || refreshError);
      localStorage.removeItem("accessToken");
      return false;
    }
  }

  try {
    const response = await axiosInstance.get("/api/auth/check");
    console.log("api/auth/check 응답:", response.data);

    if (response.data?.success && response.data?.response?.isLogin !== undefined) {
      if (!response.data.response.isLogin) {
        console.warn("⛔ 로그인되지 않은 상태. refresh 시도");
        try {
          const refreshResponse = await axios.post(
            baseURL + "/api/auth/refresh",
            {},
            {
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'destination': 'assist',
              },
              credentials: 'include',
            }
          );

          if (refreshResponse.data?.success && refreshResponse.data?.response) {
            const newAccessToken = refreshResponse.data.response;
            localStorage.setItem("accessToken", newAccessToken);
            const checkResponse = await axiosInstance.get("/api/auth/check");
            return checkResponse.data?.success && checkResponse.data?.response?.isLogin;
          } else {
            throw new Error(refreshResponse.data?.message || "토큰 갱신 실패");
          }
        } catch (refreshError) {
          console.error("🚨 토큰 갱신 실패:", refreshError.response?.data || refreshError);
          localStorage.removeItem("accessToken");
          return false;
        }
      }
      return response.data.response.isLogin;
    }

    return false;
  } catch (error) {
    if (error.response?.status === 401) {
      console.warn("⛔ 401 Unauthorized. refresh 시도");
      try {
        const refreshResponse = await axios.post(
          baseURL + "/api/auth/refresh",
          {},
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'destination': 'assist',
            },
            credentials: 'include',
          }
        );

        if (refreshResponse.data?.success && refreshResponse.data?.response) {
          const newAccessToken = refreshResponse.data.response;
          localStorage.setItem("accessToken", newAccessToken);
          const checkResponse = await axiosInstance.get("/api/auth/check");
          return checkResponse.data?.success && checkResponse.data?.response?.isLogin;
        } else {
          console.error("🚨 토큰 갱신 실패:", refreshResponse.data?.message || "알 수 없는 오류");
        }
      } catch (refreshError) {
        console.error("🚨 토큰 갱신 실패:", refreshError);
      }
    } else {
      console.error("🚨 서버 오류:", error);
    }
    return false;
  }
};

export const logoutAPI = async () => {
  console.log("logoutAPI 실행");
  try {
    const response = await axiosInstance.post("/api/auth/logout");
    if (response.data.success) {
      localStorage.removeItem("accessToken");
    }
    return response.data.success;
  } catch (error) {
    console.error("🚨 로그아웃 오류:", error);
    return false;
  }
};
