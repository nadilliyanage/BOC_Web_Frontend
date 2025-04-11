import React, { useEffect, useState } from "react";
import { FaUser, FaChartLine, FaBell } from "react-icons/fa";
import { MdAccessTimeFilled, MdReviews } from "react-icons/md";
import { IoTimer } from "react-icons/io5";
import { BiSolidMessageSquareError } from "react-icons/bi";
import { motion } from "framer-motion";
import MessageCountChart from "./Components/MessageCountChart";
import Card from "./Components/Card";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [userCount, setUserCount] = useState(0);
  const [pendingMessageCount, setPendingMessageCount] = useState(0);
  const [scheduledMessageCount, setScheduledMessageCount] = useState(0);
  const [toReviewMessageCount, setToReviewMessageCount] = useState(0);
  const [errorMessageCount, setErrorMessageCount] = useState(0);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  // Get user info from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserName(payload.name || "User");
      } catch (error) {
        console.error("Error parsing token:", error);
        setUserName("User");
      }
    }
  }, []);

  // Fetch the user count from the backend API
  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/user-count");
        if (!response.ok) {
          throw new Error("Failed to fetch user count");
        }
        const data = await response.json();
        setUserCount(data);
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    };

    fetchUserCount();
  }, []);

  // Fetch the pending message count from the backend API
  useEffect(() => {
    const fetchPendingMessageCount = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/v1/send-message/pending-sms-count"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch pending message count");
        }
        const data = await response.json();
        setPendingMessageCount(data);
      } catch (error) {
        console.error("Error fetching pending message count:", error);
      }
    };

    fetchPendingMessageCount();
  }, []);

  // Fetch the Scheduled message count from the backend API
  useEffect(() => {
    const fetchScheduledMessageCount = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/v1/send-message/scheduled-sms-count"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch scheduled message count");
        }
        const data = await response.json();
        setScheduledMessageCount(data);
      } catch (error) {
        console.error("Error fetching scheduled message count:", error);
      }
    };

    fetchScheduledMessageCount();
  }, []);

  // Fetch the to review message count from the backend API
  useEffect(() => {
    const fetchToReviewMessageCount = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/v1/create-message/to-review-sms-count"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch ToReview message count");
        }
        const data = await response.json();
        setToReviewMessageCount(data);
      } catch (error) {
        console.error("Error fetching ToReview message count:", error);
      }
    };

    fetchToReviewMessageCount();
  }, []);

  // Fetch the Error message count from the backend API
  useEffect(() => {
    const fetchErrorMessageCount = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/v1/send-message/error-sms-count"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch Error message count");
        }
        const data = await response.json();
        setErrorMessageCount(data);
      } catch (error) {
        console.error("Error fetching Error message count:", error);
      }
    };

    fetchErrorMessageCount();
  }, []);

  // Handler for Pending SMS card click
  const handlePendingSMS = () => {
    navigate("/reports", { state: { activeTab: "pendingMessage" } });
  };

  // Handler for Scheduled SMS card click
  const handleScheduledSMS = () => {
    navigate("/reports", { state: { activeTab: "scheduleMessage" } });
  };

  // Handler for Error SMS card click
  const handleErrorSMS = () => {
    navigate("/reports", { state: { activeTab: "errorMessage" } });
  };

  // Handler for Review Message
  const handleReviewSMS = () => {
    navigate("/createMessage", { state: { activeTab: "msgReview" } });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="p-4 m-4 bg-gradient-to-br from-primary_2 to-primary_1 dark:from-dark_2 dark:to-dark_1 rounded-xl shadow-xl">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 p-6 bg-white dark:bg-dark_1 rounded-xl shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Welcome back, <span className="text-yellow-500">{userName}</span>!
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Here's what's happening with your SMS campaigns today.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-full">
              <FaChartLine className="text-yellow-500 text-2xl" />
            </div>
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
              <FaBell className="text-blue-500 text-2xl" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {/* Pending SMS Card */}
        <motion.div variants={itemVariants}>
          <Card
            title="Pending SMS"
            count={pendingMessageCount}
            icon={MdAccessTimeFilled}
            bgColor="bg-gradient-to-br from-white to-gray-50 dark:from-dark_1 dark:to-dark_2"
            iconColor="text-yellow-500"
            onClick={handlePendingSMS}
          />
        </motion.div>

        {/* Scheduled SMS Card */}
        <motion.div variants={itemVariants}>
          <Card
            title="Scheduled SMS"
            count={scheduledMessageCount}
            icon={IoTimer}
            bgColor="bg-gradient-to-br from-white to-gray-50 dark:from-dark_1 dark:to-dark_2"
            iconColor="text-green-500"
            onClick={handleScheduledSMS}
          />
        </motion.div>

        {/* Error SMS Card */}
        <motion.div variants={itemVariants}>
          <Card
            title="Error SMS"
            count={errorMessageCount}
            icon={BiSolidMessageSquareError}
            bgColor="bg-gradient-to-br from-white to-gray-50 dark:from-dark_1 dark:to-dark_2"
            iconColor="text-red-500"
            onClick={handleErrorSMS}
          />
        </motion.div>

        {/* SMS to Review Card */}
        <motion.div variants={itemVariants}>
          <Card
            title="SMS to Review"
            count={toReviewMessageCount}
            icon={MdReviews}
            bgColor="bg-gradient-to-br from-white to-gray-50 dark:from-dark_1 dark:to-dark_2"
            iconColor="text-purple-500"
            onClick={handleReviewSMS}
          />
        </motion.div>
      </motion.div>

      {/* Chart Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="bg-white dark:bg-dark_1 rounded-xl shadow-lg p-6"
      >
        <MessageCountChart />
      </motion.div>
    </div>
  );
};

export default Home;
