import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import MobilePreview from "./components/MobilePreview";

const SendSMS = () => {
  const [smsContent, setSmsContent] = useState("");
  const [messageTemplates, setMessageTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [messageFile, setMessageFile] = useState(null);
  const [numberFile, setNumberFile] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState("");
  const [addPhoneNumbers, setAddPhoneNumbers] = useState("");
  const [removeBlockedNumbers, setRemoveBlockedNumbers] = useState(false); // Checkbox state
  const [testNumber, setTestNumber] = useState("");
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);

  // Fetch file names
  const fetchFileNames = () => {
    return axios
      .get("http://localhost:8080/api/v1/contact-list/files", {
        timeout: 5000,
      })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching file names:", error);
        throw error;
      });
  };

  // Fetch contacts by file name
  const fetchContactsByFileName = (fileName) => {
    return axios
      .get("http://localhost:8080/api/v1/contact-list/findByFileName", {
        params: { fileName },
        timeout: 5000,
      })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching contacts by file name:", error);
        throw error;
      });
  };

  // Fetch file names on component load
  useEffect(() => {
    fetchFileNames()
      .then((files) => setFileList(files))
      .catch(() => alert("Error fetching file list."));
  }, []);

  // Fetch message templates on component load
  useEffect(() => {
    const fetchDropdownOptions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/create-message/accepted"
        );
        setMessageTemplates(response.data);
      } catch (error) {
        console.error("Error fetching dropdown options:", error);
        setErrorMessage("Failed to fetch dropdown options. Please try again.");
      }
    };

    fetchDropdownOptions();
  }, []);

  // Handle file selection
  const handleFileSelect = (e) => {
    const fileName = e.target.value;
    setSelectedFileName(fileName);

    if (fileName) {
      // Clear Number File if Contact List is selected
      setNumberFile(null);
      fetchContactsByFileName(fileName)
        .then((contacts) => {
          // Extract the `number` property from each object in the array
          const numbers = contacts.map((contact) => contact.number);
          setPhoneNumbers(numbers.join(",")); // Join phone numbers with commas
        })
        .catch(() => alert("Error fetching contacts for selected file."));
    } else {
      setPhoneNumbers(""); // Clear the textarea if no file is selected
    }
  };

  // Handle SMS content change
  const handleSmsContentChange = (event) => {
    setSmsContent(event.target.value);
  };

  // Handle template change
  const handleTemplateChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedTemplate(selectedValue);
    setSmsContent(selectedValue);
    setMessageFile(null);
  };

  // Close template
  const handleCloseTemplate = () => {
    setSelectedTemplate("");
    setSmsContent("");
  };

  // Close list
  const handleCloseList = () => {
    setSelectedFileName("");
    setPhoneNumbers("");
  };

  // Handle Send SMS button click
  const handleSendSMS = async () => {
    const campaignName = document.querySelector('input[type="text"]').value;
    const sender = document.querySelector("select").value;
    const numbers = combinedPhoneNumbers
      .split(",") // Split by commas
      .map((num) => num.trim()) // Trim each number
      .filter((num) => num.length > 0); // Remove empty entries
    const message = smsContent;
    const schedule = document.querySelector(
      'input[type="datetime-local"]'
    ).value;
    const removeBlockedNumbers = document.querySelector(
      "#removeBlockedNumbers"
    ).checked; // Get checkbox value

    // Convert the datetime-local value to UTC
    const scheduleDate = schedule ? new Date(schedule).toISOString() : null;

    const sendMessageDTO = {
      campaignName,
      sender,
      numbers,
      message,
      schedule: scheduleDate, // Send the date/time in ISO format (UTC)
      removeBlockedNumbers, // Include checkbox value
    };

    try {
      await axios.post(
        "http://localhost:8080/api/v1/send-message",
        sendMessageDTO
      );

      // Show success message with SweetAlert2
      Swal.fire({
        title: "Success!",
        text: "SMS send successfully!",
        icon: "success",
        confirmButtonText: "OK",
        background: document.documentElement.classList.contains("dark")
          ? "#1f2937"
          : "#ffffff", // Dark mode background
        color: document.documentElement.classList.contains("dark")
          ? "#ffffff"
          : "#000000", // Dark mode text color
      });
    } catch (error) {
      console.error("Error saving SMS campaign:", error);

      // Show error message with SweetAlert2
      Swal.fire({
        title: "Error!",
        text: error.response?.data || "Failed to send SMS. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
        background: document.documentElement.classList.contains("dark")
          ? "#1f2937"
          : "#ffffff", // Dark mode background
        color: document.documentElement.classList.contains("dark")
          ? "#ffffff"
          : "#000000", // Dark mode text color
      });
    }
  };

  // Handle message file upload
  const handleMessageFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setMessageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setSmsContent(e.target.result);
      };
      reader.onerror = () => {
        console.error("Error reading file");
        setErrorMessage("Failed to read the file. Please try again.");
      };
      reader.readAsText(file);
    }
  };

  // Close message file
  const handleCloseMessageFile = () => {
    setMessageFile(null);
    setSmsContent("");
    setSelectedTemplate("");
  };

  // Handle number file upload
  const handleNumberFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNumberFile(file);
      setSelectedFileName(""); // Clear Contact List selection
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const numbers = content
          .split(/[,\n]/) // Split by commas or newlines
          .map((line) => line.trim()) // Trim each line
          .filter((line) => line.length > 0); // Remove empty lines
        setPhoneNumbers(numbers.join(",")); // Join numbers with commas
      };
      reader.onerror = () => {
        console.error("Error reading file");
        setErrorMessage("Failed to read the file. Please try again.");
      };
      reader.readAsText(file);
    }
  };

  // Close number file
  const handleCloseNumberFile = () => {
    setNumberFile(null);
    setPhoneNumbers("");
  };

  // Handle Add phone numbers change
  const handleAddPhoneNumbersChange = (event) => {
    const value = event.target.value;
    setAddPhoneNumbers(value);
  };

  // Combine phone numbers from contact list/number file and Add phone numbers
  const combinedPhoneNumbers = `${phoneNumbers}${
    phoneNumbers && addPhoneNumbers ? "," : ""
  }${addPhoneNumbers
    .split(/[,\n]/) // Split by commas or newlines
    .map((num) => num.trim()) // Trim each number
    .filter((num) => num.length > 0) // Remove empty entries
    .join(",")}`; // Join with commas

  // Function to handle the Test Campaign button click
  const handleTestCampaign = () => {
    setIsTestModalOpen(true);
  };

  // Function to handle sending the test SMS
  const handleSendTestSMS = async () => {
    if (!testNumber) {
      Swal.fire({
        title: "Error!",
        text: "Please enter a valid mobile number.",
        icon: "error",
        confirmButtonText: "OK",
        background: document.documentElement.classList.contains("dark")
          ? "#1f2937"
          : "#ffffff",
        color: document.documentElement.classList.contains("dark")
          ? "#ffffff"
          : "#000000",
      });
      return;
    }

    const sender = document.querySelector("select").value;
    const message = smsContent;

    const sendMessageDTO = {
      campaignName: "Test Campaign",
      sender,
      numbers: [testNumber],
      message,
      schedule: null, // No schedule for test campaign
      removeBlockedNumbers: false, // No need to remove blocked numbers for test
    };

    try {
      await axios.post(
        "http://localhost:8080/api/v1/send-message",
        sendMessageDTO
      );

      Swal.fire({
        title: "Success!",
        text: "Test SMS sent successfully!",
        icon: "success",
        confirmButtonText: "OK",
        background: document.documentElement.classList.contains("dark")
          ? "#1f2937"
          : "#ffffff",
        color: document.documentElement.classList.contains("dark")
          ? "#ffffff"
          : "#000000",
      });
      setIsTestModalOpen(false); // Close the modal after sending
    } catch (error) {
      console.error("Error sending test SMS:", error);
      Swal.fire({
        title: "Error!",
        text:
          error.response?.data || "Failed to send test SMS. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
        background: document.documentElement.classList.contains("dark")
          ? "#1f2937"
          : "#ffffff",
        color: document.documentElement.classList.contains("dark")
          ? "#ffffff"
          : "#000000",
      });
    }
  };

  return (
    <>
      {/* Form Section */}
      <div className="bg-white w-full md:w-11/12 shadow-md rounded-b-lg p-6 mr-0 md:mr-6 dark:bg-[#282828]">
        <h1 className="text-lg font-bold mb-4">Send SMS</h1>

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
              className="form-checkbox h-5 w-5 text-yellow-500 rounded focus:ring-yellow-400"
              defaultChecked
            />
            <label
              htmlFor="removeBlockedNumbers"
              className="ml-2 text-gray-700 dark:text-white"
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
              onClick={handleSendSMS}
              className="mx-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Send SMS
            </button>
            <button
              type="button"
              onClick={handleTestCampaign}
              className="mx-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendTestSMS}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
                >
                  Send Test SMS
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <MobilePreview smsContent={smsContent} />
    </>
  );
};

export default SendSMS;
