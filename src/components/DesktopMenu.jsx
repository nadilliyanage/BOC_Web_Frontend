import React, { useState } from "react";
import { FaUserCircle, FaCaretDown, FaCaretUp } from "react-icons/fa";
import { FiSun, FiMoon } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingScreen from "./LoadingScreen"; // Import the LoadingScreen component

const DesktopMenu = ({ darkMode, toggleDarkMode }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State for loading screen
  const location = useLocation();
  const navigate = useNavigate();

  // Get user details from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user ? user.role : null;
  const userName = user ? user.name : null;

  // Toggle dropdown visibility
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // Menu items with role-based visibility
  const menuItems = [
    {
      href: "/home",
      label: "Home",
      roles: ["SUPERADMIN", "ADMIN", "USER1", "USER2"],
    },
    {
      href: "/sms",
      label: "SendSMS",
      roles: ["SUPERADMIN", "ADMIN", "USER1", "USER2"],
    },
    {
      href: "/createMessage",
      label: "CreateMessage",
      roles: ["SUPERADMIN", "ADMIN", "USER1", "USER2"],
    },
    {
      href: "/contacts",
      label: "Contacts",
      roles: ["SUPERADMIN", "ADMIN", "USER1", "USER2"],
    },
    {
      href: "/block",
      label: "BlockNumbers",
      roles: ["SUPERADMIN", "ADMIN", "USER1", "USER2"],
    },
    {
      href: "/reports",
      label: "Reports",
      roles: ["SUPERADMIN", "ADMIN", "USER1"],
    },
    {
      href: "/usermanagement",
      label: "UserManagement",
      roles: ["SUPERADMIN", "ADMIN"],
    },
  ];

  // Filter menu items based on user role
  const visibleMenuItems = menuItems.filter(
    (item) => !item.roles || item.roles.includes(userRole)
  );

  // Handle navigation with loading screen
  const handleNavigation = (href) => {
    setIsLoading(true); // Show loading screen
    navigate(href);
    setTimeout(() => {
      setIsLoading(false); // Hide loading screen after a delay (simulate loading time)
    }, 1000); // Adjust the delay as needed
  };

  // Handle sign out
  const handleSignOut = () => {
    setIsLoading(true); // Show loading screen
    localStorage.removeItem("user");
    setTimeout(() => {
      setIsLoading(false); // Hide loading screen
      navigate("/login");
    }, 1000); // Adjust the delay as needed
  };

  // Handle sign in
  const handleSignIn = () => {
    setIsLoading(true); // Show loading screen
    setTimeout(() => {
      setIsLoading(false); // Hide loading screen
      navigate("/login");
    }, 1000); // Adjust the delay as needed
  };

  return (
    <>
      {/* Show loading screen if isLoading is true */}
      {isLoading && <LoadingScreen />}

      <div className="hidden lg:flex space-x-4 gap-5 items-center relative">
        {/* Menu Items */}
        {visibleMenuItems.map(({ href, label }) => (
          <button
            key={href}
            onClick={() => handleNavigation(href)}
            className={`text-lg font-semibold group relative transition-colors duration-300 ${
              location.pathname === href
                ? "text-secondary dark:text-secondary"
                : "text-black dark:text-white hover:text-secondary dark:hover:text-secondary"
            }`}
          >
            {label}
            <span
              className={`absolute bottom-0 left-0 h-[3px] bg-secondary transition-all duration-300 ${
                location.pathname === href ? "w-full" : "w-0 group-hover:w-full"
              }`}
            ></span>
          </button>
        ))}

        {/* Profile Dropdown or Sign In Button */}
        {user ? (
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-2 text-black hover:text-secondary focus:outline-none dark:text-white dark:hover:text-secondary transition-colors duration-300"
            >
              <FaUserCircle size={24} />
              <span className="font-semibold text-lg">{userName}</span>
              {isDropdownOpen ? (
                <FaCaretUp size={18} />
              ) : (
                <FaCaretDown size={18} />
              )}
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white shadow-md rounded-md w-40 z-10 dark:bg-gray-800 transition-colors duration-300">
                <button
                  onClick={handleSignOut}
                  className="block px-4 py-2 text-black hover:bg-gray-100 dark:text-white dark:hover:bg-black w-full text-left transition-colors duration-300"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={handleSignIn}
            className="flex items-center space-x-2 text-black hover:text-secondary focus:outline-none dark:text-white dark:hover:text-secondary transition-colors duration-300"
          >
            <FaUserCircle size={24} />
            <span className="font-semibold text-lg">Sign In</span>
          </button>
        )}

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition duration-300"
        >
          {darkMode ? (
            <FiMoon className="text-yellow-400 w-6 h-6 transition-colors duration-300" />
          ) : (
            <FiSun className="text-yellow-500 w-6 h-6 transition-colors duration-300" />
          )}
        </button>
      </div>
    </>
  );
};

export default DesktopMenu;
