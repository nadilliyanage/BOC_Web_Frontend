import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import DesktopMenu from "./components/DesktopMenu";
import RouterComponent from "./routes/router";
import logo from "./assets/icon.png";
import iconWhite from "./assets/iconWhite.png";
import { GiHamburgerMenu } from "react-icons/gi";
import { Paper } from "@mui/material";

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation(); // Use the useLocation hook to get the current route

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");

    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Toggle mobile menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Check if the current route is the login page
  const isLoginPageOrSignUpPage =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="font-sans">
      {/* Navbar - Conditionally render based on route */}
      {!isLoginPageOrSignUpPage && (
        <Paper elevation={5}>
          <nav className="bg-primary_1 dark:bg-dark_1 p-4 shadow-sm">
            <div className="flex justify-between items-center">
              {/* Logo (changes based on dark mode) */}
              <div className="hidden lg:block">
                <img
                  src={darkMode ? iconWhite : logo}
                  alt="logo"
                  className="w-fit h-12"
                />
              </div>

              {/* Hamburger Icon for Mobile */}
              <button className="text-white lg:hidden" onClick={toggleMenu}>
                <GiHamburgerMenu />
              </button>

              {/* Desktop Menu - Pass darkMode & toggleDarkMode */}
              <DesktopMenu
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
              />
            </div>
          </nav>
        </Paper>
      )}

      {/* Mobile Menu */}
      {!isLoginPageOrSignUpPage && (
        <div
          className={`lg:hidden fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 ${
            isMenuOpen ? "block" : "hidden"
          }`}
          onClick={toggleMenu}
        >
          <div className="absolute top-0 left-0 bg-white dark:bg-gray-800 text-black dark:text-white w-64 h-full p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="text-2xl">BOC SMS Web</div>
              <button onClick={toggleMenu} className="text-gray-600">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <ul>
              <li>
                <a href="/home" className="block py-2">
                  Home
                </a>
              </li>
              <li>
                <a href="/inbox" className="block py-2">
                  Inbox
                </a>
              </li>
              <li>
                <a href="/contact" className="block py-2">
                  Contact
                </a>
              </li>
              <li>
                <a href="/reports" className="block py-2">
                  Reports
                </a>
              </li>
              <li>
                <a href="/sms" className="block py-2">
                  SMS
                </a>
              </li>
              <li>
                <a href="/block" className="block py-2">
                  Block Number
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Routing to different pages */}
      <RouterComponent darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
