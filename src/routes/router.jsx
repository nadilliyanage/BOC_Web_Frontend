import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Importing existing pages
import HomePage from "../pages/Home";
import InboxPage from "../pages/Inbox";
import ContactPage from "../pages/ContactList";
import ReportsPage from "../pages/Reports/Reports";
import SmsPage from "../pages/SMS/SMS";
import BlockNumbersPage from "../pages/NumberBlocking";
import UserManagement from "../pages/UserManagement/UserManagement";

// Simulating user role (admin, user1, or user2)
const user = "admin"; // Change this value to "user1" or "user2" to test other roles

const RouterComponent = () => {
  // Role-based route configuration
  const routesByRole = {
    admin: [
      { path: "/home", element: <HomePage /> },
      { path: "/inbox", element: <InboxPage /> },
      { path: "/contact", element: <ContactPage /> },
      { path: "/reports", element: <ReportsPage /> },
      { path: "/sms", element: <SmsPage /> },
      { path: "/block", element: <BlockNumbersPage /> },
      { path: "/usermanagement", element: <UserManagement /> },
    ],
    user1: [
      { path: "/home", element: <HomePage /> },
      { path: "/inbox", element: <InboxPage /> },
      { path: "/contact", element: <ContactPage /> },
      { path: "/sms", element: <SmsPage /> },
      { path: "/block", element: <BlockNumbersPage /> },
    ],
    user2: [
      { path: "/home", element: <HomePage /> },
      { path: "/inbox", element: <InboxPage /> },
      { path: "/contact", element: <ContactPage /> },
      { path: "/sms", element: <SmsPage /> },
      { path: "/block", element: <BlockNumbersPage /> },
    ],
  };

  // Default route to redirect to "/home" if the path doesn't match
  const roleRoutes = routesByRole[user] || [];

  return (
    <Routes>
      {roleRoutes.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
      {/* Default route */}
      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
};

export default RouterComponent;
