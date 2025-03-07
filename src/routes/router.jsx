import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Importing existing pages
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
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

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

  // Default route to redirect to "/home" if the path doesn't match
  const roleRoutes = user ? routesByRole[user.role] || [] : [];

  return (
    <Routes>
      {/* Public route for login */}
      <Route
        path="/login"
        element={
          <LoginPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        }
      />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/waiting" element={<WaitingPage />} />

      {/* Protected routes */}
      {roleRoutes.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}

      {/* Redirect to login if not authenticated */}
      <Route
        path="/"
        element={user ? <Navigate to="/home" /> : <Navigate to="/login" />}
      />

      {/* Default route */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default RouterComponent;
