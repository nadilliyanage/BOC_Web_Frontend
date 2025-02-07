import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Importing existing pages
import HomePage from "../pages/Home";

import ReportsPage from "../pages/Reports/Reports";
import SmsPage from "../pages/SMS/SMS";
import UserManagement from "../pages/UserManagement/UserManagement";
import CreateMessage from "../pages/CreateMessage/CreateMessage";
import Contacts from "../pages/Contacts/Contacts";
import BlockNumbers from "../pages/BlockNumbers/BlockNumbers";

// Simulating user role (admin, user1, or user2)
const user = "admin"; // Change this value to "user1" or "user2" to test other roles

const RouterComponent = () => {
  // Role-based route configuration
  const routesByRole = {
    admin: [
      { path: "/home", element: <HomePage /> },
      { path: "/createMessage", element: <CreateMessage /> },
      { path: "/contacts", element: <Contacts /> },
      { path: "/reports", element: <ReportsPage /> },
      { path: "/sms", element: <SmsPage /> },
      { path: "/block", element: <BlockNumbers /> },
      { path: "/usermanagement", element: <UserManagement /> },
    ],
    user1: [
      { path: "/home", element: <HomePage /> },
      { path: "/createMessage", element: <CreateMessage /> },
      { path: "/contacts", element: <Contacts /> },
      { path: "/sms", element: <SmsPage /> },
      { path: "/block", element: <BlockNumbers /> },
    ],
    user2: [
      { path: "/home", element: <HomePage /> },
      { path: "/createMessage", element: <CreateMessage /> },
      { path: "/contacts", element: <Contacts /> },
      { path: "/sms", element: <SmsPage /> },
      { path: "/block", element: <BlockNumbers /> },
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
