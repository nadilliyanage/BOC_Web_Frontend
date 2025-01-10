import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import RouterComponent from "./routes/router";
import logo from "./assets/icon.png";
import { GiHamburgerMenu } from "react-icons/gi";
import DesktopMenu from "./components/DesktopMenu";

// App component that contains the header and the router for navigation
const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Toggle the menu for mobile view
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <Router>
      <div className="font-sans">
        {/* Navbar */}
        <nav className="bg-primary_2 p-4 shadow-lg">
          <div className="flex justify-between items-center">
            <div className="hidden lg:block">
              <img src={logo} alt="logo" className="w-[8%] " />
            </div>

            {/* Hamburger Icon for Mobile */}
            <button className="text-white lg:hidden" onClick={toggleMenu}>
              <GiHamburgerMenu />
            </button>

            {/* Desktop Menu */}
            <DesktopMenu />
          </div>
        </nav>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 ${
            isMenuOpen ? "block" : "hidden"
          }`}
          onClick={toggleMenu}
        >
          <div className="absolute top-0 left-0 bg-white w-64 h-full p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="text-2xl">MyApp</div>
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

        {/* Main Content */}
        {/* <main className="p-4">
          <h1 className="text-3xl">Welcome to the App</h1>
          <p>
            This is a simple mobile-responsive navigation layout with Tailwind
            CSS.
          </p>
        </main> */}

        {/* Routing to different pages */}
        <RouterComponent />
      </div>
    </Router>
  );
};

export default App;
