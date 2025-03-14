import React, { useState } from "react";
import PackageDetails from "./tabs/PackageDetails";
import SenderStats from "./tabs/SenderStats";
import PendingMessage from "./tabs/PendingMessage";
import ScheduleMessage from "./tabs/ScheduledMessge";
import ErrorMessage from "./tabs/ErrorMessage";
import FinishedMessage from "./tabs/FinishedMessage";

const Reports = () => {
  const [activeTab, setActiveTab] = useState("pendingMessage"); // Active tab state

  return (
    <div className="flex flex-col w-full bg-gray-100 p-6 mt-4 dark:bg-[#404040]">
      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-300 rounded-t-lg pb-2 dark:bg-[#282828]">
        <button
          onClick={() => setActiveTab("pendingMessage")}
          className={`px-4 py-2 transition-all duration-300 ${
            activeTab === "pendingMessage"
              ? "border-b-2 border-yellow-500 text-yellow-500 font-medium"
              : "text-gray-600 hover:text-gray-800  dark:text-white"
          }`}
        >
          Pending Messages
        </button>
        <button
          onClick={() => setActiveTab("scheduleMessage")}
          className={`px-4 py-2 transition-all duration-300 ${
            activeTab === "scheduleMessage"
              ? "border-b-2 border-yellow-500 text-yellow-500 font-medium"
              : "text-gray-600 hover:text-gray-800  dark:text-white"
          }`}
        >
          Schedule Messages
        </button>

        <button
          onClick={() => setActiveTab("errorMessage")}
          className={`px-4 py-2 transition-all duration-300 ${
            activeTab === "errorMessage"
              ? "border-b-2 border-yellow-500 text-yellow-500 font-medium"
              : "text-gray-600 hover:text-gray-800  dark:text-white"
          }`}
        >
          Error Messages
        </button>
        <button
          onClick={() => setActiveTab("finishedMessage")}
          className={`px-4 py-2 transition-all duration-300 ${
            activeTab === "finishedMessage"
              ? "border-b-2 border-yellow-500 text-yellow-500 font-medium"
              : "text-gray-600 hover:text-gray-800  dark:text-white"
          }`}
        >
          Finished Messages
        </button>
        <button
          onClick={() => setActiveTab("packageDetails")}
          className={`px-4 py-2 transition-all duration-300 ${
            activeTab === "packageDetails"
              ? "border-b-2 border-yellow-500 text-yellow-500 font-medium"
              : "text-gray-600 hover:text-gray-800  dark:text-white"
          }`}
        >
          Package Details
        </button>
        <button
          onClick={() => setActiveTab("senderStats")}
          className={`px-4 py-2 transition-all duration-300 ${
            activeTab === "senderStats"
              ? "border-b-2 border-yellow-500 text-yellow-500 font-medium"
              : "text-gray-600 hover:text-gray-800  dark:text-white"
          }`}
        >
          Sender Stats
        </button>
      </div>

      {/* Content for each tab */}
      <div className="flex flex-col mt-6">
        {activeTab === "pendingMessage" && <PendingMessage />}

        {activeTab === "scheduleMessage" && <ScheduleMessage />}

        {activeTab === "packageDetails" && <PackageDetails />}

        {activeTab === "errorMessage" && <ErrorMessage />}

        {activeTab === "finishedMessage" && <FinishedMessage />}

        {activeTab === "senderStats" && <SenderStats />}
      </div>
    </div>
  );
};

export default Reports;
