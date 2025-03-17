import React from "react";
import { Paper } from "@mui/material";

const Card = ({ title, count, icon: Icon, iconColor }) => {
  return (
    <Paper
      elevation={5}
      className={`w-1/5 h-32 bg-white shadow-lg m-4 rounded-md   flex items-center justify-center  dark:bg-dark_1 transition-transform hover:scale-105`}
    >
      <div className="flex flex-row-reverse justify-center items-center">
        <div className="flex flex-col mx-6">
          <label className="font-bold text-lg dark:text-white">{title}</label>
          <label className="font-bold text-xl text-center dark:text-white">
            {count}
          </label>
        </div>
        <div
          className={`p-6 bg-white dark:bg-dark_3 rounded-full shadow-lg hover:transition-opacity `}
        >
          <Icon className={`text-3xl ${iconColor}`} />
        </div>
      </div>
    </Paper>
  );
};

export default Card;
