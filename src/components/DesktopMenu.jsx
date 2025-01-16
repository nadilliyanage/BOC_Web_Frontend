import React, { useState, useEffect } from "react";
import { FaUserCircle, FaCaretDown, FaCaretUp } from "react-icons/fa";
import { FiSun, FiMoon } from "react-icons/fi"; // Import sun and moon icons
import { useLocation } from "react-router-dom";

const DesktopMenu = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();

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

  // Toggle dropdown visibility
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // Toggle dark mode
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

  return (
    <div className="hidden lg:flex space-x-4 gap-5 items-center relative">
      {/* Navigation Links */}
      {[
        { href: "/home", label: "Home" },
        { href: "/inbox", label: "Inbox" },
        { href: "/contact", label: "Contact" },
        { href: "/reports", label: "Reports" },
        { href: "/sms", label: "SMS" },
        { href: "/block", label: "BlockNumbers" },
        { href: "/usermanagement", label: "UserManagemnt" },
      ].map(({ href, label }) => (
        <a
          key={href}
          href={href}
          className={`text-lg font-semibold group relative ${
            location.pathname === href
              ? "text-secondary dark:text-secondary" // Active tab color
              : "text-black dark:text-white hover:text-secondary dark:hover:text-secondary"
          }`}
        >
          {label}
          <span
            className={`absolute bottom-0 left-0 h-[3px] bg-secondary transition-all duration-300 ${
              location.pathname === href ? "w-full" : "w-0 group-hover:w-full"
            }`}
          ></span>
        </a>
      ))}

      {/* Profile Icon with Dropdown */}
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center space-x-2 text-black hover:text-secondary focus:outline-none dark:text-white dark:hover:text-secondary"
        >
          <FaUserCircle size={24} />
          <span className="font-semibold text-lg">Profile</span>
          {isDropdownOpen ? <FaCaretUp size={18} /> : <FaCaretDown size={18} />}
        </button>
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 bg-white shadow-md rounded-md w-40 z-10 dark:bg-gray-800">
            <a
              href="/signout"
              className="block px-4 py-2 text-black hover:bg-gray-100 dark:text-white dark:hover:bg-black"
            >
              Sign Out
            </a>
          </div>
        )}
      </div>

      {/* Dark Mode Toggle */}
      <div className="flex items-center space-x-2">
        <button
          onClick={toggleDarkMode}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition duration-300"
        >
          {darkMode ? (
            <FiMoon className="text-yellow-400 w-6 h-6" />
          ) : (
            <FiSun className="text-yellow-500 w-6 h-6" />
          )}
        </button>
      </div>
    </div>
  );
};

export default DesktopMenu;
