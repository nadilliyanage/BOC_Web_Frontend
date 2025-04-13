import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { formatDate, formatDateTime } from "../../../utils/dateFormatter";

const PendingMessage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [groupedMessages, setGroupedMessages] = useState({});
  const [expandedCampaigns, setExpandedCampaigns] = useState({});
  const [sortBy, setSortBy] = useState("created_at"); // Default sort by created_at
  const [sortOrder, setSortOrder] = useState("desc"); // Default sort order descending

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/send-message/pending"
        );
        setMessages(response.data);
        groupMessagesByCampaign(response.data);
      } catch (err) {
        setError("Failed to fetch messages");
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
          created_at: msg.created_at || "No Date", // Use created_at instead of date
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
      [campaignName]: !prev[campaignName], // Toggle expanded state
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

      return (
        campaignName.includes(searchTerm.toLowerCase()) ||
        sender.includes(searchTerm.toLowerCase()) ||
        numbers.includes(searchTerm.toLowerCase()) ||
        message.includes(searchTerm.toLowerCase())
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
          created_at: msg.created_at || "No Date", // Use created_at instead of date
          messages: [],
        };
      }
      acc[campaignName].messages.push(msg);
      return acc;
    }, {});

    return grouped;
  };

  // Sort campaigns based on selected criteria
  const sortCampaigns = (campaigns) => {
    return Object.entries(campaigns).sort(
      ([campaignA, dataA], [campaignB, dataB]) => {
        let comparison = 0;

        switch (sortBy) {
          case "name":
            comparison = campaignA.localeCompare(campaignB);
            break;
          case "created_at":
            comparison =
              new Date(dataA.created_at) - new Date(dataB.created_at);
            break;
          case "message_count":
            comparison = dataA.messages.length - dataB.messages.length;
            break;
          default:
            comparison = 0;
        }

        return sortOrder === "asc" ? comparison : -comparison;
      }
    );
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );

  const filteredGroupedMessages = getFilteredGroupedMessages();

  return (
    <div className="dark:bg-dark_2 p-6 rounded-b-md">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Campaign Name, Sender, Number, or Message"
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary dark:bg-dark_3 transition-all duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary dark:bg-dark_3 transition-all duration-200"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="created_at">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="message_count">Sort by Message Count</option>
          </select>
          <button
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary dark:bg-dark_3 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-dark_3"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            {sortOrder === "asc" ? (
              <FaSortUp className="text-xl" />
            ) : (
              <FaSortDown className="text-xl" />
            )}
          </button>
        </div>
      </div>

      {sortCampaigns(filteredGroupedMessages).map(
        ([campaignName, campaignData], index) => (
          <div key={index} className="mb-6">
            <div
              className="flex justify-between items-center cursor-pointer bg-white dark:bg-dark_3 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700"
              onClick={() => toggleCampaign(campaignName)}
            >
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                  {campaignName}
                </h2>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                    Status: Pending
                  </span>
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
                    Messages: {campaignData.messages.length}
                  </span>
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
                    Date: {formatDate(campaignData.created_at)}
                  </span>
                </div>
              </div>
              <span className="text-gray-400 dark:text-gray-500 transition-transform duration-200">
                {expandedCampaigns[campaignName] ? (
                  <FaChevronUp size={20} />
                ) : (
                  <FaChevronDown size={20} />
                )}
              </span>
            </div>

            {expandedCampaigns[campaignName] && (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full border-collapse rounded-lg overflow-hidden shadow-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-dark_3">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Sender
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Numbers
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Message
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Created At
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Created By
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Created By User ID
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-dark_2 divide-y divide-gray-200 dark:divide-gray-700">
                    {campaignData.messages.map((msg, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-gray-50 dark:hover:bg-dark_3 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {msg.sender}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {msg.numbers.join(", ")}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white whitespace-pre-wrap max-w-md">
                          {msg.message}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            {msg.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {formatDateTime(msg.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {msg.created_by || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {msg.created_by_userId || "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default PendingMessage;
