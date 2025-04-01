import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUser, FaSearch, FaSpinner } from "react-icons/fa";

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch users from the backend
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/v1/getusers")
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users.");
        setLoading(false);
      });
  }, []);

  // Filter users based on search term
  const filteredUsers = users.filter((user) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      user.userId?.toString().toLowerCase().includes(searchTermLower) || // Search by userId
      user.userName?.toLowerCase().includes(searchTermLower) || // Search by userName
      user.role?.toLowerCase().includes(searchTermLower) || // Search by role
      user.department?.toLowerCase().includes(searchTermLower) // Search by department
    );
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <FaSpinner className="animate-spin text-4xl text-yellow-500" />
        <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
          Loading users...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg">
          <p className="text-lg font-medium text-red-600 dark:text-red-200">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 w-full mx-auto bg-white rounded-lg shadow-lg dark:bg-dark_2">
      <div className="flex items-center mb-6">
        <FaUser className="text-3xl text-yellow-500 mr-3" />
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          User List
        </h1>
      </div>

      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID, Name, Role, or Department..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent dark:bg-dark_3 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
          />
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-center py-8">
          <FaUser className="mx-auto text-4xl text-gray-400 mb-2" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No users found matching your search.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-dark_3">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  User ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  User Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Department
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-dark_1 dark:divide-gray-700">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 dark:hover:bg-dark_2 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {user.userId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {user.userName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {user.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {user.department}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageUser;
