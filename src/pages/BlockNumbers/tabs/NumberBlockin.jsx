import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { FaSearch, FaUpload, FaPlus, FaPhone } from "react-icons/fa";

const NumberBlocking = () => {
  const [numbers, setNumbers] = useState("");
  const [blockedNumbers, setBlockedNumbers] = useState([]);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState(""); // Search term for filtering numbers

  // Fetch all blocked numbers on component load
  useEffect(() => {
    fetchBlockedNumbers();
  }, []);

  // Fetch all blocked numbers
  const fetchBlockedNumbers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/number-block"
      );
      setBlockedNumbers(response.data);
    } catch (error) {
      setError("Failed to fetch blocked numbers.");
      Swal.fire({
        title: "Error!",
        text: "Failed to fetch blocked numbers.",
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

  // Validate number format
  const validateNumber = (number) => {
    return /^94\d{9}$/.test(number); // Ensure the number starts with "94" and has exactly 11 digits
  };

  // Add blocked numbers manually
  const handleAddNumbers = async () => {
    try {
      const numbersArray = numbers
        .split(/[,\n]/)
        .map((num) => num.trim())
        .filter((num) => num.length > 0);

      // Check for duplicates in the input
      const uniqueNumbers = [...new Set(numbersArray)];

      // Validate each number
      const invalidNumbers = uniqueNumbers.filter(
        (number) => !validateNumber(number)
      );
      if (invalidNumbers.length > 0) {
        setError(
          `Invalid numbers: ${invalidNumbers.join(
            ", "
          )}. Numbers must start with "94" and have a length of 11.`
        );
        Swal.fire({
          title: "Invalid Numbers!",
          text: `Invalid numbers: ${invalidNumbers.join(
            ", "
          )}. Numbers must start with "94" and have a length of 11.`,
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

      for (const number of uniqueNumbers) {
        try {
          const response = await axios.post(
            "http://localhost:8080/api/v1/number-block",
            { number }
          );
          console.log("Added number:", response.data); // Log the response
        } catch (error) {
          console.error(
            "Failed to add number:",
            number,
            error.response?.data || error.message
          );
          Swal.fire({
            title: "Error!",
            text: `Failed to add number: ${number}. Please check the console for details.`,
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
      }

      setNumbers("");
      fetchBlockedNumbers(); // Refresh the list
      Swal.fire({
        title: "Success!",
        text: "Numbers added successfully!",
        icon: "success",
        confirmButtonText: "OK",
        background: document.documentElement.classList.contains("dark")
          ? "#1f2937"
          : "#ffffff",
        color: document.documentElement.classList.contains("dark")
          ? "#ffffff"
          : "#000000",
      });
    } catch (error) {
      console.error(
        "Error adding blocked numbers:",
        error.response?.data || error.message
      );
      setError(
        "Failed to add blocked numbers. Please check the console for details."
      );
      Swal.fire({
        title: "Error!",
        text: "Failed to add blocked numbers. Please check the console for details.",
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

  // Upload CSV file
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        await axios.post(
          "http://localhost:8080/api/v1/number-block/upload-csv",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        fetchBlockedNumbers(); // Refresh the list
        Swal.fire({
          title: "Success!",
          text: "CSV file uploaded successfully!",
          icon: "success",
          confirmButtonText: "OK",
          background: document.documentElement.classList.contains("dark")
            ? "#1f2937"
            : "#ffffff",
          color: document.documentElement.classList.contains("dark")
            ? "#ffffff"
            : "#000000",
        });
      } catch (error) {
        console.error(
          "Error uploading CSV file:",
          error.response?.data || error.message
        );
        setError(
          "Failed to upload CSV file. Please check the console for details."
        );
        Swal.fire({
          title: "Error!",
          text: "Failed to upload CSV file. Please check the console for details.",
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
    }
  };

  // Filter blocked numbers based on search term
  const filteredNumbers = blockedNumbers.filter((numberBlock) =>
    numberBlock.number.includes(searchTerm)
  );

  return (
    <div className="p-6 w-full mx-auto bg-white rounded-lg shadow-lg dark:bg-dark_2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Add Numbers and Upload */}
        <div className="space-y-6">
          {/* Add numbers manually */}
          <div className="bg-white dark:bg-dark_3 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <FaPlus className="text-yellow-500 mr-2" />
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                Add Numbers
              </h2>
            </div>
            <textarea
              value={numbers}
              onChange={(e) => setNumbers(e.target.value)}
              placeholder="Enter numbers separated by commas or newlines"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:text-white dark:bg-dark_2 transition-all duration-200"
              rows="4"
            />
            <button
              onClick={handleAddNumbers}
              className="mt-4 w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
            >
              <FaPlus className="mr-2" />
              Add Numbers
            </button>
          </div>

          {/* Upload CSV file */}
          <div className="bg-white dark:bg-dark_3 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <FaUpload className="text-yellow-500 mr-2" />
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                Upload CSV File
              </h2>
            </div>
            <div className="relative">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg dark:bg-dark_2 hover:border-yellow-500 transition-all duration-200 cursor-pointer"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <FaUpload className="text-gray-400 text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Search and Display */}
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="bg-white dark:bg-dark_3 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <FaSearch className="text-yellow-500 mr-2" />
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                Search Numbers
              </h2>
            </div>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search numbers..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:text-white dark:bg-dark_2 transition-all duration-200"
              />
            </div>
          </div>

          {/* Display blocked numbers */}
          <div className="bg-white dark:bg-dark_3 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <FaPhone className="text-yellow-500 mr-2" />
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                Blocked Numbers
              </h2>
            </div>
            {filteredNumbers.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <FaPhone className="text-4xl mx-auto mb-2" />
                <p>No numbers found</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto">
                {filteredNumbers.map((numberBlock) => (
                  <div
                    key={numberBlock.id}
                    className="p-3 bg-gray-50 dark:bg-dark_2 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200"
                  >
                    <span className="text-sm font-medium text-gray-800 dark:text-white">
                      {numberBlock.number}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default NumberBlocking;
