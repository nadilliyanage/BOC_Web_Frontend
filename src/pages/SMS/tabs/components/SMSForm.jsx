import React, { useState, useEffect } from "react";
import LoadingScreen from "../../../../components/LoadingScreen";
import { Paper } from "@mui/material";
import { validateSMSLength, hasEmoji } from "../../../../utils/smsUtils";

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
  const [loading, setLoading] = useState(false);
  const [smsValidation, setSmsValidation] = useState(null);
  const [campaignName, setCampaignName] = useState("");
  const [sender, setSender] = useState("");
  const [validationErrors, setValidationErrors] = useState({
    campaignName: false,
    sender: false,
  });

  // Update validation when SMS content changes
  useEffect(() => {
    if (smsContent) {
      const validation = validateSMSLength(smsContent);
      setSmsValidation(validation);
    } else {
      setSmsValidation(null);
    }
  }, [smsContent]);

  // Validate form fields
  const validateForm = () => {
    const errors = {
      campaignName: !campaignName.trim(),
      sender: !sender.trim(),
    };
    setValidationErrors(errors);
    return !errors.campaignName && !errors.sender;
  };

  // Handle campaign name change
  const handleCampaignNameChange = (e) => {
    setCampaignName(e.target.value);
    setValidationErrors((prev) => ({ ...prev, campaignName: false }));
  };

  // Handle sender change
  const handleSenderChange = (e) => {
    setSender(e.target.value);
    setValidationErrors((prev) => ({ ...prev, sender: false }));
  };

  // Wrap your functions with loading logic
  const handleSendSMSWithLoading = async () => {
    if (!validateForm() || (smsValidation && !smsValidation.isValid)) {
      return;
    }
    setLoading(true);
    try {
      await handleSendSMS();
    } finally {
      setLoading(false);
    }
  };

  const handleTestCampaignWithLoading = async () => {
    if (!validateForm() || (smsValidation && !smsValidation.isValid)) {
      return;
    }
    setLoading(true);
    try {
      await handleTestCampaign();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={5}
      className="p-6 mb-6 dark:bg-dark_2 rounded-xl shadow-lg transition-transform hover:scale-[1.005] w-full"
    >
      <h1 className="text-lg font-bold mb-4 dark:text-white border-b-2 border-yellow-400 pb-2">
        Send SMS
      </h1>

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
            value={campaignName}
            onChange={handleCampaignNameChange}
            className={`mt-1 block w-full pl-1 border ${
              validationErrors.campaignName
                ? "border-red-500"
                : "border-gray-300"
            } rounded-md shadow-sm focus:ring-yellow-400 focus:border-yellow-400 dark:text-white dark:bg-dark_3`}
          />
          {validationErrors.campaignName && (
            <p className="text-red-500 text-sm mt-1">
              Campaign name is required
            </p>
          )}
        </div>

        {/* Sender */}
        <div>
          <label className="block text-gray-700 font-medium dark:text-white">
            Sender
          </label>
          <select
            value={sender}
            onChange={handleSenderChange}
            className={`mt-1 block w-full pl-1 border ${
              validationErrors.sender ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:ring-yellow-400 focus:border-yellow-400 dark:text-white dark:bg-dark_3`}
          >
            <option value="">Select Sender</option>
            <option value="BOC IT">BOC IT</option>
          </select>
          {validationErrors.sender && (
            <p className="text-red-500 text-sm mt-1">Sender is required</p>
          )}
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
            disabled={!!numberFile}
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
                className="text-secondary hover:text-secondary2"
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
            disabled={!!selectedFileName}
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
            <div className="mt-2 flex justify-between items-center dark:text-white">
              <span>{messageFile.name}</span>
              <button
                type="button"
                onClick={handleCloseMessageFile}
                className="text-secondary hover:text-secondary2"
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
                className="text-secondary hover:text-secondary2"
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
            maxLength="1950"
            required={true}
            value={smsContent}
            onChange={handleSmsContentChange}
            disabled={messageFile || selectedTemplate}
            className="mt-1 block w-full pl-1 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-400 focus:border-yellow-400 dark:text-white dark:bg-dark_3"
          ></textarea>
          <div className="flex justify-between items-center mt-2">
            {smsValidation && (
              <span
                className={`text-sm font-mono ${
                  smsValidation.isValid ? "text-secondary" : "text-red-500"
                }`}
              >
                {smsValidation.message}
                {hasEmoji(smsContent) && (
                  <span className="ml-1 text-yellow-500">(with emoji)</span>
                )}
              </span>
            )}
          </div>

          {/* Phone Numbers Textarea */}
          <div className="mt-4">
            <label className="block text-gray-700 font-medium dark:text-white">
              Phone Numbers
            </label>
            <textarea
              value={combinedPhoneNumbers}
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
        <div className="flex flex-row-reverse mt-4">
          <button
            type="button"
            onClick={handleSendSMSWithLoading}
            disabled={
              !campaignName.trim() ||
              !sender.trim() ||
              !smsContent ||
              (smsValidation && !smsValidation.isValid)
            }
            className={`mx-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-transform hover:scale-105 ${
              !campaignName.trim() ||
              !sender.trim() ||
              !smsContent ||
              (smsValidation && !smsValidation.isValid)
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            Send SMS
          </button>

          <button
            type="button"
            onClick={handleTestCampaignWithLoading}
            disabled={
              !campaignName.trim() ||
              !sender.trim() ||
              !smsContent ||
              (smsValidation && !smsValidation.isValid)
            }
            className={`mx-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-transform hover:scale-105 ${
              !campaignName.trim() ||
              !sender.trim() ||
              !smsContent ||
              (smsValidation && !smsValidation.isValid)
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
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
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-2 px-4 rounded mr-2 transition-transform hover:scale-105"
              >
                Cancel
              </button>
              <button
                onClick={handleSendTestSMS}
                disabled={
                  !campaignName.trim() ||
                  !sender.trim() ||
                  !smsContent ||
                  (smsValidation && !smsValidation.isValid)
                }
                className={`bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold py-2 px-4 rounded transition-transform hover:scale-105 ${
                  !campaignName.trim() ||
                  !sender.trim() ||
                  !smsContent ||
                  (smsValidation && !smsValidation.isValid)
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Send Test SMS
              </button>
            </div>
          </div>
        </div>
      )}
    </Paper>
  );
};

export default SMSForm;
