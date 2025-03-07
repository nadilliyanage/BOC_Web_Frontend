import React, { useState } from "react";
import SendSMS from "./tabs/SendSMS";
import SendCustomizeSMS from "./tabs/SendCustomizeSMS";
import PendingMessage from "./tabs/PendingMessage";
import ScheduledMessage from "./tabs/ScheduledMessge";
import FinishedMessage from "./tabs/FinishedMessage";
import ErrorMessage from "./tabs/ErrorMessage";

const Sms = () => {
  const [activeTab, setActiveTab] = useState("sendSms"); // Active tab state

  return (
    <div className="flex flex-col w-full bg-gray-100 p-6 mt-4 dark:bg-dark_3">
      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-300 pb-2 rounded-t-lg dark:bg-dark_2">
        <button
          onClick={() => setActiveTab("sendSms")}
          className={`px-4 py-2 ${
            activeTab === "sendSms"
              ? "border-b-2 border-yellow-500 text-yellow-500 font-medium"
              : "text-gray-600 hover:text-gray-800 dark:text-white"
          }`}
        >
          Send SMS
        </button>
        <button
          onClick={() => setActiveTab("customizeBulk")}
          className={`px-4 py-2 ${
            activeTab === "customizeBulk"
              ? "border-b-2 border-yellow-500 text-yellow-500 font-medium"
              : "text-gray-600 hover:text-gray-800 dark:text-white"
          }`}
        >
          Send Customize Bulk Message
        </button>

        <button
          onClick={() => setActiveTab("scheduledCampaign")}
          className={`px-4 py-2 ${
            activeTab === "scheduledCampaign"
              ? "border-b-2 border-yellow-500 text-yellow-500 font-medium"
              : "text-gray-600 hover:text-gray-800 dark:text-white"
          }`}
        >
          Scheduled Campaign
        </button>

        <button
          onClick={() => setActiveTab("pendingCampaign")}
          className={`px-4 py-2 ${
            activeTab === "pendingCampaign"
              ? "border-b-2 border-yellow-500 text-yellow-500 font-medium"
              : "text-gray-600 hover:text-gray-800 dark:text-white"
          }`}
        >
          Pending Campaign
        </button>

        <button
          onClick={() => setActiveTab("finishedCampaign")}
          className={`px-4 py-2 ${
            activeTab === "finishedCampaign"
              ? "border-b-2 border-yellow-500 text-yellow-500 font-medium"
              : "text-gray-600 hover:text-gray-800 dark:text-white"
          }`}
        >
          Finished Campaign
        </button>

        <button
          onClick={() => setActiveTab("errorCampaign")}
          className={`px-4 py-2 ${
            activeTab === "errorCampaign"
              ? "border-b-2 border-yellow-500 text-yellow-500 font-medium"
              : "text-gray-600 hover:text-gray-800 dark:text-white"
          }`}
        >
          Error Campaign
        </button>
      </div>

      {/* Content for each tab */}
      <div className="flex flex-col md:flex-row items-start mt-6">
        {activeTab === "sendSms" && <SendSMS />}

        {activeTab === "customizeBulk" && <SendCustomizeSMS />}

        {activeTab === "createMessage" && <CreateMessage />}

        {activeTab === "reviewMessage" && <ReviewMessage />}

        {activeTab === "scheduledCampaign" && <ScheduledMessage />}

        {activeTab === "pendingCampaign" && <PendingMessage />}

        {activeTab === "finishedCampaign" && <FinishedMessage />}

        {activeTab === "errorCampaign" && <ErrorMessage />}
      </div>
    </div>
  );
};

export default Sms;
