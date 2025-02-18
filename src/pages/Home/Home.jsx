import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { MdAccessTimeFilled, MdReviews } from "react-icons/md";
import { IoTimer } from "react-icons/io5";
import { BiSolidMessageSquareError } from "react-icons/bi";
import MessageCountChart from "./Components/MessageCountChart";

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
          "http://localhost:8080/api/v1/create-message/error-sms-count"
        ); // Replace with your backend URL
        if (!response.ok) {
          throw new Error("Failed to fetch Error message count");
        }
        const data = await response.json();
        setToReviewMessageCount(data); // Update the state with the ToReview message count
      } catch (error) {
        console.error("Error fetching ToReview message count:", error);
      }
    };

    fetchToReviewMessageCount();
  }, []);

  return (
    <div className="p-4">
      <div className="flex flex-row">
        {/* Card for All Users */}
        <div className="w-1/5 h-32 bg-white shadow-lg m-4 rounded-md border dark:bg-dark_2 dark:border-secondary flex items-center justify-center hover:bg-secondary dark:hover:bg-secondary duration-1000 hover:transition-opacity">
          <div className="flex flex-row-reverse justify-center items-center">
            <div className="flex flex-col mx-6">
              <label className="font-bold text-lg">All Users</label>
              <label className="font-bold text-xl text-center">
                {userCount}
              </label>
              {/* Display the user count */}
            </div>
            <div className="p-6 bg-white dark:bg-dark_3 rounded-full shadow-lg hover:transition-opacity hover:bg-secondary duration-1000 dark:hover:transition-opacity dark:hover:bg-secondary">
              <FaUser className="text-3xl" />
            </div>
          </div>
        </div>

        {/* Card for Pending SMS */}
        <div className="w-1/5 h-32 bg-white shadow-lg m-4 rounded-md border dark:bg-dark_2 dark:border-secondary flex items-center justify-center hover:bg-secondary dark:hover:bg-secondary duration-1000 hover:transition-opacity">
          <div className="flex flex-row-reverse justify-center items-center">
            <div className="flex flex-col mx-6">
              <label className="font-bold text-lg">Pending SMS</label>
              <label className="font-bold text-xl text-center">
                {pendingMessageCount}
              </label>
            </div>
            <div className="p-6 bg-white dark:bg-dark_3 rounded-full shadow-lg hover:transition-opacity hover:bg-secondary duration-1000 dark:hover:transition-opacity dark:hover:bg-secondary">
              <MdAccessTimeFilled className="text-4xl" />
            </div>
          </div>
        </div>

        {/* Card for Scheduled SMS */}
        <div className="w-1/5 h-32 bg-white shadow-lg m-4 rounded-md border dark:bg-dark_2 dark:border-secondary flex items-center justify-center hover:bg-secondary dark:hover:bg-secondary duration-1000 hover:transition-opacity">
          <div className="flex flex-row-reverse justify-center items-center">
            <div className="flex flex-col mx-4">
              <label className="font-bold text-lg">Scheduled SMS</label>
              <label className="font-bold text-xl text-center">
                {scheduledMessageCount}
              </label>
            </div>
            <div className="p-6 bg-white dark:bg-dark_3 rounded-full shadow-lg hover:transition-opacity hover:bg-secondary duration-1000 dark:hover:transition-opacity dark:hover:bg-secondary">
              <IoTimer className="text-4xl" />
            </div>
          </div>
        </div>

        {/* Card for Error SMS */}
        <div className="w-1/5 h-32 bg-white shadow-lg m-4 rounded-md border dark:bg-dark_2 dark:border-secondary flex items-center justify-center hover:bg-secondary dark:hover:bg-secondary duration-1000 hover:transition-opacity">
          <div className="flex flex-row-reverse justify-center items-center">
            <div className="flex flex-col mx-6">
              <label className="font-bold text-lg">Error SMS</label>
              <label className="font-bold text-xl text-center">
                {errorMessageCount}
              </label>
            </div>
            <div className="p-6 bg-white dark:bg-dark_3 rounded-full shadow-lg hover:transition-opacity hover:bg-secondary duration-1000 dark:hover:transition-opacity dark:hover:bg-secondary">
              <BiSolidMessageSquareError className="text-3xl" />
            </div>
          </div>
        </div>

        {/* Card for SMS to Review */}
        <div className="w-1/5 h-32 bg-white shadow-lg m-4 rounded-md border dark:bg-dark_2 dark:border-secondary flex items-center justify-center hover:bg-secondary dark:hover:bg-secondary duration-1000 hover:transition-opacity">
          <div className="flex flex-row-reverse justify-center items-center">
            <div className="flex flex-col mx-6">
              <label className="font-bold text-lg">SMS to Review</label>
              <label className="font-bold text-xl text-center">
                {toReviewMessageCount}
              </label>
            </div>
            <div className="p-6 bg-white dark:bg-dark_3 rounded-full shadow-lg hover:transition-opacity hover:bg-secondary duration-1000 dark:hover:transition-opacity dark:hover:bg-secondary">
              <MdReviews className="text-3xl" />
            </div>
          </div>
        </div>
      </div>
      <MessageCountChart />
    </div>
  );
};

export default Home;
