import React from "react";
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

const MobilePreview = ({ smsContent }) => {
  return (
    <Paper
      elevation={5}
      className="p-6 mb-6 dark:bg-dark_2 rounded-xl shadow-lg transition-transform hover:scale-[1.005]"
    >
      <h2 className="text-gray-700 font-medium dark:text-white mb-4 border-b-2 border-yellow-400 pb-2">
        Preview
      </h2>
      <div className="relative flex justify-center items-center bg-gray-50 border rounded-lg p-6 dark:bg-[#282828]">
        {/* Phone Mockup */}
        <div className="relative h-[35rem] w-[20rem] bg-black rounded-3xl shadow-lg overflow-hidden">
          {/* Camera Notch */}
          <div className="absolute top-0 w-full h-6 bg-gray-800 rounded-t-3xl dark:bg-[#121212]"></div>
          {/* Screen */}
          <div className="absolute inset-6 bg-white rounded-lg p-4 overflow-y-auto dark:bg-dark_1">
            <div className="flex flex-col h-full space-y-4">
              {/* Default Bubble Example */}
              {!smsContent && (
                <div className="self-start bg-gray-200 text-gray-800 rounded-lg px-4 py-2 text-sm shadow-sm dark:bg-dark_3 dark:text-white">
                  Your SMS text will appear here...
                </div>
              )}
              {/* Dynamic Bubble for SMS Content */}
              {smsContent && (
                <div
                  className="self-start w-40 bg-gray-200 text-black rounded-lg px-4 py-2 text-sm shadow-sm break-words"
                  style={{ whiteSpace: "pre-wrap" }} // This allows newlines to be preserved
                >
                  {smsContent}
                </div>
              )}
            </div>
          </div>
          {/* Bottom Border */}
          <div className="absolute bottom-0 w-full h-6 bg-gray-800 dark:bg-[#121212] rounded-b-3xl"></div>
        </div>
      </div>
    </Paper>
  );
};

export default MobilePreview;
