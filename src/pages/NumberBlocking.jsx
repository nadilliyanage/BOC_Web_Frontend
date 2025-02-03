import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const NumberBlocking = () => {
  const [numbers, setNumbers] = useState("");
  const [blockedNumbers, setBlockedNumbers] = useState([]);
  const [error, setError] = useState("");
  const [editingNumber, setEditingNumber] = useState(null); // Track the number being edited
  const [editValue, setEditValue] = useState(""); // Value in the edit input

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

  // Delete a blocked number
  const handleDeleteNumber = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/number-block/${id}`);
      fetchBlockedNumbers(); // Refresh the list
      Swal.fire({
        title: "Success!",
        text: "Number deleted successfully!",
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
        "Error deleting blocked number:",
        error.response?.data || error.message
      );
      setError(
        "Failed to delete blocked number. Please check the console for details."
      );
      Swal.fire({
        title: "Error!",
        text: "Failed to delete blocked number. Please check the console for details.",
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

  // Open edit modal
  const openEditModal = (numberBlock) => {
    setEditingNumber(numberBlock);
    setEditValue(numberBlock.number);
  };

  // Close edit modal
  const closeEditModal = () => {
    setEditingNumber(null);
    setEditValue("");
  };

  // Update a blocked number
  const handleUpdateNumber = async () => {
    try {
      if (!validateNumber(editValue)) {
        setError("Number must start with '94' and have a length of 11.");
        Swal.fire({
          title: "Invalid Number!",
          text: "Number must start with '94' and have a length of 11.",
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

      const response = await axios.put(
        `http://localhost:8080/api/v1/number-block/${editingNumber.id}`,
        { number: editValue }
      );

      closeEditModal();
      fetchBlockedNumbers(); // Refresh the list
      Swal.fire({
        title: "Success!",
        text: "Number updated successfully!",
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
        "Error updating blocked number:",
        error.response?.data || error.message
      );
      setError(
        error.response?.data ||
          "Failed to update blocked number. Please check the console for details."
      );
      Swal.fire({
        title: "Error!",
        text:
          error.response?.data ||
          "Failed to update blocked number. Please check the console for details.",
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
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg mt-10 dark:bg-dark_2">
      <h1 className="text-2xl font-bold mb-4">Number Blocking</h1>

      {/* Add numbers manually */}
      <div className="mb-4">
        <label className="block text-gray-300 font-medium mb-2">
          Add Numbers
        </label>
        <textarea
          value={numbers}
          onChange={(e) => setNumbers(e.target.value)}
          placeholder="Enter numbers separated by commas or newlines"
          className="w-full p-2 border border-gray-300 rounded-md dark:bg-dark_2"
          rows="4"
        />
        <button
          onClick={handleAddNumbers}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add Numbers
        </button>
      </div>

      {/* Upload CSV file */}
      <div className="mb-4">
        <label className="block text-gray-400 font-medium mb-2">
          Upload CSV File
        </label>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="w-full p-2 border border-gray-300 rounded-md dark:bg-dark_2"
        />
      </div>

      {/* Display blocked numbers */}
      <div>
        <h2 className="text-xl font-bold mb-2">Blocked Numbers</h2>
        {blockedNumbers.length === 0 ? (
          <p>No numbers blocked yet.</p>
        ) : (
          <ul>
            {blockedNumbers.map((numberBlock) => (
              <li
                key={numberBlock.id}
                className="flex justify-between items-center p-2 border-b"
              >
                <span>{numberBlock.number}</span>
                <div>
                  <button
                    onClick={() => openEditModal(numberBlock)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteNumber(numberBlock.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Edit Modal */}
      {editingNumber && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-dark_2">
            <h2 className="text-xl font-bold mb-4">Edit Number</h2>
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md dark:bg-dark_2"
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={closeEditModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateNumber}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default NumberBlocking;
