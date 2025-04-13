/**
 * Utility functions for formatting dates and times in a readable way
 */

/**
 * Format a date string to a readable format
 * @param {string} dateString - The date string to format
 * @returns {string} - Formatted date string (e.g., "Jan 15, 2023")
 */
export const formatDate = (dateString) => {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};

/**
 * Format a date and time string to a readable format
 * @param {string} dateTimeString - The date and time string to format
 * @returns {string} - Formatted date and time string (e.g., "Jan 15, 2023, 2:30 PM")
 */
export const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return "N/A";

  try {
    const date = new Date(dateTimeString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  } catch (error) {
    console.error("Error formatting date and time:", error);
    return "Invalid Date";
  }
};

/**
 * Format a time string to a readable format
 * @param {string} timeString - The time string to format
 * @returns {string} - Formatted time string (e.g., "2:30 PM")
 */
export const formatTime = (timeString) => {
  if (!timeString) return "N/A";

  try {
    const date = new Date(timeString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  } catch (error) {
    console.error("Error formatting time:", error);
    return "Invalid Time";
  }
};

/**
 * Format a relative time (e.g., "2 hours ago", "3 days ago")
 * @param {string} dateTimeString - The date and time string to format
 * @returns {string} - Formatted relative time string
 */
export const formatRelativeTime = (dateTimeString) => {
  if (!dateTimeString) return "N/A";

  try {
    const date = new Date(dateTimeString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
      return "just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    } else {
      return formatDate(dateTimeString);
    }
  } catch (error) {
    console.error("Error formatting relative time:", error);
    return "Invalid Date";
  }
};
