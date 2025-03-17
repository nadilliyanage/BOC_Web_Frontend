// Home.jsx
import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { MdAccessTimeFilled, MdReviews } from "react-icons/md";
import { IoTimer } from "react-icons/io5";
import { BiSolidMessageSquareError } from "react-icons/bi";
import MessageCountChart from "./Components/MessageCountChart";
import Card from "./Components/Card"; // Import the Card component

const Home = () => {
  const [userCount, setUserCount] = useState(0); // State to store the user count
  const [pendingMessageCount, setPendingMessageCount] = useState(0);
  const [scheduledMessageCount, setScheduledMessageCount] = useState(0);
  const [toReviewMessageCount, setToReviewMessageCount] = useState(0);
  const [errorMessageCount, setErrorMessageCount] = useState(0);

  // Fetch the user count from the backend API
  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/user-count"); // Replace with your backend URL
        if (!response.ok) {
          throw new Error("Failed to fetch user count");
        }
        const data = await response.json();
        setUserCount(data); // Update the state with the user count
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    };

    fetchUserCount();
  }, []); // Empty dependency array ensures this runs only once on component mount

  // Fetch the pending message count from the backend API
  useEffect(() => {
    const fetchPendingMessageCount = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/v1/send-message/pending-sms-count"
        ); // Replace with your backend URL
        if (!response.ok) {
          throw new Error("Failed to fetch pending message count");
        }
        const data = await response.json();
        setPendingMessageCount(data); // Update the state with the pending message count
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
        ); // Replace with your backend URL
        if (!response.ok) {
          throw new Error("Failed to fetch scheduled message count");
        }
        const data = await response.json();
        setScheduledMessageCount(data); // Update the state with the scheduled message count
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
        ); // Replace with your backend URL
        if (!response.ok) {
          throw new Error("Failed to fetch ToReview message count");
        }
        const data = await response.json();
        setToReviewMessageCount(data); // Update the state with the ToReview message count
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
        ); // Replace with your backend URL
        if (!response.ok) {
          throw new Error("Failed to fetch Error message count");
        }
        const data = await response.json();
        setErrorMessageCount(data); // Update the state with the ToReview message count
      } catch (error) {
        console.error("Error fetching ToReview message count:", error);
      }
    };

    fetchToReviewMessageCount();
  }, []);

  return (
    <div className="p-4 m-4 bg-primary_2 dark:bg-dark_2">
      <div className="flex flex-wrap items-center justify-center">
        {/* All Users Card */}
        {/* <Card
          title="All Users"
          count={userCount}
          icon={FaUser}
          bgColor="bg-white"
          iconColor="text-blue-600"
        /> */}
        {/* Pending SMS Card */}
        <Card
          title="Pending SMS"
          count={pendingMessageCount}
          icon={MdAccessTimeFilled}
          bgColor="bg-white"
          iconColor="text-yellow-500"
        />
        {/* Scheduled SMS Card */}
        <Card
          title="Scheduled SMS"
          count={scheduledMessageCount}
          icon={IoTimer}
          bgColor="bg-white"
          iconColor="text-green-500"
        />
        {/* Error SMS Card */}
        <Card
          title="Error SMS"
          count={errorMessageCount}
          icon={BiSolidMessageSquareError}
          bgColor="bg-white"
          iconColor="text-red-600"
        />
        {/* SMS to Review Card */}
        <Card
          title="SMS to Review"
          count={toReviewMessageCount}
          icon={MdReviews}
          bgColor="bg-white"
          iconColor="text-purple-600"
        />
      </div>
      <MessageCountChart />
    </div>
  );
};

export default Home;
