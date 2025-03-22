// src/redux/features/auth/authAPI.js
import axios from "axios";

export const checkLoginStatusAPI = async () => {
  const response = await axios.get("http://localhost:8080/api/auth/check", {
    withCredentials: true,
  });
  return response.data.loggedIn;
};

export const logoutAPI = async () => {
  const response = await axios.post("http://localhost:8080/api/logout", {}, {
    withCredentials: true,
  });
  return response.data.success;
};
