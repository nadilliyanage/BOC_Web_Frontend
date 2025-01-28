import React, { useState, useEffect } from "react";
import axios from "axios";

// Fetch file names
const fetchFileNames = () => {
  return axios
    .get("http://localhost:8080/api/v1/contact-list/files", {
      timeout: 5000, // 5 seconds timeout
    })
    .then((response) => {
      console.log("File Names Response:", response); // Debugging
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching file names:", error);
      throw error;
    });
};

// Fetch contacts by file name
const fetchContactsByFileName = (fileName) => {
  return axios
    .get("http://localhost:8080/api/v1/contact-list/findByFileName", {
      params: { fileName },
      timeout: 5000, // 5 seconds timeout
    })
    .then((response) => {
      console.log("Contacts by File Name Response:", response); // Debugging
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching contacts by file name:", error);
      throw error;
    });
};

// Delete a file
const deleteFile = (fileName) => {
  return axios
    .delete("http://localhost:8080/api/v1/contact-list/deleteFile", {
      params: { fileName },
      timeout: 5000,
    })
    .then((response) => {
      console.log("Delete File Response:", response); // Debugging
      return response.data;
    })
    .catch((error) => {
      console.error("Error deleting file:", error);
      throw error;
    });
};

// Edit contact number by ID
const editContactNumber = (id, newNumber) => {
  return axios
    .put(`http://localhost:8080/api/v1/contact-list/editNumber/${id}`, null, {
      params: { newNumber },
    })
    .then((response) => {
      console.log("Edit Contact Number Response:", response); // Debugging
      return response.data;
    })
    .catch((error) => {
      console.error("Error editing contact number:", error);
      throw error;
    });
};

const UploadCSV = () => {
  const [file, setFile] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [numbers, setNumbers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [editNumberData, setEditNumberData] = useState({
    newNumber: "",
  });

  useEffect(() => {
    fetchFileNames()
      .then((files) => setFileList(files))
      .catch(() => alert("Error fetching file list."));
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    // Check if the file already exists
    if (fileList.includes(file.name)) {
      alert("This file has already been uploaded.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    axios
      .post("http://localhost:8080/api/v1/contact-list/upload", formData, {
        timeout: 5000,
      })
      .then((response) => {
        console.log("File Upload Response:", response);
        if (response.status === 200) {
          alert("File uploaded successfully!");
          setFile(null);
          fetchFileNames()
            .then((files) => setFileList(files))
            .catch(() => alert("Error fetching file list."));
        } else {
          alert("Error uploading file. Status: " + response.status);
        }
      })
      .catch((error) => {
        if (error.response) {
          alert("Error uploading file: " + error.response.data.message);
        } else {
          alert("Error uploading file: " + error.message);
        }
      });
  };

  const handleFileClick = (fileName) => {
    setSelectedFileName(fileName);
    fetchContactsByFileName(fileName)
      .then((data) => {
        setNumbers(data);
        setIsModalOpen(true);
      })
      .catch(() => alert("Error fetching contacts."));
  };

  const handleFileDelete = (fileName) => {
    deleteFile(fileName)
      .then(() => {
        alert("File deleted successfully!");
        fetchFileNames()
          .then((files) => setFileList(files))
          .catch(() => alert("Error fetching file list."));
      })
      .catch(() => alert("Error deleting file."));
  };

  const handleEditNumber = (contactId) => {
    const { newNumber } = editNumberData;
    if (!newNumber) {
      alert("Please provide a new number.");
      return;
    }

    editContactNumber(contactId, newNumber)
      .then(() => {
        alert("Number updated successfully!");
        fetchContactsByFileName(selectedFileName)
          .then((data) => setNumbers(data))
          .catch(() => alert("Error fetching contacts."));
      })
      .catch(() => alert("Error editing number."));
  };

  const handleEditButtonClick = (contactNumber) => {
    setEditNumberData({
      newNumber: contactNumber, // Default new number to the old one
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNumbers([]);
    setEditNumberData({ newNumber: "" });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg mt-10 dark:bg-dark_2">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6 dark:text-white">
        Upload CSV File
      </h2>
      <div className="mb-4">
        <input
          type="file"
          onChange={handleFileChange}
          accept=".csv"
          className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors duration-300"
      >
        Upload
      </button>

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-700 dark:text-white">
          Uploaded Files
        </h3>
        <ul className="space-y-4 mt-4">
          {fileList.map((file, index) => (
            <li
              key={index}
              className="flex justify-between items-center border-b pb-2 mb-2"
            >
              <span
                onClick={() => handleFileClick(file)}
                className="cursor-pointer text-blue-500 hover:text-blue-700"
              >
                {file}
              </span>
              <button
                onClick={() => handleFileDelete(file)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full dark:bg-dark_2">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 dark:text-white">
              Numbers from {selectedFileName}
            </h3>
            <ul className="space-y-2">
              {numbers.length > 0 ? (
                numbers.map((contact, index) => (
                  <li
                    key={index}
                    className="text-lg flex justify-between items-center"
                  >
                    <span>{contact.number}</span>
                    <button
                      onClick={() => handleEditButtonClick(contact.number)}
                      className="ml-4 text-blue-500 hover:text-blue-700"
                    >
                      Edit
                    </button>
                  </li>
                ))
              ) : (
                <li>No numbers available for this file.</li>
              )}
            </ul>

            <div className="mt-4">
              <input
                type="text"
                placeholder="New Number"
                value={editNumberData.newNumber}
                onChange={(e) =>
                  setEditNumberData({
                    ...editNumberData,
                    newNumber: e.target.value,
                  })
                }
                className="border border-gray-300 p-2 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-dark_3"
              />
              <button
                onClick={() => handleEditNumber(contact._id)}
                className="bg-green-500 text-white py-2 px-4 rounded-lg w-full hover:bg-green-600 transition-colors duration-300"
              >
                Edit Number
              </button>
            </div>

            <button
              onClick={closeModal}
              className="mt-4 py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadCSV;
