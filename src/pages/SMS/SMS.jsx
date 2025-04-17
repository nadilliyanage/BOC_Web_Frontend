import React, { useState } from "react";
import SendSMS from "./tabs/SendSMS";
import SendCustomizeSMS from "./tabs/SendCustomizeSMS";

const Sms = () => {
  const [activeTab, setActiveTab] = useState("sendSms"); // Active tab state

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-dark_2 rounded-lg shadow-md">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("sendSms")}
              className={`${
                activeTab === "sendSms"
                  ? "border-secondary text-secondary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors duration-200`}
            >
              Send SMS
            </button>
            <button
              onClick={() => setActiveTab("customizeBulk")}
              className={`${
                activeTab === "customizeBulk"
                  ? "border-secondary text-secondary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors duration-200`}
            >
              Send Customize Bulk Message
            </button>
          </nav>
        </div>
        <div className="p-6">
          {activeTab === "sendSms" && <SendSMS />}
          {activeTab === "customizeBulk" && <SendCustomizeSMS />}
        </div>
      </div>
    </div>
  );
};

export default Sms;
