import React, { useState } from "react";
import Transactions from "./tabs/Transactions";
import CampaignHistory from "./tabs/CampaignHistory";
import PackageDetails from "./tabs/PackageDetails";
import GlobalReports from "./tabs/GlobalReports";
import DeliveredSMS from "./tabs/DeliveredSMS";
import SenderStats from "./tabs/SenderStats";

const Reports = () => {
  const [activeTab, setActiveTab] = useState("transactions"); // Active tab state

  return (
    <div className="flex flex-col w-full bg-gray-100 p-6 mt-4 dark:bg-[#404040]">
      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-300 rounded-t-lg pb-2 dark:bg-[#282828]">
        <button
          onClick={() => setActiveTab("transactions")}
          className={`px-4 py-2 transition-all duration-300 ${
            activeTab === "transactions"
              ? "border-b-2 border-yellow-500 text-yellow-500 font-medium"
              : "text-gray-600 hover:text-gray-800  dark:text-white"
          }`}
        >
          Transactions
        </button>
        <button
          onClick={() => setActiveTab("campaignHistory")}
          className={`px-4 py-2 transition-all duration-300 ${
            activeTab === "campaignHistory"
              ? "border-b-2 border-yellow-500 text-yellow-500 font-medium"
              : "text-gray-600 hover:text-gray-800  dark:text-white"
          }`}
        >
          Campaign History
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
          onClick={() => setActiveTab("globalReports")}
          className={`px-4 py-2 transition-all duration-300 ${
            activeTab === "globalReports"
              ? "border-b-2 border-yellow-500 text-yellow-500 font-medium"
              : "text-gray-600 hover:text-gray-800  dark:text-white"
          }`}
        >
          Global Reports
        </button>
        <button
          onClick={() => setActiveTab("deliveredSMS")}
          className={`px-4 py-2 transition-all duration-300 ${
            activeTab === "deliveredSMS"
              ? "border-b-2 border-yellow-500 text-yellow-500 font-medium"
              : "text-gray-600 hover:text-gray-800  dark:text-white"
          }`}
        >
          Delivered SMS
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
        {activeTab === "transactions" && <Transactions />}

        {activeTab === "campaignHistory" && <CampaignHistory />}

        {activeTab === "packageDetails" && <PackageDetails />}

        {activeTab === "globalReports" && <GlobalReports />}

        {activeTab === "deliveredSMS" && <DeliveredSMS />}

        {activeTab === "senderStats" && <SenderStats />}
      </div>
    </div>
  );
};

export default Reports;
