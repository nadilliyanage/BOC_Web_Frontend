import React, { useState } from "react";
import LoadingScreen from "../../../../components/LoadingScreen";

const SMSForm = ({
  smsContent,
  messageTemplates,
  selectedTemplate,
  errorMessage,
  messageFile,
  numberFile,
  fileList,
  selectedFileName,
  addPhoneNumbers,
  testNumber,
  setTestNumber,
  isTestModalOpen,
  setIsTestModalOpen,
  handleFileSelect,
  handleSmsContentChange,
  handleTemplateChange,
  handleCloseTemplate,
  handleCloseList,
  handleSendSMS,
  handleMessageFileUpload,
  handleCloseMessageFile,
  handleNumberFileUpload,
  handleCloseNumberFile,
  handleAddPhoneNumbersChange,
  combinedPhoneNumbers,
  handleTestCampaign,
  handleSendTestSMS,
}) => {
  const [loading, setLoading] = useState(false); // Add loading state

  // Wrap your functions with loading logic
  const handleSendSMSWithLoading = async () => {
    setLoading(true);
    try {
      await handleSendSMS();
    } finally {
      setLoading(false);
    }
  };

  const handleTestCampaignWithLoading = async () => {
    setLoading(true);
    try {
      await handleTestCampaign();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white w-full md:w-11/12 shadow-md rounded-b-lg p-6 mr-0 md:mr-6 dark:bg-[#282828]">
      <h1 className="text-lg font-bold mb-4">Send SMS</h1>

      {/* Loading Screen */}
      {loading && <LoadingScreen />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Campaign Name */}
        <div>
          <label className="block text-gray-700 font-medium dark:text-white">
            Campaign Name
          </label>
          <input
            placeholder="Enter Campaign Name"
            type="text"
            className="mt-1 block w-full pl-1 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-400 focus:border-yellow-400 dark:text-white dark:bg-dark_3"
          />
        </div>

        {/* Sender */}
        <div>
          <label className="block text-gray-700 font-medium dark:text-white">
            Sender
          </label>
          <select className="mt-1 block w-full pl-1 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-400 focus:border-yellow-400 dark:text-white dark:bg-dark_3">
            <option>Select Sender</option>
            <option value={"BOC IT"}>BOC IT</option>
          </select>
        </div>

        {/* Contact List Dropdown */}
        <div>
          <label className="block text-gray-700 font-medium dark:text-white">
            Contact List
          </label>
          <select
            value={selectedFileName}
            onChange={handleFileSelect}
            className="mt-1 block w-full pl-1 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-400 focus:border-yellow-400 dark:text-white dark:bg-dark_3"
            disabled={!!numberFile} // Disable if Number File is uploaded
          >
            <option value="">Select Contact List</option>
            {fileList.map((fileName, index) => (
              <option key={index} value={fileName}>
                {fileName}
              </option>
            ))}
          </select>
          {selectedFileName && (
            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={handleCloseList}
                className="text-red-500 hover:text-red-700"
              >
                Close List
              </button>
            </div>
          )}
        </div>

        {/* Number File */}
        <div>
          <label className="block text-gray-700 font-medium dark:text-white">
            Number File
          </label>
          <input
            type="file"
            onChange={handleNumberFileUpload}
            className="mt-1 block w-full border border-gray-300 shadow-sm focus:ring-yellow-400 focus:border-yellow-400 dark:text-white"
            disabled={!!selectedFileName} // Disable if Contact List is selected
          />
          {numberFile && (
            <div className="mt-2 flex justify-between items-center">
              <span>{numberFile.name}</span>
              <button
                type="button"
                onClick={handleCloseNumberFile}
                className="text-red-500 hover:text-red-700"
              >
                Close
              </button>
            </div>
          )}
        </div>

        {/* Message File */}
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

        {/* Add Phone Numbers */}
        <div>
          <label className="block text-gray-700 font-medium dark:text-white">
            Add Phone Numbers
          </label>
          <textarea
            value={addPhoneNumbers}
            onChange={handleAddPhoneNumbersChange}
            placeholder="Enter multiple phone numbers, separated by commas or newlines"
            className="mt-1 block w-full pl-1 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-400 focus:border-yellow-400 dark:text-white dark:bg-dark_3"
            rows="2"
          />
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

        {/* SMS Content */}
        <div className="md:col-span-2">
          <label className="block text-gray-700 font-medium dark:text-white">
            SMS Content
          </label>
          <textarea
            maxLength="225"
            value={smsContent}
            onChange={handleSmsContentChange}
            disabled={messageFile || selectedTemplate}
            className="mt-1 block w-full pl-1 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-400 focus:border-yellow-400 dark:text-white dark:bg-dark_3"
          ></textarea>
          <span className="text-gray-500 text-sm">
            {smsContent.length} / 225
          </span>

          {/* Phone Numbers Textarea */}
          <div className="mt-4">
            <label className="block text-gray-700 font-medium dark:text-white">
              Phone Numbers
            </label>
            <textarea
              value={combinedPhoneNumbers} // Display combined phone numbers
              readOnly
              className="mt-1 block w-full pl-1 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-400 focus:border-yellow-400 dark:text-white dark:bg-dark_3 overflow-x-auto whitespace-nowrap"
              rows="2"
            ></textarea>
          </div>
        </div>

        <div className="flex items-center mt-1">
          <input
            type="checkbox"
            id="removeBlockedNumbers"
            className="form-checkbox h-5 w-5 text-yellow-500 rounded focus:ring-yellow-400 ml-4"
            defaultChecked
          />
          <label
            htmlFor="removeBlockedNumbers"
            className="ml-2 text-gray-700 dark:text-white font-bold"
          >
            Add blocked list
          </label>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="text-red-500 text-center mt-4">{errorMessage}</div>
        )}

        {/* Submit Button */}
        <div className="flex flex-row-reverse mt-4 ">
          <button
            type="button"
            onClick={handleSendSMSWithLoading} // Use the wrapped function
            className="mx-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Send SMS
          </button>
          <button
            type="button"
            onClick={handleTestCampaignWithLoading} // Use the wrapped function
            className="mx-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Test Campaign
          </button>
        </div>
      </div>
      {isTestModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#282828] p-6 rounded-lg shadow-lg w-11/12 md:w-1/3">
            <h2 className="text-lg font-bold mb-4 dark:text-white">
              Enter Test Mobile Number
            </h2>
            <input
              type="text"
              value={testNumber}
              onChange={(e) => setTestNumber(e.target.value)}
              placeholder="Enter mobile number"
              className="mt-1 block w-full pl-1 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-400 focus:border-yellow-400 dark:text-white dark:bg-dark_3"
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsTestModalOpen(false)}
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSendTestSMS}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold py-2 px-4 rounded"
              >
                Send Test SMS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SMSForm;
