import React, { useEffect, useState } from "react";
import axios from "axios";

const ScheduledMessage = () => {
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
          "http://localhost:8080/api/v1/send-message/scheduled",
          {
            timeout: 10000, // 10 seconds timeout
          }
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
          errorMessage = `Server error: ${err.response.status}`;
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
    // Initialize expanded state for all campaigns
    const initialExpandedState = Object.keys(grouped).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {});
    setExpandedCampaigns(initialExpandedState);
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
    if (!searchTerm.trim()) return messages;

    const term = searchTerm.toLowerCase();
    return messages.filter((msg) => {
      const campaignName = msg.campaignName?.toLowerCase() || "";
      const sender = msg.sender?.toLowerCase() || "";
      const numbers = msg.numbers?.join(", ").toLowerCase() || "";
      const message = msg.message?.toLowerCase() || "";

      return (
        campaignName.includes(term) ||
        sender.includes(term) ||
        numbers.includes(term) ||
        message.includes(term)
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

  const filteredGroupedMessages = getFilteredGroupedMessages();

  if (loading) {
    return (
      <div className="m-2 p-4 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
        <span className="ml-2">Loading messages...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-2 p-4 bg-red-100 dark:bg-red-900 rounded-md">
        <p className="text-red-500 dark:text-red-300 font-bold">Error:</p>
        <p className="text-red-700 dark:text-red-200">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-secondary text-white rounded-md hover:bg-opacity-80"
        >
          Retry
        </button>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="m-2 p-4 text-center">
        <p>No scheduled messages found.</p>
      </div>
    );
  }

  return (
    <div className="dark:bg-dark_2 p-6 rounded-b-md">
      <input
        type="text"
        placeholder="Search by Campaign Name, Sender, Number, or Message"
        className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary dark:bg-dark_3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {Object.keys(filteredGroupedMessages).length === 0 ? (
        <div className="text-center p-4">No messages match your search.</div>
      ) : (
        Object.entries(filteredGroupedMessages).map(
          ([campaignName, campaignData], index) => (
            <div key={index} className="mb-6">
              <div
                className="flex justify-between items-center cursor-pointer bg-gray-100 dark:bg-dark_3 p-3 rounded-md hover:bg-gray-200 dark:hover:bg-dark_4 transition-colors"
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
                <div className="overflow-x-auto mt-2">
                  <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-dark_3">
                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                          Sender
                        </th>
                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                          Numbers
                        </th>
                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                          Message
                        </th>
                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                          Status
                        </th>
                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                          Created At
                        </th>
                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                          Schedule Time
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {campaignData.messages.map((msg, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-gray-50 dark:hover:bg-dark_4"
                        >
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                            {msg.sender}
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                            {msg.numbers?.join(", ") || "N/A"}
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 whitespace-pre-wrap">
                            {msg.message}
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-green-500">
                            {msg.status}
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                            {msg.created_at}
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                            {msg.schedule || "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )
        )
      )}
    </div>
  );
};

export default ScheduledMessage;
