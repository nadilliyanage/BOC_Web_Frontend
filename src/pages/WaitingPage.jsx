import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/icon.png";

const WaitingPage = () => {
  const navigate = useNavigate();

  // Redirect to home if the user is approved
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role !== "USER") {
      navigate("/home");
    }
  }, [navigate]);

  return (
    <div className="dark:bg-dark_2 min-h-screen flex justify-center items-center">
      <div className="bg-white dark:bg-dark_1 p-10 rounded-lg shadow-lg w-full max-w-2xl text-center">
        <h2 className="text-3xl font-bold mb-6 dark:text-white">
          Waiting for Admin Approval
        </h2>
        <p className="text-gray-500 mb-4 dark:text-gray-300">
          Your account is pending approval. Please wait for the admin to approve
          your request.
        </p>
        <button
          onClick={handleSignOut}
          className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default WaitingPage;
