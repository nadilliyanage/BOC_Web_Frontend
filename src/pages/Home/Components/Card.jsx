import React from "react";

const card = (text) => {
  return (
    <div className="w-1/5 h-32 bg-white shadow-lg m-4 rounded-md border dark:bg-dark_2 dark:border-secondary flex items-center justify-center hover:bg-secondary dark:hover:bg-secondary duration-1000 hover:transition-opacity">
      <div className="flex flex-row-reverse justify-center items-center">
        <div className="flex flex-col mx-6">
          <label className="font-bold text-lg">{text}</label>
          <label className="font-bold text-xl text-center">{count}</label>{" "}
          {/* Display the user count */}
        </div>
        <div className="p-6 bg-white dark:bg-dark_3 rounded-full shadow-lg hover:transition-opacity hover:bg-secondary duration-1000 dark:hover:transition-opacity dark:hover:bg-secondary">
          <FaUser className="text-3xl" />
        </div>
      </div>
    </div>
  );
};

export default card;
