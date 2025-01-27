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
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error("Response error:", error.response);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Request error:", error.request);
      } else {
        // Something happened in setting up the request
        console.error("Error:", error.message);
      }
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
      if (error.response) {
        console.error("Response error:", error.response);
      } else if (error.request) {
        console.error("Request error:", error.request);
      } else {
        console.error("Error:", error.message);
      }
      throw error;
    });
};

const UploadCSV = () => {
  const [file, setFile] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [numbers, setNumbers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");

  // Fetch file names on component mount
  useEffect(() => {
    fetchFileNames()
      .then((files) => setFileList(files))
      .catch(() => alert("Error fetching file list."));
  }, []);

  // Handle file input change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle file upload
  const handleUpload = () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    axios
      .post("http://localhost:8080/api/v1/contact-list/upload", formData, {
        timeout: 5000, // 5 seconds timeout
      })
      .then((response) => {
        console.log("File Upload Response:", response); // Debugging
        if (response.status === 200) {
          alert("File uploaded successfully!");
          setFile(null);

          // Fetch updated file list after upload
          fetchFileNames()
            .then((files) => setFileList(files))
            .catch(() => alert("Error fetching file list."));
        } else {
          alert("Error uploading file. Status: " + response.status);
        }
      })
      .catch((error) => {
        if (error.response) {
          console.error("Response error:", error.response);
          alert("Error uploading file: " + error.response.data.message);
        } else if (error.request) {
          console.error("Request error:", error.request);
          alert("Network error or no response from the server.");
        } else {
          console.error("Error:", error.message);
          alert("Error uploading file: " + error.message);
        }
      });
  };

  // Handle file click to fetch contacts by file name
  const handleFileClick = (fileName) => {
    setSelectedFileName(fileName);
    fetchContactsByFileName(fileName)
      .then((data) => {
        setNumbers(data);
        setIsModalOpen(true);
      })
      .catch(() => alert("Error fetching contacts."));
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setNumbers([]);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Upload CSV File</h2>
      <input
        type="file"
        onChange={handleFileChange}
        accept=".csv"
        className="border p-2 mb-4"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Upload
      </button>

      <div className="mt-8">
        <h3 className="text-xl font-semibold">Uploaded Files</h3>
        <ul className="space-y-2">
          {fileList.map((file, index) => (
            <li
              key={index}
              onClick={() => handleFileClick(file)}
              className="cursor-pointer text-blue-500 hover:text-blue-700"
            >
              {file}
            </li>
          ))}
        </ul>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">
              Numbers from {selectedFileName}
            </h3>
            <ul className="space-y-2">
              {numbers.length > 0 ? (
                numbers.map((contact, index) => (
                  <li key={index} className="text-lg">
                    {contact.number}
                  </li>
                ))
              ) : (
                <li>No numbers available for this file.</li>
              )}
            </ul>
            <button
              onClick={closeModal}
              className="mt-4 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
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
