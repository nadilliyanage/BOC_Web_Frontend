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
import { Paper, TextField, Button } from "@mui/material";

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
      <Paper
        elevation={5}
        className="p-6 mx-4 dark:bg-dark_2 rounded-xl shadow-lg transition-transform hover:scale-[1.005] w-full "
      >
        <h1 className="text-lg font-bold mb-4 dark:text-white border-b-2 border-yellow-400 pb-2">
          Create Message
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Message Label */}
          <div>
            <TextField
              fullWidth
              label="Message Label"
              value={messageLabel}
              onChange={handleMessageLabelChange}
              placeholder="Enter a label for your message"
              className="dark:text-white"
              InputProps={{
                className:
                  "bg-slate-100 dark:text-white dark:bg-dark_3 rounded-lg",
              }}
              InputLabelProps={{
                className: "dark:text-slate-400 !text-sm",
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { border: "none" },
                  "&:hover fieldset": { border: "none" },
                },
              }}
            />
          </div>

          {/* SMS Content */}
          <div className="md:col-span-2">
            <div className="relative group">
              <TextField
                fullWidth
                multiline
                rows={12}
                label="SMS Content"
                value={smsContent}
                onChange={handleSmsContentChange}
                placeholder="Enter your message content..."
                className="dark:text-white"
                InputProps={{
                  className:
                    "bg-slate-100 dark:text-white dark:bg-dark_3 rounded-lg font-mono",
                }}
                InputLabelProps={{
                  className: "dark:text-slate-400 !text-sm",
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { border: "none" },
                    "&:hover fieldset": { border: "none" },
                  },
                }}
              />
              {smsValidation && (
                <div
                  className={`mt-2 text-sm ${
                    smsValidation.isValid ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {smsValidation.message}
                  {hasEmoji(smsContent) && (
                    <span className="ml-1 text-yellow-500">(with emoji)</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end mt-8">
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={isSubmitting || (smsValidation && !smsValidation.isValid)}
            className={`w-full md:w-auto py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold text-lg rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] ${
              isSubmitting || (smsValidation && !smsValidation.isValid)
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <FaSpinner className="animate-spin" />
                Saving...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <FaSave />
                Save Message
              </div>
            )}
          </Button>
        </div>
      </Paper>
      <MobilePreview smsContent={smsContent} />
    </>
  );
};

export default MsgCreate;
