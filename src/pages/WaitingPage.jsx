import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Paper } from "@mui/material";

const WaitingPage = ({ darkMode }) => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Check user status periodically
  useEffect(() => {
    const checkApprovalStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/");
          return;
        }

        const decoded = jwtDecode(token);
        if (decoded.role !== "USER") {
          navigate("/home");
        }
      } catch (error) {
        console.error("Error checking approval status:", error);
      }
    };

    // Check immediately
    checkApprovalStatus();

    // Then check every 30 seconds
    const interval = setInterval(checkApprovalStatus, 30000);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div
      className={`min-h-screen flex justify-center items-center ${
        darkMode ? "dark:bg-dark_2" : "bg-gray-100"
      }`}
    >
      <Paper
        elevation={5}
        className={`p-10 rounded-lg shadow-lg w-full max-w-2xl text-center ${
          darkMode ? "dark:bg-dark_1" : "bg-white"
        }`}
      >
        <h2
          className={`text-3xl font-bold mb-6 ${
            darkMode ? "dark:text-white" : "text-gray-800"
          }`}
        >
          Waiting for Admin Approval
        </h2>
        <p
          className={`mb-6 ${
            darkMode ? "dark:text-gray-300" : "text-gray-600"
          }`}
        >
          Your account is pending approval. Please wait for the admin to approve
          your request.
        </p>
        <p
          className={`mb-8 text-sm ${
            darkMode ? "dark:text-gray-400" : "text-gray-500"
          }`}
        >
          This page will automatically refresh when your account is approved.
        </p>
        <button
          onClick={handleSignOut}
          className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 px-6"
        >
          Back to Login
        </button>
      </Paper>
    </div>
  );
};

export default WaitingPage;
