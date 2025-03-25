import jwt_decode from "jwt-decode";

export const getCurrentUser = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwt_decode(token);
    return {
      userId: decoded.sub,
      userName: decoded.name,
      userRole: decoded.role,
      exp: decoded.exp,
    };
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
};

export const isAuthenticated = () => {
  const user = getCurrentUser();
  if (!user) return false;

  // Check if token is expired (exp is in seconds)
  return user.exp * 1000 > Date.now();
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};
