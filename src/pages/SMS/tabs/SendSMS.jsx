import React, { useState } from "react";

const SendSMS = () => {
  const [smsContent, setSmsContent] = useState("");

  const handleSmsContentChange = (event) => {
    setSmsContent(event.target.value);
  };

  return (
    <>
      {/* Form Section */}
      <div className="bg-white w-full md:w-11/12 shadow-md rounded-b-lg p-6 mr-0 md:mr-6 dark:bg-[#282828] ">
        <h1 className="text-lg font-bold mb-4">Send SMS</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
          {/* Campaign Name */}
          <div>
            <label className="block text-gray-700 font-medium dark:text-white">
              Campaign Name
            </label>
            <input
              type="text"
              className="mt-1 block w-full pl-1 border pl-2 border-gray-300 rounded-md shadow-sm focus:ring-yellow-400 focus:border-yellow-400 dark:text-white dark:bg-dark_3"
            />
          </div>

          {/* Sender */}
          <div>
            <label className="block text-gray-700 font-medium dark:text-white">
              Sender
            </label>
            <select className="mt-1 block w-full pl-1 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-400 focus:border-yellow-400 dark:text-white dark:bg-dark_3">
              <option>Select Sender</option>
            </select>
          </div>

          {/* Address Book */}
          <div>
            <label className="block text-gray-700 font-medium dark:text-white">
              Address Book(s)
            </label>
            <select className="mt-1 block w-full pl-1 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-400 focus:border-yellow-400 dark:text-white dark:bg-dark_3">
              <option>Select Address Book</option>
            </select>
          </div>

          {/* Schedule */}
          <div>
            <label className="block text-gray-700 font-medium dark:text-white">
              Schedule
            </label>
            <input
              type="datetime-local"
              className="mt-1 block w-full pl-1 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-400 focus:border-yellow-400 dark:text-white dark:bg-dark_3"
            />
          </div>

          {/* Number File */}
          <div>
            <label className="block text-gray-700 font-medium dark:text-white">
              Number File
            </label>
            <input
              type="file"
              className="mt-1 block w-full border border-gray-300  shadow-sm focus:ring-yellow-400 focus:border-yellow-400  dark:text-white"
            />
          </div>

          {/* Template */}
          <div>
            <label className="block text-gray-700 font-medium dark:text-white">
              Template
            </label>
            <select className="mt-1 block w-full pl-1 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-400 focus:border-yellow-400 dark:text-white dark:bg-dark_3">
              <option>Select Template</option>
            </select>
          </div>

          {/* Block Number File */}
          <div>
            <label className="block text-gray-700 font-medium dark:text-white">
              Block Number File
            </label>
            <input
              type="file"
              className="mt-1 block w-full  border border-gray-300  shadow-sm focus:ring-yellow-400 focus:border-yellow-400 dark:text-white"
            />
          </div>

          {/* Phone Numbers */}
          <div>
            <label className="block text-gray-700 font-medium dark:text-white">
              Phone Numbers
            </label>
            <input
              type="text"
              className="mt-1 block w-full pl-1 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-400 focus:border-yellow-400 dark:text-white dark:bg-dark_3"
            />
          </div>

          {/* SMS Content */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium dark:text-white">
              SMS Content
            </label>
            <textarea
              maxLength="225"
              value={smsContent}
              onChange={handleSmsContentChange}
              className="mt-1 block w-full pl-1 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-400 focus:border-yellow-400 dark:text-white dark:bg-dark_3"
            ></textarea>
            <span className="text-gray-500 text-sm">
              {smsContent.length} / 225
            </span>
          </div>

          {/* Enforce Output Toggle */}
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="enforceOutput"
              className="form-checkbox h-5 w-5 text-yellow-500 rounded focus:ring-yellow-400"
            />
            <label
              htmlFor="enforceOutput"
              className="ml-2 text-gray-700 font-medium dark:text-white"
            >
              Enforce Output
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4 mt-6">
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
            Test Campaign
          </button>
          <button className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary2">
            Send
          </button>
        </div>
      </div>

      {/* Mobile Preview Section */}
      <div className="bg-white shadow-md rounded-b-lg p-4 w-full md:w-1/2 dark:bg-[#282828]">
        <h2 className="text-gray-700 font-medium dark:text-white mb-4">
          Preview
        </h2>
        <div className="relative flex justify-center items-center bg-gray-50 border rounded-lg p-6 dark:bg-[#282828]">
          {/* Phone Mockup */}
          <div className="relative h-[30rem] w-[15rem] bg-black rounded-3xl shadow-lg overflow-hidden">
            {/* Camera Notch */}
            <div className="absolute top-0 w-full h-6 bg-gray-800 rounded-t-3xl dark:bg-[#121212]"></div>
            {/* Screen */}
            <div className="absolute inset-6 bg-white rounded-lg p-4 overflow-y-auto dark:bg-dark_1">
              <div className="flex flex-col h-full space-y-4">
                {/* Default Bubble Example */}
                {!smsContent && (
                  <div className="self-start bg-gray-200 text-gray-800 rounded-lg px-4 py-2 text-xs shadow-sm dark:bg-dark_3 dark:text-white">
                    Your SMS text will appear here...
                  </div>
                )}
                {/* Dynamic Bubble for SMS Content */}
                {smsContent && (
                  <div
                    className="self-start w-40 bg-gray-200 text-black rounded-lg px-4 py-2 text-xs shadow-sm break-words"
                    style={{ whiteSpace: "pre-wrap" }} // This allows newlines to be preserved
                  >
                    {smsContent}
                  </div>
                )}
              </div>
            </div>
            {/* Bottom Border */}
            <div className="absolute bottom-0 w-full h-6 bg-gray-800 dark:bg-[#121212] rounded-b-3xl"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SendSMS;
