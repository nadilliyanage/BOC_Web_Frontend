import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/v1/contact-list";

const ContactList = () => {
  const [file, setFile] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [editNumberData, setEditNumberData] = useState(null); // Holds the currently edited contact

  useEffect(() => {
    fetchFileNames();
  }, []);

  const fetchFileNames = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/files`);
      setFileList(response.data);
    } catch (error) {
      alert("Error fetching file list.");
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    if (fileList.includes(file.name)) {
      alert("This file has already been uploaded.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`${API_BASE_URL}/upload`, formData);
      alert("File uploaded successfully!");
      setFile(null);
      fetchFileNames();
    } catch (error) {
      alert("Error uploading file.");
    }
  };

  const fetchContactsByFileName = async (fileName) => {
    try {
      setSelectedFileName(fileName);
      const response = await axios.get(`${API_BASE_URL}/findByFileName`, {
        params: { fileName },
      });
      setContacts(response.data);
    } catch (error) {
      alert("Error fetching contacts.");
    }
  };

  const handleDeleteFile = async (fileName) => {
    try {
      await axios.delete(`${API_BASE_URL}/deleteFile`, {
        params: { fileName },
      });
      alert("File deleted successfully!");
      fetchFileNames();
    } catch (error) {
      alert("Error deleting file.");
    }
  };

  const handleEditClick = (contact) => {
    setEditNumberData({ id: contact.id, newNumber: contact.number });
  };

  const handleEditNumber = async () => {
    if (!editNumberData || !editNumberData.newNumber) {
      alert("Please provide a new number.");
      return;
    }

    try {
      await axios.put(`${API_BASE_URL}/editNumber/${editNumberData.id}`, null, {
        params: { newNumber: editNumberData.newNumber },
      });
      alert("Number updated successfully!");
      fetchContactsByFileName(selectedFileName);
      setEditNumberData(null); // Clear edit mode
    } catch (error) {
      alert("Error editing number.");
    }
  };

  const handleDeleteNumber = async (id) => {
    if (window.confirm("Are you sure you want to delete this number?")) {
      try {
        await axios.delete(`${API_BASE_URL}/deleteNumber/${id}`);
        alert("Number deleted successfully!");
        fetchContactsByFileName(selectedFileName);
      } catch (error) {
        alert("Error deleting number.");
      }
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg mt-10 dark:bg-dark_2">
      <h2 className="text-2xl font-semibold mb-6 ">Upload CSV File</h2>
      <input
        type="file"
        onChange={handleFileChange}
        accept=".csv"
        className="border p-2 w-full mb-4"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Upload
      </button>

      <h3 className="text-xl font-semibold mt-6">Uploaded Files</h3>
      <ul>
        {fileList.map((fileName, index) => (
          <li
            key={index}
            className="flex justify-between items-center border-b p-2"
          >
            <span
              onClick={() => fetchContactsByFileName(fileName)}
              className="cursor-pointer text-blue-500"
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

      {contacts.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold">
            Contacts in {selectedFileName}
          </h3>
          <ul>
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
                      className="border p-1"
                    />
                    <button
                      onClick={handleEditNumber}
                      className="bg-green-500 text-white px-2 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditNumberData(null)}
                      className="bg-gray-500 text-white px-2 py-1 rounded"
                    >
                      Cancel
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
      )}
    </div>
  );
};

export default ContactList;
