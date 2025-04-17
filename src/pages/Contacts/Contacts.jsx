import React, { useState } from "react";
import AddContacts from "./tabs/AddContacts";
import ManageContacts from "./tabs/ManageContacts";

const Contacts = () => {
  const [activeTab, setActiveTab] = useState("addContacts"); // Active tab state

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-dark_2 rounded-lg shadow-md">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("addContacts")}
              className={`${
                activeTab === "addContacts"
                  ? "border-secondary text-secondary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors duration-200`}
            >
              Add Contacts
            </button>
            <button
              onClick={() => setActiveTab("manageContacts")}
              className={`${
                activeTab === "manageContacts"
                  ? "border-secondary text-secondary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors duration-200`}
            >
              Manage Contacts
            </button>
          </nav>
        </div>
        <div className="p-6">
          {activeTab === "addContacts" && <AddContacts />}
          {activeTab === "manageContacts" && <ManageContacts />}
        </div>
      </div>
    </div>
  );
};

export default Contacts;
