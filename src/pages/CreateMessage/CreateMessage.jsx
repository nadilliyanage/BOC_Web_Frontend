import React, { useState } from "react";
import MsgCreate from "./tabs/MsgCreate";
import MsgReview from "./tabs/MsgReview";
import MsgAccept from "./tabs/MsgAccept";
import MsgReject from "./tabs/MsgReject";

const CreateMessage = () => {
  const [activeTab, setActiveTab] = useState("msgCreate"); // Active tab state

  return (
    <div className="flex flex-col w-full bg-gray-100 p-6 mt-4 dark:bg-dark_3">
      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-300 pb-2 rounded-t-lg dark:bg-dark_2">
        <button
          onClick={() => setActiveTab("msgCreate")}
          className={`px-4 py-2 ${
            activeTab === "msgCreate"
              ? "border-b-2 border-yellow-500 text-yellow-500 font-medium"
              : "text-gray-600 hover:text-gray-800 dark:text-white"
          }`}
        >
          Create Message
        </button>
        <button
          onClick={() => setActiveTab("msgReview")}
          className={`px-4 py-2 ${
            activeTab === "msgReview"
              ? "border-b-2 border-yellow-500 text-yellow-500 font-medium"
              : "text-gray-600 hover:text-gray-800 dark:text-white"
          }`}
        >
          Review Message
        </button>
        <button
          onClick={() => setActiveTab("msgAccept")}
          className={`px-4 py-2 ${
            activeTab === "msgAccept"
              ? "border-b-2 border-yellow-500 text-yellow-500 font-medium"
              : "text-gray-600 hover:text-gray-800 dark:text-white"
          }`}
        >
          Accepted Messages
        </button>
        <button
          onClick={() => setActiveTab("msgReject")}
          className={`px-4 py-2 ${
            activeTab === "msgReject"
              ? "border-b-2 border-yellow-500 text-yellow-500 font-medium"
              : "text-gray-600 hover:text-gray-800 dark:text-white"
          }`}
        >
          Reject Messages
        </button>
      </div>

      {/* Content for each tab */}
      <div className="flex flex-col md:flex-row items-start mt-6">
        {activeTab === "msgCreate" && <MsgCreate />}

        {activeTab === "msgReview" && <MsgReview />}

        {activeTab === "msgAccept" && <MsgAccept />}

        {activeTab === "msgReject" && <MsgReject />}
      </div>
    </div>
  );
};

export default CreateMessage;
