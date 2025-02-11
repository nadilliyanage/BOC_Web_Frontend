import React, { useState, useEffect } from "react";
import axios from "axios";
import SuccessAlert from "../../../components/SuccessAlert";
import ErrorAlert from "../../../components/ErrorAlert";
import WarningAlert from "../../../components/WarningAlert";
import ConfirmAlert from "../../../components/ConfirmAlert";

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
    <div className="p-6 w-full mx-auto bg-white rounded-lg shadow-lg min-h-[550px] dark:bg-dark_2">
      <h2 className="text-2xl font-bold mb-6">Upload CSV File</h2>
      <input
        type="file"
        onChange={handleFileChange}
        accept=".csv"
        className="border p-2 w-full mb-4"
      />
      <button
        onClick={handleUpload}
        className="bg-secondary hover:bg-secondary2 font-bold text-white px-4 py-2 rounded"
      >
        Upload
      </button>

      <h3 className="text-xl font-bold mt-6">Uploaded Files</h3>
      <div className="max-h-52 overflow-auto">
        <ul>
          {fileList.map((fileName, index) => (
            <li
              key={index}
              className="flex justify-between items-center border-b p-2"
            >
              <span
                onClick={() => fetchContactsByFileName(fileName)}
                className="cursor-pointer text-secondary2 dark:text-secondary font-bold"
              >
                {fileName}
              </span>
              <button
                onClick={() => handleDeleteFile(fileName)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal for displaying contacts */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <button
            onClick={closeModal}
            className="absolute top-2 right-4 text-gray-600 dark:text-white text-xl"
          >
            &times;
          </button>
          <div className="bg-white dark:bg-dark_2 rounded-lg shadow-xl p-6 w-[30%] relative max-h-[70%] overflow-x-auto">
            <button
              onClick={closeModal}
              className="absolute top-2 right-4 text-gray-600 dark:text-white text-xl"
            >
              &times;
            </button>

            <h3 className="text-xl font-semibold mb-4">
              Contacts in {selectedFileName}
            </h3>
            <ul className="mt-10">
              {contacts.map((contact) => (
                <li
                  key={contact.id}
                  className="flex justify-between items-center border-b p-2"
                >
                  {editNumberData?.id === contact.id ? (
                    // Show input field if editing this number
                    <>
                      <input
                        type="text"
                        value={editNumberData.newNumber}
                        onChange={(e) =>
                          setEditNumberData({
                            ...editNumberData,
                            newNumber: e.target.value,
                          })
                        }
                        className="border p-1 dark:bg-dark_2 w-28"
                      />

                      <button
                        onClick={handleEditNumber}
                        className="bg-green-500 text-white px-2 py-1 rounded"
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    // Show normal text with Edit button
                    <>
                      <span>{contact.number}</span>
                      <button
                        onClick={() => handleEditClick(contact)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                      >
                        Edit
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDeleteNumber(contact.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactList;