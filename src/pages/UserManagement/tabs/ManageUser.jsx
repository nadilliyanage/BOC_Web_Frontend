import React, { useEffect, useState } from "react";
import axios from "axios";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { toast } from "react-toastify";
import { FaUser, FaSearch, FaSpinner, FaEdit, FaTrash } from "react-icons/fa";

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios
      .get("http://localhost:8080/api/v1/getusers")
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch users.");
        setLoading(false);
      });
  };

  const handleDelete = (id) => {
    ConfirmDialog({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:8080/api/v1/deleteuser/${id}`)
          .then(() => {
            toast.success("User deleted successfully!", {
              className:
                "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-lg shadow-lg",
              bodyClassName: "text-sm font-medium",
            });
            fetchUsers();
          })
          .catch(() => {
            toast.error("Failed to delete user.");
          });
      }
    });
  };

  const handleUpdate = (user) => {
    setCurrentUser(user);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setCurrentUser(null);
  };

  const handleSubmitUpdate = () => {
    axios
      .put("http://localhost:8080/api/v1/updateuser", currentUser)
      .then(() => {
        toast.success("User updated successfully!", {
          className:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-lg shadow-lg",
          bodyClassName: "text-sm font-medium",
        });
        fetchUsers();
        handleModalClose();
      })
      .catch(() => {
        toast.error("Failed to update user.");
      });
  };

  const filteredUsers = users.filter(
    (user) =>
      user.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent dark:bg-dark_3 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
          />
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-center py-8">
          <FaUser className="mx-auto text-4xl text-gray-400 mb-2" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No users found.
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleUpdate(user)}
                        className="p-2 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 rounded-full transition-colors duration-200"
                      >
                        <FaEdit className="text-xl" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 rounded-full transition-colors duration-200"
                      >
                        <FaTrash className="text-xl" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Update User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center mb-6">
              <FaEdit className="text-2xl text-yellow-500 mr-3" />
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Update User
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={currentUser?.userName || ""}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, userName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:text-white dark:bg-dark_3 dark:border-gray-600"
                  placeholder="Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  User Role
                </label>
                <select
                  value={currentUser?.role || ""}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, role: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:text-white dark:bg-dark_3 dark:border-gray-600"
                >
                  <option value="">Select User Type</option>
                  <option value="ADMIN">Admin</option>
                  <option value="USER1">user1</option>
                  <option value="USER2">user2</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={handleModalClose}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitUpdate}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors duration-200"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUser;
