import React from "react";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-10 bg-opacity-40">
      {/* Animated Sun Loader */}
      <div className="relative flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-yellow-400 shadow-lg"></div>
        <div className="absolute h-10 w-10 bg-yellow-400 rounded-full shadow-lg"></div>
      </div>

      {/* Pulsing Loading Text */}
      <span className="mt-6 text-yellow-400 text-lg font-semibold tracking-widest animate-pulse">
        Loading, Please Wait...
      </span>
    </div>
  );
};

export default LoadingScreen;
