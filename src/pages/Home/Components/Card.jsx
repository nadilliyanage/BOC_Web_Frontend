import React from "react";
import { Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Card = ({ title, count, icon: Icon, iconColor, bgColor, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <motion.div
      whileHover={{
        scale: 1.03,
        boxShadow:
          "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Paper
        elevation={3}
        className={`h-40 ${bgColor} shadow-md rounded-xl flex items-center justify-between p-6 cursor-pointer overflow-hidden relative dark:bg-dark_1 dark:shadow-gray-800`}
        onClick={handleClick}
      >
        {/* Background decorative element */}
        <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-10 bg-gray-300 dark:bg-gray-600"></div>

        {/* Content */}
        <div className="flex flex-col z-10">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            {title}
          </h3>
          <div className="flex items-baseline">
            <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
              {count}
            </span>
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              messages
            </span>
          </div>
        </div>

        {/* Icon */}
        <div
          className={`p-4 rounded-full ${iconColor.replace(
            "text-",
            "bg-"
          )} bg-opacity-10 dark:bg-opacity-20`}
        >
          <Icon className={`text-3xl ${iconColor}`} />
        </div>
      </Paper>
    </motion.div>
  );
};

export default Card;
