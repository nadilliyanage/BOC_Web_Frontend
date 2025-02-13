import React, { useState } from "react";
import { FaUserCircle, FaCaretDown, FaCaretUp } from "react-icons/fa";
import { FiSun, FiMoon } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";

const DesktopMenu = ({ darkMode, toggleDarkMode }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Get user role from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user ? user.role : null;

  // Toggle dropdown visibility
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // Menu items with role-based visibility
  const menuItems = [
    { href: "/home", label: "Home", roles: ["ADMIN", "USER1", "USER2"] },
    { href: "/sms", label: "SendSMS", roles: ["ADMIN", "USER1", "USER2"] },
    {
      href: "/createMessage",
      label: "CreateMessage",
      roles: ["ADMIN", "USER1", "USER2"],
    },
    {
      href: "/contacts",
      label: "Contacts",
      roles: ["ADMIN", "USER1", "USER2"],
    },
    {
      href: "/block",
      label: "BlockNumbers",
      roles: ["ADMIN", "USER1", "USER2"],
    },
    { href: "/reports", label: "Reports", roles: ["ADMIN", "USER1"] },
    { href: "/usermanagement", label: "UserManagement", roles: ["ADMIN"] },
  ];

  // Filter menu items based on user role
  const visibleMenuItems = menuItems.filter(
    (item) => !item.roles || item.roles.includes(userRole)
  );

  // Handle sign out
  const handleSignOut = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="hidden lg:flex space-x-4 gap-5 items-center relative">
      {/* Menu Items */}
      {visibleMenuItems.map(({ href, label }) => (
        <a
          key={href}
          href={href}
          className={`text-lg font-semibold group relative ${
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
        </a>
      ))}

      {/* Profile Dropdown */}
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
            <button
              onClick={handleSignOut}
              className="block px-4 py-2 text-black hover:bg-gray-100 dark:text-white dark:hover:bg-black w-full text-left"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>

      {/* Dark Mode Toggle */}
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
  );
};

export default DesktopMenu;
