import React, { useState, useEffect } from "react";
import axios from "axios";
import SuccessAlert from "../../../components/SuccessAlert";
import ErrorAlert from "../../../components/ErrorAlert";
import WarningAlert from "../../../components/WarningAlert";
import ConfirmAlert from "../../../components/ConfirmAlert";
import MobilePreview from "./components/MobilePreview";
import LoadingScreen from "../../../components/LoadingScreen";
import { jwtDecode } from "jwt-decode";
import { FaSave, FaTag, FaSms, FaSpinner } from "react-icons/fa";
import { validateSMSLength, hasEmoji } from "../../../utils/smsUtils";

const MsgCreate = () => {
  const [smsContent, setSmsContent] = useState("");
  const [messageLabel, setMessageLabel] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [smsValidation, setSmsValidation] = useState(null);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to create messages");
      return;
    }
  }, []);

  // Update validation when SMS content changes
  useEffect(() => {
    if (smsContent) {
      const validation = validateSMSLength(smsContent);
      setSmsValidation(validation);
    } else {
      setSmsValidation(null);
    }
  }, [smsContent]);

  const handleSmsContentChange = (event) => {
    try {
      setSmsContent(event.target.value);
    } catch (err) {
      console.error("Error updating SMS content:", err);
      setError("Error updating message content");
    }
  };

  const handleMessageLabelChange = (event) => {
    try {
      setMessageLabel(event.target.value);
    } catch (err) {
      console.error("Error updating message label:", err);
      setError("Error updating message label");
    }
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
      setError("Invalid session. Please log in again.");
    }
  }

  const id = user ? user.id : null;
  const name = user ? user.name : null;
  const userId = user ? user.userId : null;

  const handleSave = async () => {
    if (!messageLabel.trim() || !smsContent.trim()) {
      WarningAlert({
        title: "Validation Error",
        text: "Both Message Label and SMS Content are required.",
      });
      return;
    }

    if (smsValidation && !smsValidation.isValid) {
      WarningAlert({
        title: "Message Too Long",
        text: "Your message exceeds the maximum length of 1950 characters.",
      });
      return;
    }

    const isConfirmed = await ConfirmAlert({
      title: "Are you sure?",
      text: "Do you want to save this message?",
    });

    if (!isConfirmed) return;

    setIsSubmitting(true);
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/create-message",
        {
          label: messageLabel,
          message: smsContent,
          created_by: name,
          created_by_id: id,
          created_by_userId: userId,
        }
      );

      if (response.status === 200) {
        SuccessAlert({
          title: "Message Saved",
          text: "Your message has been saved successfully!",
        });
        setMessageLabel("");
        setSmsContent("");
      } else {
        ErrorAlert({
          title: "Save Failed",
          text: "Failed to save the message. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error saving message:", error);
      ErrorAlert({
        title: "Error",
        text: "An error occurred while saving the message.",
      });
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg">
          <p className="text-lg font-medium text-red-600 dark:text-red-200">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {isLoading && <LoadingScreen />}
      <div className="bg-white w-full md:w-11/12 shadow-lg rounded-lg p-6 mr-0 md:mr-6 dark:bg-[#282828]">
        <div className="flex items-center mb-6">
          <FaSms className="text-3xl text-yellow-500 mr-3" />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Create Message
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Message Label */}
          <div className="space-y-2">
            <label className="flex items-center text-gray-700 font-medium dark:text-white">
              <FaTag className="text-yellow-500 mr-2" />
              Message Label
            </label>
            <input
              type="text"
              value={messageLabel}
              onChange={handleMessageLabelChange}
              placeholder="Enter a label for your message"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent dark:bg-dark_3 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 transition-colors duration-200"
            />
          </div>

          {/* SMS Content */}
          <div className="md:col-span-2 space-y-2">
            <label className="flex items-center text-gray-700 font-medium dark:text-white">
              <FaSms className="text-yellow-500 mr-2" />
              SMS Content
            </label>
            <div className="relative">
              <textarea
                rows={8}
                maxLength="1950"
                value={smsContent}
                onChange={handleSmsContentChange}
                placeholder="Enter your message content..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent dark:bg-dark_3 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 transition-colors duration-200 resize-none"
              ></textarea>
              <div className="absolute bottom-3 right-3 flex items-center space-x-4">
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
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end mt-8">
          <button
            onClick={handleSave}
            disabled={isSubmitting || (smsValidation && !smsValidation.isValid)}
            className={`flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ${
              isSubmitting || (smsValidation && !smsValidation.isValid)
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <FaSave className="mr-2" />
                Save Message
              </>
            )}
          </button>
        </div>
      </div>
      <MobilePreview smsContent={smsContent} />
    </>
  );
};

export default MsgCreate;
