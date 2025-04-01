import React, { useState, useEffect } from "react";
import axios from "axios";
import SuccessAlert from "../../../components/SuccessAlert";
import ErrorAlert from "../../../components/ErrorAlert";
import WarningAlert from "../../../components/WarningAlert";
import ConfirmAlert from "../../../components/ConfirmAlert";
import { FaUpload, FaFileAlt, FaTimes, FaSearch } from "react-icons/fa";

const API_BASE_URL = "http://localhost:8080/api/v1/contact-list";

const AddContacts = () => {
  const [file, setFile] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchFileNames();
  }, []);

  const fetchFileNames = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/files`);
      setFileList(response.data);
    } catch (error) {
      ErrorAlert({
        title: "Error",
        text: "Error fetching file list.",
      });
    }
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) {
      WarningAlert({
        title: "No File Selected",
        text: "Please select a file to upload.",
      });
      return;
    }

    if (fileList.includes(file.name)) {
      WarningAlert({
        title: "File Exists",
        text: "This file already exists.",
      });
      return;
    }

    const isConfirmed = await ConfirmAlert({
      title: "Are you sure?",
      text: "Do you want to upload this file?",
    });

    if (!isConfirmed) return; // Exit if not confirmed

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`${API_BASE_URL}/upload`, formData);
      SuccessAlert({
        title: "Success",
        text: "File uploaded successfully!",
      });
      setFile(null);
      fetchFileNames();
    } catch (error) {
      ErrorAlert({
        title: "Error",
        text: "Error uploading file.",
      });
    }
  };

  const fetchContactsByFileName = async (fileName) => {
    try {
      setSelectedFileName(fileName);
      const response = await axios.get(`${API_BASE_URL}/findByFileName`, {
        params: { fileName },
      });
      setContacts(response.data);
      setIsModalOpen(true);
    } catch (error) {
      ErrorAlert({
        title: "Error",
        text: "Error fetching contacts.",
      });
    }
  };

  return (
    <div className="p-6 w-full mx-auto bg-white rounded-lg shadow-lg dark:bg-dark_2">
      <div className="space-y-6">
        {/* Upload CSV File */}
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
              onChange={handleFileChange}
              accept=".csv"
              className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg dark:bg-dark_2 hover:border-yellow-500 transition-all duration-200 cursor-pointer"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <FaUpload className="text-gray-400 text-2xl" />
            </div>
          </div>
          <button
            onClick={handleUpload}
            className="mt-4 w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
          >
            <FaUpload className="mr-2" />
            Upload File
          </button>
        </div>

        {/* Uploaded Files List */}
        <div className="bg-white dark:bg-dark_3 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <FaFileAlt className="text-yellow-500 mr-2" />
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">
              Uploaded Files
            </h2>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            <div className="space-y-2">
              {fileList.map((fileName, index) => (
                <div
                  key={index}
                  onClick={() => fetchContactsByFileName(fileName)}
                  className="p-3 bg-gray-50 dark:bg-dark_2 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-800 dark:text-white group-hover:text-yellow-500 dark:group-hover:text-yellow-400 transition-colors duration-200">
                      {fileName}
                    </span>
                    <FaSearch className="text-gray-400 group-hover:text-yellow-500 transition-colors duration-200" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Contacts Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark_3 rounded-lg shadow-xl p-6 w-[90%] max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                Contacts in {selectedFileName}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {contacts.map((contact, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 dark:bg-dark_2 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200"
                  >
                    <span className="text-gray-800 dark:text-white">
                      {contact.number}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddContacts;
