import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import MsgCreate from "./tabs/MsgCreate";
import MsgReview from "./tabs/MsgReview";
import MsgAccept from "./tabs/MsgAccept";
import MsgReject from "./tabs/MsgReject";

const CreateMessage = () => {
  const location = useLocation();
  ("msgCreate");
  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || "msgCreate"
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-dark_2 rounded-lg shadow-md">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("msgCreate")}
              className={`${
                activeTab === "msgCreate"
                  ? "border-secondary text-secondary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors duration-200`}
            >
              Create Message
            </button>
            <button
              onClick={() => setActiveTab("msgReview")}
              className={`${
                activeTab === "msgReview"
                  ? "border-secondary text-secondary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors duration-200`}
            >
              Review Message
            </button>
            <button
              onClick={() => setActiveTab("msgAccept")}
              className={`${
                activeTab === "msgAccept"
                  ? "border-secondary text-secondary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors duration-200`}
            >
              Accepted Messages
            </button>
            <button
              onClick={() => setActiveTab("msgReject")}
              className={`${
                activeTab === "msgReject"
                  ? "border-secondary text-secondary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors duration-200`}
            >
              Reject Messages
            </button>
          </nav>
        </div>
        <div className="p-6">
          {activeTab === "msgCreate" && <MsgCreate />}
          {activeTab === "msgReview" && <MsgReview />}
          {activeTab === "msgAccept" && <MsgAccept />}
          {activeTab === "msgReject" && <MsgReject />}
        </div>
      </div>
    </div>
  );
};

export default CreateMessage;
