import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateUser = () => {
  const [formData, setFormData] = useState({
    userId: "",
    userName: "",
    department: "",
    userType: "",
    smsType: "",
  });
  const [userTypes, setUserTypes] = useState([]); // State for userType options
  const [smsTypes, setSmsTypes] = useState([]); // State for smsType options
  const [errorMessage, setErrorMessage] = useState("");
  const [userIdError, setUserIdError] = useState("");

  useEffect(() => {
    const fetchDropdownOptions = async () => {
      try {
        const userTypeResponse = await axios.get(
          "http://localhost:8080/api/v1/user-types"
        );
        setUserTypes(userTypeResponse.data); // Assuming response.data is an array of user types

        const smsTypeResponse = await axios.get(
          "http://localhost:8080/api/v1/sms-types"
        );
        console.log("SMS Type Response:", smsTypeResponse.data);
        setSmsTypes(smsTypeResponse.data); // Assuming response.data is an array of SMS types
      } catch (error) {
        console.error("Error fetching dropdown options:", error);
        setErrorMessage("Failed to fetch dropdown options. Please try again.");
      }
    };

    fetchDropdownOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const checkUserIdExists = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/check-user-id/${userId}`
      );
      return response.data.exists;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return false;
      }
      return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setUserIdError("");

    const userIdExists = await checkUserIdExists(formData.userId);
    if (userIdExists) {
      setUserIdError("User ID already exists. Please choose another one.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/adduser",
        formData
      );
      console.log("User created:", response.data);
      setFormData({
        userId: "",
        userName: "",
        department: "",
        userType: "",
        smsType: "",
      });
    } catch (error) {
      console.error("Error creating user:", error);
      setErrorMessage("Failed to create user. Please try again.");
    }
  };

  return (
    <div className="flex justify-center h-full p-4 bg-gray-100 dark:bg-[#282828] dark:text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-md dark:bg-[#181818] dark:text-white"
      >
        <h2 className="mb-6 text-3xl font-semibold text-center text-gray-700 dark:text-white">
          Create User
        </h2>

        {errorMessage && (
          <div className="mb-4 text-sm text-red-600 dark:text-red-400">
            {errorMessage}
          </div>
        )}
        {userIdError && (
          <div className="mb-4 text-sm text-red-600 dark:text-red-400">
            {userIdError}
          </div>
        )}

        <div className="flex flex-wrap -mx-2">
          <div className="w-full md:w-1/2 px-2 mb-4">
            <label
              htmlFor="userId"
              className="block mb-2 text-sm font-medium text-gray-600 dark:text-white"
            >
              User ID
            </label>
            <input
              type="text"
              id="userId"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#eab308] dark:text-white dark:bg-dark_3"
              required
            />
          </div>
          <div className="w-full md:w-1/2 px-2 mb-4">
            <label
              htmlFor="userName"
              className="block mb-2 text-sm font-medium text-gray-600 dark:text-white"
            >
              User Name
            </label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#eab308] dark:text-white dark:bg-dark_3"
              required
            />
          </div>
          <div className="w-full md:w-1/2 px-2 mb-4">
            <label
              htmlFor="department"
              className="block mb-2 text-sm font-medium text-gray-600 dark:text-white"
            >
              Department
            </label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#eab308] dark:text-white dark:bg-dark_3"
              required
            />
          </div>
          <div className="w-full md:w-1/2 px-2 mb-4">
            <label
              htmlFor="userType"
              className="block mb-2 text-sm font-medium text-gray-600 dark:text-white"
            >
              User Type
            </label>
            <select
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#eab308] dark:text-white dark:bg-dark_3"
              required
            >
              <option value="" disabled>
                Select User Type
              </option>
              {userTypes.map((type) => (
                <option key={type.id} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full px-2 mb-4">
            <label
              htmlFor="smsType"
              className="block mb-2 text-sm font-medium text-gray-600 dark:text-white"
            >
              SMS Type
            </label>
            <select
              id="smsType"
              name="smsType"
              value={formData.smsType}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#eab308] dark:text-white dark:bg-dark_3"
              required
            >
              <option value="" disabled>
                Select SMS Type
              </option>
              {smsTypes.map((sms) => (
                <option key={sms.id} value={sms.type}>
                  {sms.description}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="w-full mt-4 px-4 py-2 text-white bg-[#eab308] rounded-md hover:bg-[#ce9b03] focus:outline-none focus:ring-2 focus:ring-[#a0801f]"
        >
          Create User
        </button>
      </form>
    </div>
  );
};

export default CreateUser;
