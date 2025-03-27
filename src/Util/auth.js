import { jwtDecode } from "jwt-decode";

export const getUserId = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded?.userId || decoded?.sub || null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;
  try {
    const decoded = jwtDecode(token);
    return !decoded.exp || decoded.exp * 1000 > Date.now();
  } catch (error) {
    return false;
  }
};
