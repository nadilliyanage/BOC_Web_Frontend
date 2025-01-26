import React, { useState, useEffect } from "react";
import axios from "axios";
import MobilePreview from "./components/MobilePreview";

const SendSMS = () => {
  const [smsContent, setSmsContent] = useState("");
  const [messageTemplates, setMessageTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [messageFile, setMessageFile] = useState(null); // Added state for message file

  const handleSmsContentChange = (event) => {
    setSmsContent(event.target.value);
  };

  const handleTemplateChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedTemplate(selectedValue);
    setSmsContent(selectedValue); // Update SMS content with the selected template
    setMessageFile(null); // Clear the message file if template is selected
  };

  const handleCloseTemplate = () => {
    setSelectedTemplate(""); // Clear selected template
    setSmsContent(""); // Clear SMS content
  };

  const handleMessageFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setMessageFile(file); // Set the uploaded file
      const reader = new FileReader();
      reader.onload = (e) => {
        setSmsContent(e.target.result); // Update SMS content with file content
      };
      reader.onerror = () => {
        console.error("Error reading file");
        setErrorMessage("Failed to read the file. Please try again.");
      };
      reader.readAsText(file); // Reads file as plain text
    }
  };

  const handleCloseMessageFile = () => {
    setMessageFile(null); // Clear the message file
    setSmsContent(""); // Clear SMS content
    setSelectedTemplate(""); // Clear selected template
  };

  useEffect(() => {
    const fetchDropdownOptions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/create-message/accepted"
        );
        setMessageTemplates(response.data); // Assuming response.data is an array of templates
      } catch (error) {
        console.error("Error fetching dropdown options:", error);
        setErrorMessage("Failed to fetch dropdown options. Please try again.");
      }
    };

    fetchDropdownOptions();
  }, []);

  return (
    <>
      {/* Form Section */}
      <div className="bg-white w-full md:w-11/12 shadow-md rounded-b-lg p-6 mr-0 md:mr-6 dark:bg-[#282828]">
        <h1 className="text-lg font-bold mb-4">Send SMS</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
          {/* Campaign Name */}
          <div>
            <label className="block text-gray-700 font-medium dark:text-white">
              Campaign Name
            </label>
            <input
              type="text"
              className="mt-1 block w-full pl-1 border  border-gray-300 rounded-md shadow-sm focus:ring-yellow-400 focus:border-yellow-400 dark:text-white dark:bg-dark_3"
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
            <select
              id="messageTemplate"
              name="messageTemplate"
              value={selectedTemplate}
              onChange={handleTemplateChange}
              className="mt-1 block w-full pl-1 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-400 focus:border-yellow-400 dark:text-white dark:bg-dark_3"
              required
              disabled={messageFile || smsContent}
            >
              <option value="">Select Template</option>
              {messageTemplates.map((template) => (
                <option key={template.id} value={template.message}>
                  {template.label}
                </option>
              ))}
            </select>
            {selectedTemplate && (
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={handleCloseTemplate}
                  className="text-red-500 hover:text-red-700"
                >
                  Close Template
                </button>
              </div>
            )}
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

          {/* Message file*/}
          <div>
            <label className="block text-gray-700 font-medium dark:text-white">
              Message File
            </label>
            <input
              type="file"
              accept=".txt,.docx"
              onChange={handleMessageFileUpload}
              className="mt-1 block w-full border border-gray-300 shadow-sm focus:ring-yellow-400 focus:border-yellow-400 dark:text-white"
              disabled={selectedTemplate || smsContent}
            />
            {messageFile && (
              <div className="mt-2 flex justify-between items-center">
                <span>{messageFile.name}</span>
                <button
                  type="button"
                  onClick={handleCloseMessageFile}
                  className="text-red-500 hover:text-red-700"
                >
                  Close
                </button>
              </div>
            )}
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
              disabled={messageFile || selectedTemplate} // Disable if message file or template is selected
              className="mt-1 block w-full pl-1 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-400 focus:border-yellow-400 dark:text-white dark:bg-dark_3"
            ></textarea>
            <span className="text-gray-500 text-sm">
              {smsContent.length} / 225
            </span>
          </div>

          {/* Enforce Output Toggle */}
          <div className="flex items-center mt-1">
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
        <div className="flex justify-end space-x-4 ">
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
            Test Campaign
          </button>
          <button className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary2">
            Send
          </button>
        </div>
      </div>
      <MobilePreview smsContent={smsContent} />
      {/* Use MobilePreview component */}
    </>
  );
};

export default SendSMS;
