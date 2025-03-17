import React, { useState } from "react";
import SendSMS from "./tabs/SendSMS";
import SendCustomizeSMS from "./tabs/SendCustomizeSMS";

const Sms = () => {
  const [activeTab, setActiveTab] = useState("sendSms"); // Active tab state

  return (
    <div className="flex flex-col w-full bg-primary_2 p-6 mt-4 dark:bg-dark_3 transition-colors duration-300">
      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-300 pb-2 rounded-t-lg dark:bg-dark_2 transition-colors duration-300">
        <button
          onClick={() => setActiveTab("sendSms")}
          className={`px-4 py-2 transition-colors duration-300 ${
            activeTab === "sendSms"
              ? "border-b-2 border-yellow-500 text-yellow-500 font-medium "
              : "text-gray-600 hover:text-gray-800 dark:text-white"
          }`}
        >
          Send SMS
        </button>
        <button
          onClick={() => setActiveTab("customizeBulk")}
          className={`px-4 py-2 transition-colors duration-300 ${
            activeTab === "customizeBulk"
              ? "border-b-2 border-yellow-500 text-yellow-500 font-medium "
              : "text-gray-600 hover:text-gray-800 dark:text-white"
          }`}
        >
          Send Customize Bulk Message
        </button>
      </div>

      {/* Content for each tab */}
      <div className=" mt-6">
        {activeTab === "sendSms" && <SendSMS />}

        {activeTab === "customizeBulk" && <SendCustomizeSMS />}
      </div>
    </div>
  );
};

export default Sms;
