import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/icon.png";
import loginImg from "../assets/loginImg.png";

const LoginPage = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          userId,
          password,
        }
      );
      const user = response.data;

      // Save user details in localStorage
      localStorage.setItem("user", JSON.stringify(user));

      const userdata = JSON.parse(localStorage.getItem("user"));
      const userRole = userdata ? userdata.role : null;

      if (userRole === "USER") {
        navigate("/waiting"); // Redirect to waiting page
      } else {
        navigate("/home"); // Redirect to home page
      }
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="dark:bg-dark_2 min-h-screen flex justify-center items-center">
      <div className="absolute top-8 left-8 ">
        <img src={logo} alt="logo" className="w-16 h-12" />
      </div>

      {/* Login Form and Image */}
      <div className="flex flex-wrap justify-center items-center gap-16 bg-white dark:bg-dark_2 p-10 rounded-lg shadow-lg w-full max-w-5xl">
        {/* Form Section */}
        <div className="w-full lg:w-2/5">
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
            <div className="flex justify-between items-center mb-4">
              <div>
                <input type="checkbox" className="mr-2" />
                <span className="text-gray-600 dark:text-gray-300">
                  Remember me
                </span>
              </div>
              <a href="/forgot-password" className="text-red-500">
                Forgot Password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
            >
              Login
            </button>
          </form>
          <p className="text-center mt-4 dark:text-gray-300">
            Don’t have an account?{" "}
            <a href="/signup" className="text-red-500">
              Sign up
            </a>
          </p>
        </div>

        {/* Image Section */}
        <div className="hidden lg:flex items-center justify-center w-2/5 bg-gray-100 rounded-lg dark:bg-dark_3">
          <img
            src={loginImg}
            alt="login illustration"
            className="w-[85%] p-10"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
