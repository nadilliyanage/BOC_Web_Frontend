import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import PackageDetails from "./tabs/PackageDetails";
import SenderStats from "./tabs/SenderStats";
import PendingMessage from "./tabs/PendingMessage";
import ScheduleMessage from "./tabs/ScheduledMessge";
import ErrorMessage from "./tabs/ErrorMessage";
import FinishedMessage from "./tabs/FinishedMessage";
import OverallReport from "./OverallReport";

const Reports = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overall");

  const tabs = [
    { id: "overall", label: "Overall Report" },
    { id: "pending", label: "Pending Messages" },
    { id: "scheduled", label: "Scheduled Messages" },
    { id: "error", label: "Error Messages" },
    { id: "finished", label: "Finished Messages" },
    { id: "package", label: "Package Details" },
    { id: "sender", label: "Sender Stats" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overall":
        return <OverallReport />;
      case "pending":
        return <PendingMessage />;
      case "scheduled":
        return <ScheduleMessage />;
      case "error":
        return <ErrorMessage />;
      case "finished":
        return <FinishedMessage />;
      case "package":
        return <PackageDetails />;
      case "sender":
        return <SenderStats />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-dark_2 rounded-lg shadow-md">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? "border-secondary text-secondary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors duration-200`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-6">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default Reports;
