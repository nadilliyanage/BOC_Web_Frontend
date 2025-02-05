import React, { useState } from "react";
import AddContacts from "./tabs/AddContacts";
import ManageContacts from "./tabs/ManageContacts";

const Contacts = () => {
  const [activeTab, setActiveTab] = useState("addContacts"); // Active tab state

  return (
    <div className="flex flex-col w-full bg-gray-100 p-6 mt-4 dark:bg-dark_3">
      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-300 pb-2 rounded-t-lg dark:bg-dark_2">
        <button
          onClick={() => setActiveTab("addContacts")}
          className={`px-4 py-2 ${
            activeTab === "addContacts"
              ? "border-b-2 border-yellow-500 text-yellow-500 font-medium"
              : "text-gray-600 hover:text-gray-800 dark:text-white"
          }`}
        >
          Add Contacts
        </button>
        <button
          onClick={() => setActiveTab("manageContacts")}
          className={`px-4 py-2 ${
            activeTab === "manageContacts"
              ? "border-b-2 border-yellow-500 text-yellow-500 font-medium"
              : "text-gray-600 hover:text-gray-800 dark:text-white"
          }`}
        >
          Manage Contacts
        </button>
      </div>

      {/* Content for each tab */}
      <div className="flex flex-col md:flex-row items-start mt-6">
        {activeTab === "addContacts" && <AddContacts />}

        {activeTab === "manageContacts" && <ManageContacts />}
      </div>
    </div>
  );
};

export default Contacts;
