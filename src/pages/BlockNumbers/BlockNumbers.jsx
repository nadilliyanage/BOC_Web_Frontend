import React, { useState } from "react";
import NumberBlocking from "./tabs/NumberBlockin";
import ManageBlockNumbers from "./tabs/ManageBlockNumbers";

const BlockNumbers = () => {
  const [activeTab, setActiveTab] = useState("numberBlocking"); // Active tab state

  return (
    <div className="flex flex-col w-full bg-primary_2 p-6 mt-4 dark:bg-dark_3">
      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-300 pb-2 rounded-t-lg dark:bg-dark_2">
        <button
          onClick={() => setActiveTab("numberBlocking")}
          className={`px-4 py-2 ${
            activeTab === "numberBlocking"
              ? "border-b-2 border-yellow-500 text-yellow-500 font-medium"
              : "text-gray-600 hover:text-gray-800 dark:text-white"
          }`}
        >
          Number Blocking
        </button>
        <button
          onClick={() => setActiveTab("manageBlockNumbers")}
          className={`px-4 py-2 ${
            activeTab === "manageBlockNumbers"
              ? "border-b-2 border-yellow-500 text-yellow-500 font-medium"
              : "text-gray-600 hover:text-gray-800 dark:text-white"
          }`}
        >
          Manage Block Numbers
        </button>
      </div>

      {/* Content for each tab */}
      <div className="flex flex-col md:flex-row items-start mt-6">
        {activeTab === "numberBlocking" && <NumberBlocking />}

        {activeTab === "manageBlockNumbers" && <ManageBlockNumbers />}
      </div>
    </div>
  );
};

export default BlockNumbers;
