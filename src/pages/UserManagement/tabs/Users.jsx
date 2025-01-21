import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
        User List
      </h1>
      {users.length === 0 ? (
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
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="even:bg-gray-50 dark:even:bg-dark_2 hover:bg-gray-100 dark:hover:bg-dark_2"
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
