import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/icon.png";
import iconWhite from "../assets/iconWhite.png";
import signupImg from "../assets/signupImg.jpg";
import { Paper } from "@mui/material";
import { FiSun, FiMoon } from "react-icons/fi";

const SignUpPage = ({ darkMode, toggleDarkMode }) => {
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/signup",
        {
          userId,
          password,
          name,
          department,
        }
      );

      if (response.status === 200) {
        navigate("/login"); // Redirect to login page after successful sign-up
      }
    } catch (err) {
      setError("Invalid UserID or user already exists");
    }
  };

  return (
    <div className="dark:bg-dark_1 min-h-screen flex justify-center items-center">
      <div className="absolute top-8 left-8">
        <div className="hidden lg:block">
          <img
            src={darkMode ? iconWhite : logo}
            alt="logo"
            className="w-fit h-12"
          />
        </div>
      </div>

      {/* Sign-Up Form and Image */}
      <Paper
        elevation={5}
        className="flex flex-wrap justify-center items-center gap-16 bg-white dark:bg-dark_2 p-8 rounded-lg shadow-lg w-full max-w-5xl"
      >
        {/* Form Section */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-3xl font-bold mb-6 dark:text-white">Sign Up</h2>
          <p className="text-gray-500 mb-4 dark:text-gray-300">
            Create a new account
          </p>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSignUp}>
            <div className="mb-4">
              <label className="block dark:text-white">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mt-1 dark:bg-dark_3 dark:text-white dark:border-gray-600"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block dark:text-white">UserID</label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mt-1 dark:bg-dark_3 dark:text-white dark:border-gray-600"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block dark:text-white">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mt-1 dark:bg-dark_3 dark:text-white dark:border-gray-600"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block dark:text-white">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mt-1 dark:bg-dark_3 dark:text-white dark:border-gray-600"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition-colors duration-300"
            >
              Sign Up
            </button>
          </form>
          <p className="text-center mt-4 dark:text-gray-300">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-secondary hover:text-secondary2 transition-colors duration-300"
            >
              Login
            </a>
          </p>
        </div>

        {/* Image Section */}
        <div className="hidden lg:flex items-center justify-center w-2/5 bg-gray-100 rounded-lg dark:bg-dark_3">
          <img
            src={signupImg}
            alt="sign-up illustration"
            className="w-[100%] rounded-lg"
          />
        </div>
      </Paper>

      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="fixed bottom-8 right-8 flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition duration-300"
      >
        {darkMode ? (
          <FiMoon className="text-yellow-400 w-6 h-6" />
        ) : (
          <FiSun className="text-yellow-500 w-6 h-6" />
        )}
      </button>
    </div>
  );
};

export default SignUpPage;
