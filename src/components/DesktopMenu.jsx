import React, { useState } from "react";
import { FaUserCircle, FaCaretDown, FaCaretUp } from "react-icons/fa";

const DesktopMenu = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Toggle dropdown visibility
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // Close dropdown when clicking outside (optional for better UX)
  const closeDropdown = () => setIsDropdownOpen(false);

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
      ].map(({ href, label }) => (
        <a
          key={href}
          href={href}
          className="text-black font-semibold text-lg hover:text-secondary group relative"
        >
          {label}
          <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-secondary transition-all duration-300 group-hover:w-full"></span>
        </a>
      ))}

      {/* Profile Icon with Click Dropdown */}
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center space-x-2 text-black hover:text-secondary focus:outline-none"
        >
          <FaUserCircle size={24} />
          <span className="font-semibold text-lg">Profile</span>
          {isDropdownOpen ? <FaCaretUp size={18} /> : <FaCaretDown size={18} />}
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div
            className="absolute right-0 mt-2 bg-white shadow-md rounded-md w-40 z-10"
            onBlur={closeDropdown}
          >
            <a
              href="/signin"
              className="block px-4 py-2 text-black hover:bg-gray-100"
            >
              Sign In
            </a>
            <a
              href="/signout"
              className="block px-4 py-2 text-black hover:bg-gray-100"
            >
              Sign Out
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default DesktopMenu;
