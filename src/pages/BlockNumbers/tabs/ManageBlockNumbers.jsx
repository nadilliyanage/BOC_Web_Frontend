import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const ManageBlockNumbers = () => {
  const [numbers, setNumbers] = useState("");
  const [blockedNumbers, setBlockedNumbers] = useState([]);
  const [error, setError] = useState("");
  const [editingNumber, setEditingNumber] = useState(null); // Track the number being edited
  const [editValue, setEditValue] = useState(""); // Value in the edit input
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

  // Filter blocked numbers based on search term
  const filteredNumbers = blockedNumbers.filter((numberBlock) =>
    numberBlock.number.includes(searchTerm)
  );

  return (
    <div className="p-6 w-full mx-auto bg-white rounded-lg shadow-lg dark:bg-dark_2 flex flex-row">
      <div className="w-2/3 m-4">
        {/* Search Bar */}
        <div className="mb-4">
          <label className="block  font-medium mb-2">Search Numbers</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search numbers..."
            className="w-full px-4 py-2 border border-gray-300  rounded-md focus:outline-none focus:ring-2 focus:ring-secondary dark:text-white dark:bg-dark_3"
          />
        </div>

        {/* Display blocked numbers in 3 columns */}
        <div>
          <h2 className="text-xl font-bold mb-2">Blocked Numbers</h2>
          {filteredNumbers.length === 0 ? (
            <p>No numbers found.</p>
          ) : (
            <div className="grid grid-cols-4 gap-4 overflow-scroll max-h-80">
              {filteredNumbers.map((numberBlock) => (
                <div
                  key={numberBlock.id}
                  className="p-2 border-b flex dark:hover:bg-slate-950 hover:transition-opacity duration-700"
                >
                  <span>{numberBlock.number}</span>
                  <div>
                    <button
                      onClick={() => openEditModal(numberBlock)}
                      className="text-blue-500 hover:text-blue-700 mx-4"
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
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="w-1/3 m-4 border-l-2 p-8 ">
        {/* Add numbers manually */}
        <div className="mt-8">
          <label className="block font-medium mb-2 ">Add Numbers</label>
          <textarea
            value={numbers}
            onChange={(e) => setNumbers(e.target.value)}
            placeholder="Enter numbers separated by commas or newlines"
            className="w-full px-4 py-2 border border-gray-300  rounded-md focus:outline-none focus:ring-2 focus:ring-secondary dark:text-white dark:bg-dark_3"
            rows="4"
          />
          <button
            onClick={handleAddNumbers}
            className="mt-2 bg-secondary text-white px-4 py-2 rounded-md hover:bg-secondary2 font-bold"
          >
            Add Numbers
          </button>
        </div>

        {/* Upload CSV file */}
        <div className="mb-4">
          <label className="block text-gray-400 font-medium m-2">
            Upload CSV File
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="w-full p-2 border border-gray-300 rounded-md dark:bg-dark_2"
          />
        </div>
        {/* Error message */}
        {error && <p className="text-red-500 mt-4">{error}</p>}
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
    </div>
  );
};

export default ManageBlockNumbers;
