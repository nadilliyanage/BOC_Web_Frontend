import React from "react";
import { Routes, Route } from "react-router-dom";

// Importing existing pages
import HomePage from "../pages/Home";
import InboxPage from "../pages/Inbox";
import ContactPage from "../pages/ContactList";
import ReportsPage from "../pages/Reports/Reports";
import SmsPage from "../pages/SMS/SMS";
import BlockNumbersPage from "../pages/NumberBlocking";

const RouterComponent = () => {
  return (
    <Routes>
      <Route path="/home" element={<HomePage />} />
      <Route path="/inbox" element={<InboxPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="/sms" element={<SmsPage />} />
      <Route path="/block" element={<BlockNumbersPage />} />
      {/* Add a default route */}
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
};

export default RouterComponent;
