import React from "react";
import logo from "../assets/iconWhite.png";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50">
      {/* Logo with Rotating Border */}
      <div className="relative flex items-center justify-center">
        {/* Rotating Border */}
        <div className="absolute border-4 border-yellow-400 border-t-transparent rounded-full h-32 w-32 animate-spin"></div>

        {/* Logo */}
        <img
          src={logo} // Replace with your logo path
          alt="Logo"
          className="h-16 w-fit" // Adjust size as needed
        />
      </div>

      {/* Pulsing Loading Text */}
      {/* <span className="mt-8 text-yellow-400 text-lg font-semibold tracking-widest animate-pulse">
        Loading, Please Wait...
      </span> */}
    </div>
  );
};

export default LoadingScreen;
