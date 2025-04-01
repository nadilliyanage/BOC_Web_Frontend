import React, { useEffect, useState } from "react";
import axios from "axios";

const FinishedMessage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [groupedMessages, setGroupedMessages] = useState({});
  const [expandedCampaigns, setExpandedCampaigns] = useState({});

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          "http://localhost:8080/api/v1/send-message/finished"
        );
        if (response.data && Array.isArray(response.data)) {
          setMessages(response.data);
          groupMessagesByCampaign(response.data);
        } else {
          throw new Error("Invalid data format received from server");
        }
      } catch (err) {
        let errorMessage = "Failed to fetch messages";
        if (err.response) {
          // Server responded with a status code outside 2xx
          errorMessage = `Server error: ${err.response.status} - ${
            err.response.data?.message || err.message
          }`;
        } else if (err.request) {
          // Request was made but no response received
          errorMessage =
            "No response from server. Please check your connection.";
        } else {
          // Something happened in setting up the request
          errorMessage = err.message || "Request setup error";
        }
        setError(errorMessage);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  // Group messages by campaign name
  const groupMessagesByCampaign = (messages) => {
    const grouped = messages.reduce((acc, msg) => {
      const campaignName = msg.campaignName || "Unnamed Campaign";
      if (!acc[campaignName]) {
        acc[campaignName] = {
          created_at: msg.created_at || "No Date",
          messages: [],
        };
      }
      acc[campaignName].messages.push(msg);
      return acc;
    }, {});

    setGroupedMessages(grouped);
  };

  // Toggle visibility of messages for a campaign
  const toggleCampaign = (campaignName) => {
    setExpandedCampaigns((prev) => ({
      ...prev,
      [campaignName]: !prev[campaignName],
    }));
  };

  // Filter messages based on search term
  const filterMessages = (messages, searchTerm) => {
    return messages.filter((msg) => {
      const campaignName = msg.campaignName
        ? msg.campaignName.toLowerCase()
        : "";
      const sender = msg.sender ? msg.sender.toLowerCase() : "";
      const numbers = msg.numbers ? msg.numbers.join(", ").toLowerCase() : "";
      const message = msg.message ? msg.message.toLowerCase() : "";
      const referenceNumber = msg.referenceNumber
        ? msg.referenceNumber.toString().toLowerCase()
        : "";

      return (
        campaignName.includes(searchTerm.toLowerCase()) ||
        sender.includes(searchTerm.toLowerCase()) ||
        numbers.includes(searchTerm.toLowerCase()) ||
        message.includes(searchTerm.toLowerCase()) ||
        referenceNumber.includes(searchTerm.toLowerCase())
      );
    });
  };

  // Get filtered and grouped messages
  const getFilteredGroupedMessages = () => {
    const filtered = filterMessages(messages, searchTerm);
    const grouped = filtered.reduce((acc, msg) => {
      const campaignName = msg.campaignName || "Unnamed Campaign";
      if (!acc[campaignName]) {
        acc[campaignName] = {
          created_at: msg.created_at || "No Date",
          messages: [],
        };
      }
      acc[campaignName].messages.push(msg);
      return acc;
    }, {});

    return grouped;
  };

  if (loading) return <div className="m-2">Loading...</div>;
  if (error) return <div className="m-2 text-red-500">{error}</div>;

  const filteredGroupedMessages = getFilteredGroupedMessages();

  return (
    <div className="dark:bg-dark_2 p-6 rounded-b-md">
      <input
        type="text"
        placeholder="Search by Campaign Name, Sender, Number, Message, or Ref No"
        className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary dark:bg-dark_3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {Object.entries(filteredGroupedMessages).map(
        ([campaignName, campaignData], index) => (
          <div key={index} className="mb-6">
            <div
              className="flex justify-between items-center cursor-pointer bg-gray-100 dark:bg-dark_3 p-3 rounded-md"
              onClick={() => toggleCampaign(campaignName)}
            >
              <div>
                <h2 className="text-xl font-bold">{campaignName}</h2>
                <p className="text-sm text-gray-500">
                  Date: {campaignData.created_at}
                </p>
                <p className="text-sm text-gray-500">
                  Message Count: {campaignData.messages.length}
                </p>
              </div>
              <span className="text-lg">
                {expandedCampaigns[campaignName] ? "▲" : "▼"}
              </span>
            </div>

            {expandedCampaigns[campaignName] && (
              <table className="w-full border-collapse border border-gray-300 mt-2">
                <thead>
                  <tr className="bg-gray-100 dark:bg-dark_3">
                    <th className="border border-gray-300 px-4 py-2">
                      Reference No
                    </th>
                    <th className="border border-gray-300 px-4 py-2">Sender</th>
                    <th className="border border-gray-300 px-4 py-2">
                      Numbers
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Message
                    </th>
                    <th className="border border-gray-300 px-4 py-2">Status</th>
                    <th className="border border-gray-300 px-4 py-2">
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {campaignData.messages.map((msg, idx) => (
                    <tr key={idx} className="text-center">
                      <td className="border border-gray-300 px-4 py-2">
                        {msg.referenceNumber || "N/A"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {msg.sender}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {msg.numbers?.join(", ")}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 whitespace-pre-wrap">
                        {msg.message}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-green-500">
                        {msg.status}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {msg.created_at}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default FinishedMessage;
