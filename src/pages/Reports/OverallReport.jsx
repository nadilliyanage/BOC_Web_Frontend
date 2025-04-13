import React, { useEffect, useState } from "react";
import { FaChartLine, FaBell } from "react-icons/fa";
import { MdAccessTimeFilled, MdReviews } from "react-icons/md";
import { IoTimer } from "react-icons/io5";
import { BiSolidMessageSquareError } from "react-icons/bi";
import { motion } from "framer-motion";
import AllMessageCountChart from "./Components/AllMessageCountChart";
import Card from "../Home/Components/Card";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const OverallReport = () => {
  const [pendingMessageCount, setPendingMessageCount] = useState(0);
  const [scheduledMessageCount, setScheduledMessageCount] = useState(0);
  const [errorMessageCount, setErrorMessageCount] = useState(0);
  const [finishedMessageCount, setFinishedMessageCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  // Get user ID from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  // Fetch message counts
  useEffect(() => {
    const fetchMessageCounts = async () => {
      try {
        setLoading(true);
        const [pendingRes, scheduledRes, errorRes, finishedRes] =
          await Promise.all([
            axios.get("http://localhost:8080/api/v1/send-message/pending"),
            axios.get("http://localhost:8080/api/v1/send-message/scheduled"),
            axios.get("http://localhost:8080/api/v1/send-message/error"),
            axios.get("http://localhost:8080/api/v1/send-message/finished"),
          ]);

        setPendingMessageCount(pendingRes.data.length);
        setScheduledMessageCount(scheduledRes.data.length);
        setErrorMessageCount(errorRes.data.length);
        setFinishedMessageCount(finishedRes.data.length);
        setError(null);
      } catch (err) {
        console.error("Error fetching message counts:", err);
        setError("Failed to load message statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchMessageCounts();
  }, []);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}

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
          />
        </motion.div>

        {/* Finished SMS Card */}
        <motion.div variants={itemVariants}>
          <Card
            title="Finished SMS"
            count={finishedMessageCount}
            icon={MdReviews}
            bgColor="bg-gradient-to-br from-white to-gray-50 dark:from-dark_1 dark:to-dark_2"
            iconColor="text-purple-500"
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
        <AllMessageCountChart />
      </motion.div>
    </div>
  );
};

export default OverallReport;
