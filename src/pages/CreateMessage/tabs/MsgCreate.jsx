import React, { useState } from "react";
import axios from "axios";
import SuccessAlert from "../../../components/SuccessAlert";
import ErrorAlert from "../../../components/ErrorAlert";
import WarningAlert from "../../../components/WarningAlert";
import ConfirmAlert from "../../../components/ConfirmAlert";
import MobilePreview from "./components/MobilePreview";
import LoadingScreen from "../../../components/LoadingScreen";
import { jwtDecode } from "jwt-decode";

const MsgCreate = () => {
  const [smsContent, setSmsContent] = useState("");
  const [messageLabel, setMessageLabel] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSmsContentChange = (event) => {
    setSmsContent(event.target.value);
  };

  const handleMessageLabelChange = (event) => {
    setMessageLabel(event.target.value);
  };

  // Get token from localStorage and decode it
  const token = localStorage.getItem("token");
  let user = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      console.log("Decoded Token:", decoded);
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
  console.log(id, name, userId);

  const handleSave = async () => {
    if (!messageLabel.trim() || !smsContent.trim()) {
      WarningAlert({
        title: "Validation Error",
        text: "Both Message Label and SMS Content are required.",
      });
      return;
    }

    const isConfirmed = await ConfirmAlert({
      title: "Are you sure?",
      text: "Do you want to save this message?",
    });

    if (!isConfirmed) return; // Exit if not confirmed

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
          creted_by_userId: userId,
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

  return (
    <>
      {isLoading && <LoadingScreen />} {/* Show loading screen while saving */}
      {/* Form Section */}
      <div className="bg-white w-full md:w-11/12 shadow-md rounded-b-lg p-6 mr-0 md:mr-6 dark:bg-[#282828]">
        <h1 className="text-lg font-bold mb-4 dark:text-white border-b-2 border-yellow-400 pb-2">
          Create Message
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Message Label */}
          <div>
            <label className="block text-gray-700 font-medium dark:text-white mt-4">
              Message Label
            </label>
            <input
              type="text"
              value={messageLabel}
              onChange={handleMessageLabelChange}
              className="mt-1 block w-full border pl-1 border-gray-300 rounded-md shadow-sm focus:ring-yellow-400 focus:border-yellow-400 dark:text-white dark:bg-dark_3"
            />
          </div>

          {/* SMS Content */}
          <div className="md:col-span-2 mt-6">
            <label className="block text-gray-700 font-medium dark:text-white">
              SMS Content
            </label>
            <textarea
              rows={10}
              value={smsContent}
              onChange={handleSmsContentChange}
              className="mt-1 block w-full border pl-1 border-gray-300 rounded-md shadow-sm focus:ring-yellow-400 focus:border-yellow-400 dark:text-white dark:bg-dark_3"
            ></textarea>
            <span className="text-gray-500 text-sm">
              {smsContent.length} / 225
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4 my-8">
          <button
            onClick={handleSave}
            className={`bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-4 py-2 rounded-lg  ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
      {/* Mobile Preview Section */}
      <MobilePreview smsContent={smsContent} />
    </>
  );
};

export default MsgCreate;
