import React from "react";

const Card = ({ title, count, icon: Icon, bgColor, iconColor }) => {
  return (
    <div
      className={`w-1/5 h-32 bg-white shadow-lg m-4 rounded-md border  flex items-center justify-center hover:bg-secondary dark:hover:bg-secondary duration-1000 hover:transition-opacity dark:bg-dark_2`}
    >
      <div className="flex flex-row-reverse justify-center items-center">
        <div className="flex flex-col mx-6">
          <label className="font-bold text-lg">{title}</label>
          <label className="font-bold text-xl text-center">{count}</label>
        </div>
        <div
          className={`p-6 bg-white dark:bg-dark_3 rounded-full shadow-lg hover:transition-opacity hover:bg-secondary duration-1000 dark:hover:transition-opacity dark:hover:bg-secondary`}
        >
          <Icon className={`text-3xl ${iconColor}`} />
        </div>
      </div>
    </div>
  );
};

export default Card;
