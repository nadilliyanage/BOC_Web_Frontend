import React, { useState } from "react";
import axios from "axios";

const UploadCSV = ({ setContactLists }) => {
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name); // Save the filename
  };

  const handleUpload = () => {
    if (!file) {
      setErrorMessage("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    axios
      .post("http://localhost:8080/api/v1/contact-list/upload", formData)
      .then((response) => {
        setErrorMessage("");
        setContactLists(response.data);
      })
      .catch((error) => {
        setErrorMessage("Error uploading file. Please try again.");
      });
  };

  return (
    <div className="upload-csv">
      <h2>Upload CSV File</h2>
      <input type="file" onChange={handleFileChange} accept=".csv" />
      <button onClick={handleUpload}>Upload</button>

      {errorMessage && <p className="error">{errorMessage}</p>}
    </div>
  );
};

export default UploadCSV;
