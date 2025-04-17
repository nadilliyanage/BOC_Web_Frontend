import React, { useState } from "react";

import CreateUser from "./tabs/CreateUser";
import ManageUser from "./tabs/ManageUser";
import Users from "./tabs/Users";
import DeletedUsers from "./tabs/DeletedUsers";

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState("users"); // Active tab state
  const user = "admin"; // Change this value to "user1" or "user2" to test other roles

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-dark_2 rounded-lg shadow-md">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("users")}
              className={`${
                activeTab === "users"
                  ? "border-secondary text-secondary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors duration-200`}
            >
              Users
            </button>

            <button
              onClick={() => setActiveTab("createUser")}
              className={`${
                activeTab === "createUser"
                  ? "border-secondary text-secondary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors duration-200`}
            >
              Create User
            </button>

            {user === "admin" && (
              <button
                onClick={() => setActiveTab("manageuser")}
                className={`${
                  activeTab === "manageuser"
                    ? "border-secondary text-secondary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors duration-200`}
              >
                Manage User
              </button>
            )}

            {user === "admin" && (
              <button
                onClick={() => setActiveTab("deletedusers")}
                className={`${
                  activeTab === "deletedusers"
                    ? "border-secondary text-secondary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors duration-200`}
              >
                Deleted Users
              </button>
            )}
          </nav>
        </div>
        <div className="p-6">
          {activeTab === "users" && <Users />}
          {activeTab === "createUser" && <CreateUser />}
          {activeTab === "manageuser" && <ManageUser />}
          {activeTab === "deletedusers" && <DeletedUsers />}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
