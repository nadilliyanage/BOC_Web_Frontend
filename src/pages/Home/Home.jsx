import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { MdAccessTimeFilled, MdReviews } from "react-icons/md";
import { IoTimer } from "react-icons/io5";
import { BiSolidMessageSquareError } from "react-icons/bi";
import MessageCountChart from "./Components/MessageCountChart";
import Card from "./Components/Card";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [userCount, setUserCount] = useState(0);
  const [pendingMessageCount, setPendingMessageCount] = useState(0);
  const [scheduledMessageCount, setScheduledMessageCount] = useState(0);
  const [toReviewMessageCount, setToReviewMessageCount] = useState(0);
  const [errorMessageCount, setErrorMessageCount] = useState(0);
  const navigate = useNavigate();

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
    const fetchToReviewMessageCount = async () => {
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
        console.error("Error fetching ToReview message count:", error);
      }
    };

    fetchToReviewMessageCount();
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

  return (
    <div className="p-4 m-4 bg-primary_2 dark:bg-dark_2">
      <div className="flex flex-wrap items-center justify-center">
        {/* Pending SMS Card */}
        <Card
          title="Pending SMS"
          count={pendingMessageCount}
          icon={MdAccessTimeFilled}
          bgColor="bg-white"
          iconColor="text-yellow-500"
          onClick={handlePendingSMS}
        />
        {/* Scheduled SMS Card */}
        <Card
          title="Scheduled SMS"
          count={scheduledMessageCount}
          icon={IoTimer}
          bgColor="bg-white"
          iconColor="text-green-500"
          onClick={handleScheduledSMS}
        />
        {/* Error SMS Card */}
        <Card
          title="Error SMS"
          count={errorMessageCount}
          icon={BiSolidMessageSquareError}
          bgColor="bg-white"
          iconColor="text-red-600"
          onClick={handleErrorSMS}
        />
        {/* SMS to Review Card */}
        <Card
          title="SMS to Review"
          count={toReviewMessageCount}
          icon={MdReviews}
          bgColor="bg-white"
          iconColor="text-purple-600"
          onClick={handleReviewSMS}
        />
      </div>
      <MessageCountChart />
    </div>
  );
};

export default Home;
