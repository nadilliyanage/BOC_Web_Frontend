import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { MdEdit, MdDelete } from "react-icons/md";
import { jwtDecode } from "jwt-decode";
import ConfirmDialog from "../../../components/ConfirmDialog";

const ReviewMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchMessages();
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          id: decoded.id,
          name: decoded.name,
          userId: decoded.userId,
        });
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/create-message/pending"
      );
      setMessages(response.data);
      setLoading(false);
    } catch (error) {
      setError("Unable to fetch messages. Please try again later.");
      setLoading(false);
    }
  };

  const updateMessageStatus = async (messageId, status) => {
    if (!user) return;
    try {
      const apiEndpoint = `http://localhost:8080/api/v1/create-message/status/${messageId}`;
      const payload = {
        status: status,
        status_update_by: user.name,
        status_update_by_id: user.id,
        status_update_by_userId: user.userId,
      };
      await axios.patch(apiEndpoint, payload);

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId ? { ...msg, status: payload.status } : msg
        )
      );

      toast.success(`Message has been ${status}.`, {
        className:
          "bg-secondary text-green-800 dark:bg-secondary dark:text-green-200 rounded-lg shadow-lg",
        bodyClassName: "text-sm font-medium",
      });
    } catch (error) {
      toast.error(`Failed to ${status} the message.`);
    }
  };

  const handleDelete = (id) => {
    ConfirmDialog({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:8080/api/v1/create-message/${id}`)
          .then(() => {
            toast.success("Message deleted successfully!", {
              className:
                "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-lg shadow-lg",
              bodyClassName: "text-sm font-medium",
            });
            fetchMessages();
          })
          .catch(() => {
            toast.error("Failed to delete message.");
          });
      }
    });
  };

  const handleEdit = (message) => {
    setCurrentMessage(message);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setCurrentMessage(null);
  };

  const handleSubmitUpdate = () => {
    axios
      .patch(
        `http://localhost:8080/api/v1/create-message/${currentMessage.id}`,
        {
          label: currentMessage.label,
          message: currentMessage.message,
          updated_by: user.name,
          updated_by_id: user.id,
          updated_by_userId: user.userId,
        }
      )
      .then(() => {
        toast.success(
          <div>
            <div>Message updated successfully!</div>
            <div>Go to review tab to review again</div>
          </div>,
          {
            className:
              "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-lg shadow-lg",
            bodyClassName: "text-sm font-medium",
          }
        );
        fetchMessages();
        handleModalClose();
      })
      .catch(() => {
        toast.error("Failed to update message.");
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentMessage((prevMessage) => ({
      ...prevMessage,
      [name]: value,
    }));
  };

  const filteredMessages = messages.filter(
    (message) =>
      message.status === "pending" &&
      (message.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.message.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px] ">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <div className="bg-white dark:bg-dark_2 p-6 rounded-lg shadow-md min-w-full">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        toastClassName="rounded-lg shadow-lg"
        bodyClassName="text-sm font-medium"
      />

      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white border-b-2 border-yellow-400 pb-2">
        Pending Messages
      </h1>

      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search messages..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-dark_3 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
        />
      </div>

      {filteredMessages.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No messages found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-dark_3">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Label
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Created By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Created By ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Updated By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Updated By ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-dark_1 dark:divide-gray-700">
              {filteredMessages.map((message) => (
                <tr
                  key={message.id}
                  className="hover:bg-gray-50 dark:hover:bg-dark_2"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {message.label}
                  </td>
                  <td className="py-4 px-4 text-gray-700 dark:text-white">
                    <pre className="overflow-auto whitespace-pre-wrap break-words max-w-xs md:max-w-sm lg:max-w-md">
                      {message.message}
                    </pre>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {message.created_by || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {message.created_by_userId ||
                      message.created_by_user_id ||
                      "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {message.updated_by || "Not Updated"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {message.updated_by_userId || "Not Updated"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() =>
                        updateMessageStatus(message.id, "accepted")
                      }
                      className="mr-2 text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 px-3 py-1 rounded-md text-sm font-medium"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() =>
                        updateMessageStatus(message.id, "rejected")
                      }
                      className="mr-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 px-3 py-1 rounded-md text-sm font-medium"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleEdit(message)}
                      className="mr-2 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 px-3 py-1 rounded-md text-sm font-medium"
                    >
                      <MdEdit className="inline mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(message.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 px-3 py-1 rounded-md text-sm font-medium"
                    >
                      <MdDelete className="inline mr-1" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 dark:text-white">
              Edit Message
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Label
              </label>
              <input
                type="text"
                name="label"
                value={currentMessage?.label || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Message
              </label>
              <textarea
                name="message"
                value={currentMessage?.message || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                rows="4"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={handleModalClose}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitUpdate}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md dark:bg-blue-700 dark:hover:bg-blue-800"
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

export default ReviewMessages;
