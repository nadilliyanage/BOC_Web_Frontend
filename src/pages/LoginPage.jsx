import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import logo from "../assets/icon.png";
import loginImg from "../assets/loginImg.png";
import iconWhite from "../assets/iconWhite.png";
import { FiSun, FiMoon } from "react-icons/fi";
import { Paper } from "@mui/material";

const LoginPage = ({ darkMode, toggleDarkMode }) => {
  const [userId, setUserId] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        { userId, password }
      );

      const { token } = response.data;

      // Verify and decode the token
      const decoded = jwtDecode(token);

      // Store the token
      localStorage.setItem("token", token);

      // Redirect based on verified role
      if (decoded.role === "USER") {
        navigate("/waiting");
      } else {
        navigate("/home");
      }
    } catch (err) {
      setError("Invalid credentials");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="dark:bg-dark_1 min-h-screen flex justify-center items-center">
      <Paper
        elevation={5}
        className="flex flex-wrap justify-center items-center gap-20 bg-white dark:bg-dark_2 p-10 rounded-lg shadow-lg w-full max-w-4xl"
      >
        {/* Form Section */}
        <div className="w-full lg:w-1/2">
          <div className="absolute top-8 left-8 ">
            <div className="hidden lg:block">
              <img
                src={darkMode ? iconWhite : logo}
                alt="logo"
                className="w-fit h-12"
              />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-6 dark:text-white">Login</h2>
          <p className="text-gray-500 mb-4 dark:text-gray-300">
            Login to access your account
          </p>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block dark:text-white">UserID</label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mt-1 dark:bg-dark_3 dark:text-white"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block dark:text-white">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mt-1 dark:bg-dark_3 dark:text-white"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
            >
              Login
            </button>
            <p className="text-center mt-4 dark:text-gray-300">
              Don’t have an account?{" "}
              <a href="/signup" className="text-secondary">
                Sign up
              </a>
            </p>
          </form>
        </div>

        {/* Image Section */}
        <div className="hidden lg:flex items-center justify-center w-2/5 bg-gray-100 rounded-lg dark:bg-dark_3">
          <img
            src={loginImg}
            alt="login illustration"
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

export default LoginPage;
