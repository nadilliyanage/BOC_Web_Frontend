import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { MdEdit, MdDelete } from "react-icons/md";
import SuccessAlert from "../../../components/SuccessAlert";
import ErrorAlert from "../../../components/ErrorAlert";
import ConfirmAlert from "../../../components/ConfirmAlert";

const MsgReject = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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
      ErrorAlert({
        title: "Error!",
        text: "Unable to fetch messages. Please try again later.",
        icon: "error",
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

      SuccessAlert({
        title: "Success!",
        text: `Message has been ${status}.`,
        icon: "success",
      });
    } catch (error) {
      ErrorAlert({
        title: "Error!",
        text: `Failed to ${status} the message. Please try again later.`,
        icon: "error",
      });
    }
  };

  const deleteMessage = async (messageId) => {
    ConfirmAlert({
      title: "Are you sure?",
      text: "This action cannot be undone!",
    }).then(async (isConfirmed) => {
      if (isConfirmed) {
        try {
          await axios.delete(
            `http://localhost:8080/api/v1/create-message/${messageId}`
          );
          setMessages((prevMessages) =>
            prevMessages.filter((msg) => msg.id !== messageId)
          );
          SuccessAlert({
            title: "Deleted!",
            text: "Message has been deleted.",
            icon: "success",
          });
        } catch (error) {
          ErrorAlert({
            title: "Error!",
            text: "Failed to delete the message. Please try again later.",
            icon: "error",
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

      SuccessAlert({
        title: "Success!",
        text: "Message has been updated successfully.",
        icon: "success",
      });

      setIsEditModalOpen(false);
      setCurrentMessage(null);
    } catch (error) {
      ErrorAlert({
        title: "Error!",
        text: "Failed to update the message. Please try again later.",
        icon: "error",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentMessage((prevMessage) => ({ ...prevMessage, [name]: value }));
  };

  const getFilteredMessages = () =>
    messages.filter(
      (message) =>
        message.status === "rejected" &&
        (message.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          message.message.toLowerCase().includes(searchTerm.toLowerCase()))
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
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search messages..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-dark_3 dark:text-white"
        />
      </div>
      <div className="bg-white p-6 shadow-xl rounded-xl border border-gray-300 dark:bg-dark_2">
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
            {getFilteredMessages().map((message) => (
              <tr key={message.id} className="border-b">
                <td className="py-4 px-4 text-gray-700 dark:text-white">
                  {message.label}
                </td>
                <td className="py-4 px-4 text-gray-700 dark:text-white">
                  <pre className="overflow-auto whitespace-pre-wrap break-words max-w-xs md:max-w-sm lg:max-w-md">
                    {message.message}
                  </pre>
                </td>
                <td className="py-4 px-4 text-center">
                  <button
                    onClick={() => updateMessageStatus(message.id, "accepted")}
                    className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 mr-2"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => editMessage(message)}
                    className="py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mr-2"
                  >
                    <MdEdit className="text-blue-600 text-2xl" />
                  </button>
                  <button
                    onClick={() => deleteMessage(message.id)}
                    className="py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <MdDelete className="text-red-600 text-2xl" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MsgReject;
