import React, { useState } from "react";

import CreateUser from "./tabs/CreateUser";
import ManageUser from "./tabs/ManageUser";
import Users from "./tabs/Users";
import DeletedUsers from "./tabs/DeletedUsers";

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState("users"); // Active tab state
  const user = "admin"; // Change this value to "user1" or "user2" to test other roles

  return (
    <div className="flex flex-col w-full bg-gray-100 p-6 mt-4 dark:bg-[#404040]">
      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-300 pb-2 rounded-t-lg dark:bg-[#282828]">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 ${
            activeTab === "users"
              ? "border-b-2 border-yellow-500 text-yellow-500 font-medium"
              : "text-gray-600 hover:text-gray-800 dark:text-white"
          }`}
        >
          Users
        </button>

        <button
          onClick={() => setActiveTab("createUser")}
          className={`px-4 py-2 ${
            activeTab === "createUser"
              ? "border-b-2 border-yellow-500 text-yellow-500 font-medium"
              : "text-gray-600 hover:text-gray-800 dark:text-white"
          }`}
        >
          Create User
        </button>

        {user === "admin" && (
          <button
            onClick={() => setActiveTab("manageuser")}
            className={`px-4 py-2 ${
              activeTab === "manageuser"
                ? "border-b-2 border-yellow-500 text-yellow-500 font-medium"
                : "text-gray-600 hover:text-gray-800 dark:text-white"
            }`}
          >
            Manage User
          </button>
        )}

        {user === "admin" && (
          <button
            onClick={() => setActiveTab("deletedusers")}
            className={`px-4 py-2 ${
              activeTab === "deletedusers"
                ? "border-b-2 border-yellow-500 text-yellow-500 font-medium"
                : "text-gray-600 hover:text-gray-800 dark:text-white"
            }`}
          >
            Deleted Users
          </button>
        )}
      </div>

      {/* Content for each tab */}
      <div className="flex-grow mt-6">
        {activeTab === "users" && (
          <div className="w-full">
            <Users />
          </div>
        )}

        {activeTab === "createUser" && (
          <div className="w-full">
            <CreateUser />
          </div>
        )}

        {activeTab === "manageuser" && (
          <div className="w-full">
            <ManageUser />
          </div>
        )}

        {activeTab === "deletedusers" && (
          <div className="w-full">
            <DeletedUsers />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
