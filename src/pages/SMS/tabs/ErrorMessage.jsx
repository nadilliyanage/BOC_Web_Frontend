import React, { useEffect, useState } from "react";
import axios from "axios";

const ErrorMessage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/send-message/error"
        );
        setMessages(response.data);
      } catch (err) {
        setError("Failed to fetch error messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const filteredMessages = messages.filter((msg) => {
    const campaignName = msg.campaignName ? msg.campaignName.toLowerCase() : "";
    const sender = msg.sender ? msg.sender.toLowerCase() : "";
    const numbers = msg.numbers ? msg.numbers.join(", ") : "";
    const message = msg.message ? msg.message.toLowerCase() : "";

    return (
      campaignName.includes(searchTerm.toLowerCase()) ||
      sender.includes(searchTerm.toLowerCase()) ||
      numbers.includes(searchTerm) ||
      message.includes(searchTerm.toLowerCase())
    );
  });

  if (loading) return <div className="m-2">Loading...</div>;
  if (error) return <div className="m-2 text-red-500">{error}</div>;

  return (
    <div className="w-[200%] dark:bg-dark_2 p-6 rounded-b-md">
      <input
        type="text"
        placeholder="Search by Campaign Name, Sender, Number, or Message"
        className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary dark:bg-dark_3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100 dark:bg-dark_3">
            <th className="border border-gray-300 px-4 py-2">Campaign Name</th>
            <th className="border border-gray-300 px-4 py-2">Sender</th>
            <th className="border border-gray-300 px-4 py-2">Numbers</th>
            <th className="border border-gray-300 px-4 py-2">Message</th>
            <th className="border border-gray-300 px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredMessages.map((msg, index) => (
            <tr key={index} className="text-center">
              <td className="border border-gray-300 px-4 py-2">
                {msg.campaignName}
              </td>
              <td className="border border-gray-300 px-4 py-2">{msg.sender}</td>
              <td className="border border-gray-300 px-4 py-2">
                {msg.numbers.join(", ")}
              </td>
              <td className="border border-gray-300 px-4 py-2 whitespace-pre-wrap">
                {msg.message}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-red-500">
                {msg.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ErrorMessage;
