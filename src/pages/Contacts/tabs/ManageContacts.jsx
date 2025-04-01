import React, { useState, useEffect } from "react";
import axios from "axios";
import SuccessAlert from "../../../components/SuccessAlert";
import ErrorAlert from "../../../components/ErrorAlert";
import WarningAlert from "../../../components/WarningAlert";
import ConfirmAlert from "../../../components/ConfirmAlert";
import {
  FaUpload,
  FaFileAlt,
  FaTrash,
  FaEdit,
  FaSave,
  FaTimes,
  FaSearch,
} from "react-icons/fa";

const API_BASE_URL = "http://localhost:8080/api/v1/contact-list";

const ContactList = () => {
  const [file, setFile] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [editNumberData, setEditNumberData] = useState(null); // Holds the currently edited contact
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls modal visibility

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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

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
        text: "This file has already been uploaded.",
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
      setIsModalOpen(true); // Open modal when contacts are fetched
    } catch (error) {
      ErrorAlert({
        title: "Error",
        text: "Error fetching contacts.",
      });
    }
  };

  const handleDeleteFile = async (fileName) => {
    const isConfirmed = await ConfirmAlert({
      title: "Are you sure?",
      text: "Do you want to delete this file?",
    });

    if (!isConfirmed) return; // Exit if not confirmed

    try {
      await axios.delete(`${API_BASE_URL}/deleteFile`, {
        params: { fileName },
      });
      SuccessAlert({
        title: "Success",
        text: "File deleted successfully!",
      });
      fetchFileNames();
    } catch (error) {
      ErrorAlert({
        title: "Error",
        text: "Error deleting file.",
      });
    }
  };

  const handleEditClick = (contact) => {
    setEditNumberData({ id: contact.id, newNumber: contact.number });
  };

  const handleEditNumber = async () => {
    if (!editNumberData || !editNumberData.newNumber) {
      WarningAlert({
        title: "Validation Error",
        text: "Please provide a new number.",
      });
      return;
    }

    const isConfirmed = await ConfirmAlert({
      title: "Are you sure?",
      text: "Do you want to update this number?",
    });

    if (!isConfirmed) return; // Exit if not confirmed

    try {
      await axios.put(`${API_BASE_URL}/editNumber/${editNumberData.id}`, null, {
        params: { newNumber: editNumberData.newNumber },
      });
      SuccessAlert({
        title: "Success",
        text: "Number updated successfully!",
      });
      fetchContactsByFileName(selectedFileName);
      setEditNumberData(null); // Clear edit mode
    } catch (error) {
      ErrorAlert({
        title: "Error",
        text: "Error editing number.",
      });
    }
  };

  const handleDeleteNumber = async (id) => {
    const isConfirmed = await ConfirmAlert({
      title: "Are you sure?",
      text: "Do you want to delete this number?",
    });

    if (!isConfirmed) return; // Exit if not confirmed

    try {
      await axios.delete(`${API_BASE_URL}/deleteNumber/${id}`);
      SuccessAlert({
        title: "Success",
        text: "Number deleted successfully!",
      });
      fetchContactsByFileName(selectedFileName);
    } catch (error) {
      ErrorAlert({
        title: "Error",
        text: "Error deleting number.",
      });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setContacts([]); // Clear contacts when modal is closed
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
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark_2 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200"
                >
                  <span
                    onClick={() => fetchContactsByFileName(fileName)}
                    className="cursor-pointer text-gray-800 dark:text-white hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors duration-200"
                  >
                    {fileName}
                  </span>
                  <button
                    onClick={() => handleDeleteFile(fileName)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900 rounded-full transition-colors duration-200"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark_3 rounded-lg shadow-xl p-6 w-[90%] max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                Contacts in {selectedFileName}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="p-4 bg-gray-50 dark:bg-dark_2 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      {editNumberData?.id === contact.id ? (
                        <div className="flex-1 flex items-center gap-2">
                          <input
                            type="text"
                            value={editNumberData.newNumber}
                            onChange={(e) =>
                              setEditNumberData({
                                ...editNumberData,
                                newNumber: e.target.value,
                              })
                            }
                            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-dark_3 dark:text-white"
                          />
                          <button
                            onClick={handleEditNumber}
                            className="p-2 text-green-500 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900 rounded-full transition-colors duration-200"
                          >
                            <FaSave />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="text-gray-800 dark:text-white">
                            {contact.number}
                          </span>
                          <button
                            onClick={() => handleEditClick(contact)}
                            className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-full transition-colors duration-200"
                          >
                            <FaEdit />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDeleteNumber(contact.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900 rounded-full transition-colors duration-200"
                      >
                        <FaTrash />
                      </button>
                    </div>
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

export default ContactList;
