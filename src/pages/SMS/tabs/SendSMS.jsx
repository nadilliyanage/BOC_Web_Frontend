import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import MobilePreview from "./components/MobilePreview";
import SMSForm from "./components/SMSForm";
import { jwtDecode } from "jwt-decode";

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

  // Get token from localStorage and decode it
  const token = localStorage.getItem("token");
  let user = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      user = {
        id: decoded.id,
        name: decoded.name,
        userId: decoded.userId,
      };
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.removeItem("token");
    }
  }

  const id = user ? user.id : null;
  const name = user ? user.name : null;
  const userId = user ? user.userId : null;

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
      created_by: name,
      created_by_id: id,
      creted_by_userId: userId,
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

  const combinedPhoneNumbers = [
    ...new Set([
      ...phoneNumbers
        .split(",")
        .map((num) => num.trim())
        .filter((num) => num.length > 0), // Split and clean phoneNumbers
      ...addPhoneNumbers
        .split(/[,\n]/) // Split by commas or newlines
        .map((num) => num.trim()) // Trim each number
        .filter((num) => num.length > 0), // Remove empty entries
    ]),
  ].join(","); // Join with commas

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
      created_by: name,
      created_by_id: id,
      creted_by_userId: userId,
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
      <div className="dark:bg-dark_1 flex flex-row gap-4 p-4 transition-colors duration-300">
        <SMSForm
          smsContent={smsContent}
          setSmsContent={setSmsContent}
          messageTemplates={messageTemplates}
          selectedTemplate={selectedTemplate}
          setSelectedTemplate={setSelectedTemplate}
          errorMessage={errorMessage}
          messageFile={messageFile}
          setMessageFile={setMessageFile}
          numberFile={numberFile}
          setNumberFile={setNumberFile}
          fileList={fileList}
          selectedFileName={selectedFileName}
          setSelectedFileName={setSelectedFileName}
          phoneNumbers={phoneNumbers}
          setPhoneNumbers={setPhoneNumbers}
          addPhoneNumbers={addPhoneNumbers}
          setAddPhoneNumbers={setAddPhoneNumbers}
          removeBlockedNumbers={removeBlockedNumbers}
          setRemoveBlockedNumbers={setRemoveBlockedNumbers}
          testNumber={testNumber}
          setTestNumber={setTestNumber}
          isTestModalOpen={isTestModalOpen}
          setIsTestModalOpen={setIsTestModalOpen}
          handleFileSelect={handleFileSelect}
          handleSmsContentChange={handleSmsContentChange}
          handleTemplateChange={handleTemplateChange}
          handleCloseTemplate={handleCloseTemplate}
          handleCloseList={handleCloseList}
          handleSendSMS={handleSendSMS}
          handleMessageFileUpload={handleMessageFileUpload}
          handleCloseMessageFile={handleCloseMessageFile}
          handleNumberFileUpload={handleNumberFileUpload}
          handleCloseNumberFile={handleCloseNumberFile}
          handleAddPhoneNumbersChange={handleAddPhoneNumbersChange}
          combinedPhoneNumbers={combinedPhoneNumbers}
          handleTestCampaign={handleTestCampaign}
          handleSendTestSMS={handleSendTestSMS}
        />
        <MobilePreview smsContent={smsContent} />
      </div>
    </>
  );
};

export default SendSMS;
