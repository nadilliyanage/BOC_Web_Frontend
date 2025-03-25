import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// Importing pages
import HomePage from "../pages/Home/Home";
import ReportsPage from "../pages/Reports/Reports";
import SmsPage from "../pages/SMS/SMS";
import UserManagement from "../pages/UserManagement/UserManagement";
import CreateMessage from "../pages/CreateMessage/CreateMessage";
import Contacts from "../pages/Contacts/Contacts";
import BlockNumbers from "../pages/BlockNumbers/BlockNumbers";
import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";
import WaitingPage from "../pages/WaitingPage";

const RouterComponent = ({ darkMode, toggleDarkMode }) => {
  // Get token from localStorage
  const token = localStorage.getItem("token");

  // Decode token to get user info
  let user = null;
  let isTokenValid = false;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      isTokenValid = decoded.exp * 1000 > Date.now(); // Check if token is expired

      if (isTokenValid) {
        user = {
          userId: decoded.sub,
          userName: decoded.name,
          userRole: decoded.role,
        };
      } else {
        localStorage.removeItem("token"); // Remove expired token
      }
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.removeItem("token");
    }
  }

  // Role-based route configuration
  const routesByRole = {
    SUPERADMIN: [
      { path: "/home", element: <HomePage /> },
      { path: "/createMessage", element: <CreateMessage /> },
      { path: "/contacts", element: <Contacts /> },
      { path: "/reports", element: <ReportsPage /> },
      { path: "/sms", element: <SmsPage /> },
      { path: "/block", element: <BlockNumbers /> },
      { path: "/usermanagement", element: <UserManagement /> },
    ],
    ADMIN: [
      { path: "/home", element: <HomePage /> },
      { path: "/createMessage", element: <CreateMessage /> },
      { path: "/contacts", element: <Contacts /> },
      { path: "/reports", element: <ReportsPage /> },
      { path: "/sms", element: <SmsPage /> },
      { path: "/block", element: <BlockNumbers /> },
      { path: "/usermanagement", element: <UserManagement /> },
    ],
    USER1: [
      { path: "/home", element: <HomePage /> },
      { path: "/createMessage", element: <CreateMessage /> },
      { path: "/contacts", element: <Contacts /> },
      { path: "/sms", element: <SmsPage /> },
      { path: "/block", element: <BlockNumbers /> },
    ],
    USER2: [
      { path: "/home", element: <HomePage /> },
      { path: "/createMessage", element: <CreateMessage /> },
      { path: "/contacts", element: <Contacts /> },
      { path: "/sms", element: <SmsPage /> },
      { path: "/block", element: <BlockNumbers /> },
    ],
  };

  // Protected Route Component
  const ProtectedRoute = ({ children, requiredRoles }) => {
    if (!isTokenValid) {
      return <Navigate to="/login" replace />;
    }

    if (requiredRoles && !requiredRoles.includes(user.userRole)) {
      return <Navigate to="/unauthorized" replace />;
    }

    return children;
  };

  // Generate protected routes based on role
  const generateProtectedRoutes = () => {
    if (!user) return null;

    const roleRoutes = routesByRole[user.userRole] || [];

    return roleRoutes.map((route, index) => (
      <Route
        key={index}
        path={route.path}
        element={
          <ProtectedRoute requiredRoles={[user.userRole]}>
            {route.element}
          </ProtectedRoute>
        }
      />
    ));
  };

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          isTokenValid ? (
            <Navigate to="/home" replace />
          ) : (
            <LoginPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          )
        }
      />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/waiting" element={<WaitingPage />} />

      {/* Protected routes */}
      {generateProtectedRoutes()}

      {/* Redirects */}
      <Route
        path="/"
        element={
          isTokenValid ? (
            <Navigate to="/home" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Catch-all route */}
      <Route
        path="*"
        element={
          isTokenValid ? (
            <Navigate to="/home" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};

export default RouterComponent;
