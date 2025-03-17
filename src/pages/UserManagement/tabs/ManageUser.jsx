import React, { useEffect, useState } from "react";
import axios from "axios";
import ConfirmDialog from "../../../components/ConfirmDialog";
import ToastContainerWrapper from "./Components/ToastContainerWrapper";
import { toast } from "react-toastify";

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
                "dark:bg-black text-green-800 dark:text-white rounded-lg shadow-lg",
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
            "dark:bg-black text-green-800 dark:text-white rounded-lg shadow-lg",
          bodyClassName: "text-sm font-medium",
        });
        fetchUsers();
        handleModalClose();
      })
      .catch(() => {
        toast.error("Failed to update user.");
      });
  };

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <p>Loading users...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="dark:bg-dark_2 p-6 rounded-b-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white border-b-2 border-yellow-400 pb-2">
        User List
      </h1>
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search users..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary dark:text-white dark:bg-dark_3"
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
                  User Role
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Actions
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
                    {user.role}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {user.department}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => handleUpdate(user)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-md mr-2 hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Update User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white dark:bg-dark_2 p-6 rounded-lg w-1/3">
            <h2 className="text-xl font-bold mb-4 dark:text-white">
              Update User
            </h2>
            <input
              type="text"
              value={currentUser.userName}
              onChange={(e) =>
                setCurrentUser({ ...currentUser, userName: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 dark:text-white dark:bg-dark_3"
              placeholder="Name"
            />
            <input
              type="text"
              value={currentUser.role}
              onChange={(e) =>
                setCurrentUser({ ...currentUser, role: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 dark:text-white dark:bg-dark_3"
              placeholder="Role"
            />
            <div className="flex justify-end">
              <button
                onClick={handleModalClose}
                className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitUpdate}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUser;
