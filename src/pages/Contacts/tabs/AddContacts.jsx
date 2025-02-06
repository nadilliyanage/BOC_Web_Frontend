import React, { useState, useEffect } from "react";
import axios from "axios";

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
      alert("Error fetching file list.");
    }
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file to upload.");
    if (fileList.includes(file.name)) return alert("This file already exists.");

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
      setIsModalOpen(true);
    } catch (error) {
      alert("Error fetching contacts.");
    }
  };

  return (
    <div className="p-6 w-full mx-auto bg-white rounded-lg shadow-lg dark:bg-dark_2 flex flex-row gap-10 min-h-[500px] ">
      <div className="w-1/2 m-auto border-r pr-4 ">
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
      </div>
      <div className="w-1/2">
        <h3 className="text-xl my-6 font-bold">Uploaded Files</h3>
        <div className="max-h-80 overflow-y-auto">
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
              </li>
            ))}
          </ul>
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-600 dark:text-white text-xl"
            >
              &times;
            </button>
            <div className="bg-white dark:bg-dark_2 rounded-lg shadow-xl p-6 w-96 relative max-h-[70%] overflow-x-auto">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-2 right-2 text-gray-600 dark:text-white text-xl"
              >
                &times;
              </button>

              <h3 className="text-xl font-semibold mb-4">
                Contacts in {selectedFileName}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {contacts.map((contact, index) => (
                  <div key={index} className="border p-2 rounded shadow-sm">
                    {contact.number}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddContacts;
