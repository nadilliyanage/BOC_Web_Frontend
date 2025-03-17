import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import Papa from "papaparse";
import {
  Button,
  TextField,
  Typography,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const SendCustomizeSMS = () => {
  const [smsContent, setSmsContent] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [csvData, setCsvData] = useState([]);
  const [columnHeaders, setColumnHeaders] = useState([]);
  const [mobileNumberColumn, setMobileNumberColumn] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [sender, setSender] = useState("");
  const [schedule, setSchedule] = useState(""); // State for schedule date and time

  // Handle CSV file upload with PapaParse
  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          if (results.data.length === 0) {
            setErrorMessage("CSV file is empty!");
            return;
          }
          console.log("Parsed CSV Data:", results.data);
          setColumnHeaders(results.meta.fields || []);
          setCsvData(results.data);
          setErrorMessage("CSV file uploaded successfully!");
        },
        error: (error) => {
          console.error("CSV Parsing Error:", error);
          setErrorMessage("Error parsing CSV file!");
        },
      });
    }
  }, []);

  // Generate messages from template
  const generateMessages = () => {
    if (!csvData.length || !smsContent || !mobileNumberColumn) {
      setErrorMessage(
        "Please upload CSV, set template, and select mobile number column!"
      );
      return;
    }

    const variableRegex = /\$[A-Z]/g; // Match variables like $A, $B, $C
    const variables = smsContent.match(variableRegex) || [];

    // Validate mobile number column exists
    if (!columnHeaders.includes(mobileNumberColumn)) {
      setErrorMessage("Invalid mobile number column!");
      return;
    }

    // Filter out rows with null or invalid mobile numbers
    const generated = csvData
      .filter(
        (row) =>
          row[mobileNumberColumn] != null &&
          row[mobileNumberColumn].trim() !== ""
      )
      .map((row) => ({
        number: row[mobileNumberColumn], // Recipient's number
        message: variables.reduce((msg, varChar) => {
          const columnIndex = varChar.charCodeAt(1) - 65; // Extract column index from $A, $B, etc.
          const columnName = columnHeaders[columnIndex];
          return columnName ? msg.replace(varChar, row[columnName] || "") : msg;
        }, smsContent), // Generated message (e.g., "Hello Bob, your number is 078546985")
      }));

    console.log("Generated Messages:", generated);
    setMessages(generated);
    setErrorMessage("Messages generated successfully!");
  };

  // Save messages to backend
  const saveMessages = async () => {
    if (!campaignName || messages.length === 0 || !sender) {
      setErrorMessage(
        "Please enter a campaign name, select sender, and generate messages!"
      );
      return;
    }

    setLoading(true);
    try {
      // Send each generated message as a separate request
      for (const msg of messages) {
        const payload = {
          campaignName: campaignName, // Campaign name
          sender: sender, // Selected sender
          number: msg.number, // Recipient's number
          message: msg.message, // Generated message (e.g., "Hello Bob, your number is 078546985")
          schedule: schedule || null, // Add schedule if applicable
          removeBlockedNumbers: true, // Add checkbox value if applicable
        };

        console.log("Sending payload to backend:", payload);

        const response = await axios.post(
          "http://localhost:8080/api/v1/send-customize-sms",
          payload
        );
        console.log("Backend Response:", response.data);
      }

      Swal.fire({
        title: "Success!",
        text: "Messages saved and sent successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error saving messages:", error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data || "Failed to save messages!",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 w-full mx-auto dark:bg-dark_1 transition-colors duration-300">
      {/* CSV Upload Section */}
      <Paper
        elevation={5}
        className="p-6 mb-6 dark:bg-dark_2 rounded-xl shadow-lg transition-transform hover:scale-[1.005]"
      >
        <h2
          variant="h5"
          gutterBottom
          className="dark:text-white font-bold mb-4 text-2xl border-b-2 border-yellow-400 pb-2"
        >
          CSV File Upload
        </h2>

        {/* File Upload Button */}
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          style={{ display: "none" }}
          id="csv-file-input"
        />
        <label htmlFor="csv-file-input">
          <Button
            variant="contained"
            component="span"
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
            startIcon={<CloudUploadIcon />}
          >
            Upload CSV File
          </Button>
        </label>

        {/* CSV Columns Section */}
        {columnHeaders.length > 0 && (
          <div className="mt-6 space-y-4">
            <Typography className="dark:text-slate-300 font-medium text-lg">
              Detected CSV Columns:
            </Typography>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 dark:bg-dark_3 p-4 rounded-lg">
              {columnHeaders.map((header, index) => (
                <div
                  key={index}
                  className="dark:bg-dark_1 p-2 rounded-md border border-yellow-400/30 flex items-center space-x-2"
                >
                  <span className="dark:text-yellow-400 font-mono">
                    ${String.fromCharCode(65 + index)}
                  </span>
                  <span className="dark:text-slate-300 truncate">{header}</span>
                </div>
              ))}
            </div>

            {/* Mobile Number Selector */}
            <FormControl fullWidth className="mt-4">
              <InputLabel className="dark:text-slate-400 !text-sm">
                Select Mobile Number Column
              </InputLabel>
              <Select
                value={mobileNumberColumn}
                onChange={(e) => setMobileNumberColumn(e.target.value)}
                className="bg-slate-100 dark:text-white dark:bg-dark_3 rounded-lg"
                MenuProps={{
                  PaperProps: {
                    className:
                      "dark:bg-dark_2 dark:text-white rounded-lg mt-1 shadow-xl",
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                }}
              >
                {columnHeaders.map((header) => (
                  <MenuItem
                    key={header}
                    value={header}
                    className="dark:text-slate-300 hover:dark:bg-dark_3 transition-colors"
                  >
                    {header}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        )}
      </Paper>

      {/* Campaign Details Section */}
      <Paper
        elevation={5}
        className="p-6 mb-6 dark:bg-dark_2 rounded-xl shadow-lg transition-transform hover:scale-[1.005]"
      >
        <h2
          variant="h5"
          gutterBottom
          className="dark:text-white font-bold mb-6 text-2xl border-b-2 border-yellow-400 pb-2"
        >
          Send Customize Bulk Message
        </h2>

        <div className="space-y-6">
          {/* Campaign Name Input */}
          <TextField
            fullWidth
            label="Campaign Name"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
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

          {/* Sender Selector */}
          <FormControl fullWidth>
            <InputLabel className="dark:text-slate-400 !text-sm">
              Sender Identity
            </InputLabel>
            <Select
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              className="dark:text-white dark:bg-dark_3 rounded-lg bg-slate-100"
              MenuProps={{
                PaperProps: {
                  className:
                    "bg-slate-100 dark:bg-dark_2 dark:text-white rounded-lg mt-1 shadow-xl",
                },
              }}
              sx={{
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
              }}
            >
              <MenuItem
                value=""
                className="dark:text-slate-300 hover:dark:bg-dark_3"
              >
                <em>Select Sender</em>
              </MenuItem>
              <MenuItem
                value="BOC IT"
                className="dark:text-slate-300 hover:dark:bg-dark_3"
              >
                BOC IT
              </MenuItem>
            </Select>
          </FormControl>

          {/* Schedule Field */}
          <TextField
            fullWidth
            label="Schedule Date & Time"
            type="datetime-local"
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            className="dark:text-white"
            InputProps={{
              className:
                "bg-slate-100 dark:text-white dark:bg-dark_3 rounded-lg",
            }}
            InputLabelProps={{
              className: "dark:text-slate-400 !text-sm",
              shrink: true, // Ensures the label doesn't overlap with the value
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { border: "none" },
                "&:hover fieldset": { border: "none" },
              },
            }}
          />

          {/* Message Template Editor */}
          <div className="relative group">
            <TextField
              fullWidth
              multiline
              rows={6}
              label="Message Template"
              placeholder="Enter message template using variables ($A, $B, $C...)"
              value={smsContent}
              onChange={(e) => setSmsContent(e.target.value)}
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
            <div className="absolute top-2 right-2 dark:text-slate-500 text-sm dark:bg-dark_2 px-2 py-1 rounded-md">
              Variables:{" "}
              {columnHeaders
                .map((_, i) => `$${String.fromCharCode(65 + i)}`)
                .join(", ")}
            </div>
          </div>

          {/* Generate Button */}
          <Button
            variant="contained"
            color="primary"
            className="w-full py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold text-lg rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
            onClick={generateMessages}
            disabled={!csvData.length || !smsContent || !mobileNumberColumn}
          >
            Generate Messages
          </Button>
        </div>
      </Paper>

      {/* Message Preview Section */}
      {messages.length > 0 && (
        <Paper
          elevation={3}
          className="p-6 dark:bg-dark_2 rounded-xl shadow-xl transition-transform hover:scale-[1.005]"
        >
          <div className="space-y-6">
            <Typography
              variant="h5"
              gutterBottom
              className="dark:text-white font-bold text-2xl border-b-2 border-yellow-400 pb-2"
            >
              Message Preview ({messages.length} messages)
            </Typography>

            {/* Preview List */}
            <div className="preview-container max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-yellow-500 scrollbar-track-dark_1 rounded-lg">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className="p-4 mb-3 dark:bg-dark_3 rounded-lg border border-dark_1 hover:border-yellow-400/30 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Typography
                      variant="body2"
                      className="dark:text-slate-400 font-mono text-sm"
                    >
                      To: {msg.number}
                    </Typography>
                    <span className="dark:text-yellow-400 text-xs bg-slate-100 dark:bg-dark_1 px-2 py-1 rounded-md">
                      #{index + 1}
                    </span>
                  </div>
                  <Typography
                    variant="body1"
                    className="dark:text-slate-200 whitespace-pre-wrap font-medium"
                  >
                    {msg.message}
                  </Typography>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <Button
              variant="contained"
              color="secondary"
              className="w-full py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold text-lg rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
              onClick={saveMessages}
              disabled={loading || !campaignName || !sender}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <CircularProgress size={24} className="text-white" />
                  Processing...
                </div>
              ) : (
                "Send All Messages"
              )}
            </Button>
          </div>
        </Paper>
      )}
    </div>
  );
};

export default SendCustomizeSMS;
