import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import Papa from "papaparse";
import { Button, TextField, Typography, Paper, MenuItem } from "@mui/material";

const SendCustomizeSMS = () => {
  const [smsContent, setSmsContent] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [csvData, setCsvData] = useState([]);
  const [columnHeaders, setColumnHeaders] = useState([]);
  const [mobileNumberColumn, setMobileNumberColumn] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);

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

    const generated = csvData.map((row) => ({
      mobileNumber: row[mobileNumberColumn],
      message: variables.reduce((msg, varChar) => {
        const columnIndex = varChar.charCodeAt(1) - 65; // Extract column index from $A, $B, etc.
        const columnName = columnHeaders[columnIndex];
        return columnName ? msg.replace(varChar, row[columnName]) : msg;
      }, smsContent),
    }));

    console.log("Generated Messages:", generated);
    setMessages(generated);
    setErrorMessage("Messages generated successfully!");
  };

  // Save messages to backend
  const saveMessages = async () => {
    if (!campaignName || !messages.length) {
      setErrorMessage("Please enter a campaign name and generate messages!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/send-message",
        {
          campaignName,
          messages,
        }
      );
      console.log("Backend Response:", response.data);
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
    <>
      <div className="p-4">
        <Paper elevation={3} className="p-4 mb-4">
          <Typography variant="h5" gutterBottom>
            CSV File Upload
          </Typography>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            style={{ display: "none" }}
            id="csv-file-input"
          />
          <label htmlFor="csv-file-input">
            <Button variant="contained" component="span">
              Upload CSV File
            </Button>
          </label>

          {columnHeaders.length > 0 && (
            <div className="mt-4">
              <Typography>CSV Columns Detected:</Typography>
              <ul>
                {columnHeaders.map((header, index) => (
                  <li key={index}>
                    ${String.fromCharCode(65 + index)}: {header}
                  </li>
                ))}
              </ul>

              <TextField
                select
                label="Select Mobile Number Column"
                value={mobileNumberColumn}
                onChange={(e) => setMobileNumberColumn(e.target.value)}
                fullWidth
                className="mt-2"
              >
                {columnHeaders.map((header) => (
                  <MenuItem key={header} value={header}>
                    {header}
                  </MenuItem>
                ))}
              </TextField>
            </div>
          )}
        </Paper>

        <Paper elevation={3} className="p-4 mb-4">
          <Typography variant="h5" gutterBottom>
            Campaign Details
          </Typography>
          <TextField
            fullWidth
            label="Campaign Name"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            className="mb-4"
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Message Template"
            variant="outlined"
            placeholder="Enter message template using variables ($A, $B, $C...)"
            value={smsContent}
            onChange={(e) => setSmsContent(e.target.value)}
            helperText="Use variables like $A, $B, $C to represent CSV columns in order"
          />

          <Button
            variant="contained"
            color="primary"
            className="mt-2"
            onClick={generateMessages}
            disabled={!csvData.length || !smsContent || !mobileNumberColumn}
          >
            Generate Messages
          </Button>
        </Paper>

        {messages.length > 0 && (
          <Paper elevation={3} className="p-4">
            <Typography variant="h5" gutterBottom>
              Message Preview ({messages.length} messages)
            </Typography>
            <div className="preview-container max-h-96 overflow-y-auto">
              {messages.map((msg, index) => (
                <div key={index} className="p-2 mb-2 bg-gray-100 rounded">
                  <Typography variant="body2">
                    <strong>To:</strong> {msg.mobileNumber}
                  </Typography>
                  <Typography variant="body1">{msg.message}</Typography>
                </div>
              ))}
            </div>

            <Button
              variant="contained"
              color="secondary"
              className="mt-4"
              onClick={saveMessages}
              disabled={loading || !campaignName}
            >
              {loading ? "Saving..." : "Save and Send Messages"}
            </Button>
          </Paper>
        )}
      </div>
    </>
  );
};

export default SendCustomizeSMS;
