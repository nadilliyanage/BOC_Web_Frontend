import React, { useEffect, useState } from "react";
import axios from "axios";

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
    return (
      user.userId.toString().includes(searchTerm) || // Search by userId
      user.userName.toLowerCase().includes(searchTerm.toLowerCase()) || // Search by userName
      user.department.toLowerCase().includes(searchTerm.toLowerCase()) || // Search by department
      user.userType.toLowerCase().includes(searchTerm.toLowerCase()) || // Search by userType
      user.smsType.toLowerCase().includes(searchTerm.toLowerCase()) // Search by smsType
    );
  });

  if (loading)
    return (
      <p className="text-center text-lg font-medium text-gray-600">
        Loading users...
      </p>
    );
  if (error)
    return (
      <p className="text-center text-lg font-medium text-red-500">{error}</p>
    );

  return (
    <div className="dark:bg-dark_2 p-6 rounded-b-md">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
        User List
      </h1>
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search users..."
          className="w-full px-4 py-2 border border-gray-300  rounded-md focus:outline-none focus:ring-2 focus:ring-secondary dark:text-white dark:bg-dark_3"
        />
      </div>
      {filteredUsers.length === 0 ? (
        <p className="text-center text-gray-600">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-white dark:bg-dark_2">
                <th className="border border-gray-300 px-4 py-2 text-left">
                  User ID
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Name
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Department
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  User Type
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  SMS Type
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="even:bg-gray-50 dark:even:bg-dark_2 hover:bg-gray-100 dark:hover:bg-dark_3"
                >
                  <td className="border border-gray-300 px-4 py-2">
                    {user.userId}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {user.userName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {user.department}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {user.userType}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {user.smsType}
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
