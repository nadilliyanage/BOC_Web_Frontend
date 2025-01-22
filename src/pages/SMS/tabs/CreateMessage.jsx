import React, { useState } from "react";
import axios from "axios";
import SuccessAlert from "../../../components/SuccessAlert";
import ErrorAlert from "../../../components/ErrorAlert";
import WarningAlert from "../../../components/WarningAlert";
import ConfirmAlert from "../../../components/ConfirmAlert";

const CreateMessage = () => {
  const [smsContent, setSmsContent] = useState("");
  const [messageLabel, setMessageLabel] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSmsContentChange = (event) => {
    setSmsContent(event.target.value);
  };

  const handleMessageLabelChange = (event) => {
    setMessageLabel(event.target.value);
  };

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

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/create-message",
        {
          label: messageLabel,
          message: smsContent,
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
    }
  };

  return (
    <>
      {/* Form Section */}
      <div className="bg-white w-full md:w-11/12 shadow-md rounded-b-lg p-6 mr-0 md:mr-6 dark:bg-[#282828]">
        <h1 className="text-lg font-bold mb-4">Create Message</h1>

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
            className={`bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary2 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
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
                  <div className="self-start w-40 bg-gray-200 text-black rounded-lg px-4 py-2 text-xs shadow-sm break-words whitespace-pre-wrap">
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

export default CreateMessage;
