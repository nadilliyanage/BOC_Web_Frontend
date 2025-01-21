import React from "react";

const UserTable = ({ users, handleUpdate, handleDelete }) => {
  if (users.length === 0) {
    return <p className="text-center text-gray-600">No users found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-white dark:bg-dark_2">
            <th className="border border-gray-300 px-4 py-2 text-left">
              User ID
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Department
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              User Type
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              SMS Type
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Actions
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
              <td className="border border-gray-300 px-4 py-2 text-center">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                  onClick={() => handleUpdate(user)}
                >
                  Update
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
