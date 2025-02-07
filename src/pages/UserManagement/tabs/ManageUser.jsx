import React, { useEffect, useState } from "react";
import axios from "axios";
import ConfirmDialog from "../../../components/ConfirmDialog";
import UserTable from "./Components/UserTable";
import ToastContainerWrapper from "./Components/ToastContainerWrapper";
import { toast } from "react-toastify";

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

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
                "dark:bg-black text-green-800 dark:text-white rounded-lg shadow-lg", // Tailwind styles for the container
              bodyClassName: "text-sm font-medium", // Tailwind styles for the body
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
            "dark:bg-black text-green-800 dark:text-white rounded-lg shadow-lg", // Tailwind styles for the container
          bodyClassName: "text-sm font-medium", // Tailwind styles for the body
        });
        fetchUsers();
        handleModalClose();
      })
      .catch(() => {
        toast.error("Failed to update user.");
      });
  };

  if (loading) {
    return <p>Loading users...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="dark:bg-dark_2 p-6 rounded-b-md">
      <ToastContainerWrapper />
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
        User List
      </h1>
      <UserTable
        users={users}
        handleUpdate={handleUpdate}
        handleDelete={handleDelete}
      />
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 dark:bg-dark_2">
            <h2 className="text-lg font-bold mb-4">Update User</h2>
            {currentUser &&
              Object.keys(currentUser)
                .filter((key) => key !== "id") // Exclude the 'id' field
                .map((key) => (
                  <div className="mb-4" key={key}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                      {key.charAt(0).toUpperCase() + key.slice(1)}{" "}
                      {/* Capitalize the field name */}
                    </label>
                    {key === "userType" ? (
                      <select
                        id="userType"
                        name="userType"
                        value={currentUser[key]}
                        onChange={(e) =>
                          setCurrentUser({
                            ...currentUser,
                            [key]: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#eab308] dark:text-white dark:bg-dark_3"
                        required
                      >
                        <option value="" disabled>
                          Select User Type
                        </option>
                        <option value="2-Opr1">2-Opr1(Promotional SMS)</option>
                        <option value="3-Opr2">
                          3-Opr2(Non Promotional SMS)
                        </option>
                        <option value="4-Opr3">4-Opr3(both)</option>
                        <option value="Loan">Loan SMS</option>
                      </select>
                    ) : key === "smsType" ? (
                      <select
                        id="smsType"
                        name="smsType"
                        value={currentUser[key]}
                        onChange={(e) =>
                          setCurrentUser({
                            ...currentUser,
                            [key]: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#eab308] dark:text-white dark:bg-dark_3"
                        required
                      >
                        <option value="" disabled>
                          Select SMS Type
                        </option>
                        <option value="ATM">ATM</option>
                        <option value="BSG">BSG Message</option>
                        <option value="Branch_loan">
                          Branch Loan Recoveries
                        </option>
                        <option value="BOCIT">BOC IT</option>
                        <option value="CreditCard">Credit Card</option>
                        <option value="InwardRemmitance">
                          Inward Remittance Alerts
                        </option>
                        <option value="Loan">Loan Messages</option>
                        <option value="LankaPay">Lanka Pay</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Remmitance">Remittance</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        className="w-full px-3 py-2 border rounded dark:text-white dark:bg-dark_3"
                        value={currentUser[key]}
                        onChange={(e) =>
                          setCurrentUser({
                            ...currentUser,
                            [key]: e.target.value,
                          })
                        }
                      />
                    )}
                  </div>
                ))}

            <div className="flex justify-end">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                onClick={handleModalClose}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={handleSubmitUpdate}
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
