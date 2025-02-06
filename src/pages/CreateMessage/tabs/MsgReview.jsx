import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { MdEdit, MdDelete } from "react-icons/md";

const MsgReview = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/create-message"
      );
      setMessages(response.data);
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Unable to fetch messages. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          popup:
            "bg-white dark:bg-gray-800 dark:text-white border border-gray-600 rounded-lg shadow-lg",
          title: "dark:text-yellow-400 font-bold text-xl",
          htmlContainer: "dark:text-gray-300",
          confirmButton:
            "bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded",
          cancelButton:
            "bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const updateMessageStatus = async (messageId, status) => {
    try {
      const apiEndpoint = `http://localhost:8080/api/v1/create-message/status/${messageId}`;
      const payload = { status: status };

      await axios.put(apiEndpoint, payload);

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId ? { ...msg, status: payload.status } : msg
        )
      );

      Swal.fire({
        title: "Success!",
        text: `Message has been ${status}.`,
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          popup:
            "bg-white dark:bg-gray-800 dark:text-white border border-gray-600 rounded-lg shadow-lg",
          title: "dark:text-yellow-400 font-bold text-xl",
          htmlContainer: "dark:text-gray-300",
          confirmButton:
            "bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded",
          cancelButton:
            "bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded",
        },
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: `Failed to ${status} the message. Please try again later.`,
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          popup:
            "bg-white dark:bg-gray-800 dark:text-white border border-gray-600 rounded-lg shadow-lg",
          title: "dark:text-yellow-400 font-bold text-xl",
          htmlContainer: "dark:text-gray-300",
          confirmButton:
            "bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded",
          cancelButton:
            "bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded",
        },
      });
    }
  };

  const deleteMessage = (messageId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      customClass: {
        popup:
          "bg-white dark:bg-gray-800 dark:text-white border border-gray-600 rounded-lg shadow-lg",
        title: "dark:text-yellow-400 font-bold text-xl",
        htmlContainer: "dark:text-gray-300",
        confirmButton:
          "bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded",
        cancelButton:
          "bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `http://localhost:8080/api/v1/create-message/${messageId}`
          );
          setMessages((prevMessages) =>
            prevMessages.filter((msg) => msg.id !== messageId)
          );
          Swal.fire({
            title: "Deleted!",
            text: "Message has been deleted.",
            icon: "success",
            confirmButtonText: "OK",
            customClass: {
              popup:
                "bg-white dark:bg-gray-800 dark:text-white border border-gray-600 rounded-lg shadow-lg",
              title: "dark:text-yellow-400 font-bold text-xl",
              htmlContainer: "dark:text-gray-300",
              confirmButton:
                "bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded",
              cancelButton:
                "bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded",
            },
          });
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: "Failed to delete the message. Please try again later.",
            icon: "error",
            confirmButtonText: "OK",
            customClass: {
              popup:
                "bg-white dark:bg-gray-800 dark:text-white border border-gray-600 rounded-lg shadow-lg",
              title: "dark:text-yellow-400 font-bold text-xl",
              htmlContainer: "dark:text-gray-300",
              confirmButton:
                "bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded",
              cancelButton:
                "bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded",
            },
          });
        }
      }
    });
  };

  const editMessage = (message) => {
    setCurrentMessage(message);
    setIsEditModalOpen(true);
  };

  const saveMessage = async () => {
    try {
      const apiEndpoint = `http://localhost:8080/api/v1/create-message/${currentMessage.id}`;
      await axios.put(apiEndpoint, {
        label: currentMessage.label,
        message: currentMessage.message,
      });

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === currentMessage.id ? currentMessage : msg
        )
      );

      Swal.fire({
        title: "Success!",
        text: "Message has been updated successfully.",
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          popup:
            "bg-white dark:bg-gray-800 dark:text-white border border-gray-600 rounded-lg shadow-lg",
          title: "dark:text-yellow-400 font-bold text-xl",
          htmlContainer: "dark:text-gray-300",
          confirmButton:
            "bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded",
          cancelButton:
            "bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded",
        },
      });

      setIsEditModalOpen(false);
      setCurrentMessage(null);
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to update the message. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          popup:
            "bg-white dark:bg-gray-800 dark:text-white border border-gray-600 rounded-lg shadow-lg",
          title: "dark:text-yellow-400 font-bold text-xl",
          htmlContainer: "dark:text-gray-300",
          confirmButton:
            "bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded",
          cancelButton:
            "bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded",
        },
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentMessage((prevMessage) => ({ ...prevMessage, [name]: value }));
  };

  const getFilteredMessages = (status) =>
    messages.filter((message) => message.status === status);

  const MessageTable = ({ title, status, data }) => (
    <div className="bg-white p-6 shadow-xl rounded-xl border border-gray-300 dark:bg-dark_2">
      <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-white">
        {title}
      </h3>
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-3 px-4 text-left text-gray-700 dark:bg-dark_1 dark:text-white">
              Label
            </th>
            <th className="py-3 px-4 text-left text-gray-700 dark:bg-dark_1 dark:text-white">
              Message
            </th>
            <th className="py-3 px-4 text-center text-gray-700 dark:bg-dark_1 dark:text-white">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((message) => (
            <tr key={message.id} className="border-b">
              <td className="py-4 px-4 text-gray-700 dark:text-white">
                {message.label}
              </td>
              <td className="py-4 px-4 text-gray-700 dark:text-white">
                <pre>{message.message}</pre>
                {/* Display message with line breaks */}
              </td>
              <td className="py-4 px-4 text-center">
                {status === "pending" && (
                  <>
                    <button
                      onClick={() =>
                        updateMessageStatus(message.id, "accepted")
                      }
                      className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 mr-2"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() =>
                        updateMessageStatus(message.id, "rejected")
                      }
                      className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 mr-2"
                    >
                      Reject
                    </button>
                  </>
                )}
                {status === "accepted" && (
                  <button
                    onClick={() => updateMessageStatus(message.id, "rejected")}
                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 mr-2"
                  >
                    Reject
                  </button>
                )}
                {status === "rejected" && (
                  <button
                    onClick={() => updateMessageStatus(message.id, "accepted")}
                    className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 mr-2"
                  >
                    Accept
                  </button>
                )}
                <button
                  onClick={() => editMessage(message)}
                  className=" py-2 px-4 rounded-lg ho focus:outline-none focus:ring-2 focus:ring-blue-400 mr-2"
                >
                  <MdEdit className="text-blue-600 text-2xl" />
                </button>
                <button
                  onClick={() => deleteMessage(message.id)}
                  className=" py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-red-500"
                >
                  <MdDelete className="text-red-600 text-2xl" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <MessageTable
        title="Review Messages"
        status="pending"
        data={getFilteredMessages("pending")}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        <MessageTable
          title="Accepted Messages"
          status="accepted"
          data={getFilteredMessages("accepted")}
        />
        <MessageTable
          title="Rejected Messages"
          status="rejected"
          data={getFilteredMessages("rejected")}
        />
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96 dark:bg-dark_2">
            <h3 className="text-2xl font-semibold mb-6">Edit Message</h3>
            <label className="block mb-4">
              <span className="text-gray-700 dark:text-white">Label</span>
              <input
                type="text"
                name="label"
                value={currentMessage?.label || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-dark_3 pl-1"
              />
            </label>
            <label className="block mb-4">
              <span className="text-gray-700 dark:text-white">Message</span>
              <textarea
                name="message"
                value={currentMessage?.message || ""}
                rows={6}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-dark_3 pl-1"
              />
            </label>
            <div className="flex justify-end">
              <button
                onClick={saveMessage}
                className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 mr-2"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MsgReview;
