import React, { useState } from "react";
import NumberBlocking from "./tabs/NumberBlockin";
import ManageBlockNumbers from "./tabs/ManageBlockNumbers";

const BlockNumbers = () => {
  const [activeTab, setActiveTab] = useState("numberBlocking"); // Active tab state

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-dark_2 rounded-lg shadow-md">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("numberBlocking")}
              className={`${
                activeTab === "numberBlocking"
                  ? "border-secondary text-secondary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors duration-200`}
            >
              Number Blocking
            </button>
            <button
              onClick={() => setActiveTab("manageBlockNumbers")}
              className={`${
                activeTab === "manageBlockNumbers"
                  ? "border-secondary text-secondary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors duration-200`}
            >
              Manage Block Numbers
            </button>
          </nav>
        </div>
        <div className="p-6">
          {activeTab === "numberBlocking" && <NumberBlocking />}
          {activeTab === "manageBlockNumbers" && <ManageBlockNumbers />}
        </div>
      </div>
    </div>
  );
};

export default BlockNumbers;
