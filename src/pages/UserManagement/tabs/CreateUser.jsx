import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FaUserPlus,
  FaUser,
  FaBuilding,
  FaUserShield,
  FaSpinner,
} from "react-icons/fa";

const CreateUser = () => {
  const [formData, setFormData] = useState({
    userId: "",
    userName: "",
    department: "",
    userType: "",
    smsType: "",
  });
  const [userTypes, setUserTypes] = useState([]);
  const [smsTypes, setSmsTypes] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [userIdError, setUserIdError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDropdownOptions = async () => {
      try {
        setIsLoading(true);
        const userTypeResponse = await axios.get(
          "http://localhost:8080/api/v1/user-types"
        );
        setUserTypes(userTypeResponse.data);

        const smsTypeResponse = await axios.get(
          "http://localhost:8080/api/v1/sms-types"
        );
        setSmsTypes(smsTypeResponse.data);
      } catch (error) {
        console.error("Error fetching dropdown options:", error);
        setErrorMessage("Failed to fetch dropdown options. Please try again.");
      } finally {
        setIsLoading(false);
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
    setIsLoading(true);

    try {
      const userIdExists = await checkUserIdExists(formData.userId);
      if (userIdExists) {
        setUserIdError("User ID already exists. Please choose another one.");
        setIsLoading(false);
        return;
      }

      const response = await axios.post(
        "http://localhost:8080/api/v1/adduser",
        formData
      );
      console.log("User created:", response.data);

      Swal.fire({
        icon: "success",
        title: "User Created",
        text: "The user has been successfully created!",
        confirmButtonColor: "#3085d6",
        customClass: {
          popup:
            "bg-white dark:bg-gray-800 dark:text-white border border-gray-600 rounded-lg shadow-lg",
          title: "dark:text-yellow-400 font-bold text-xl",
          htmlContainer: "dark:text-gray-300",
          confirmButton:
            "bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded",
          cancelButton:
            "bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded",
        },
      });

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
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <FaSpinner className="animate-spin text-4xl text-yellow-500" />
        <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center h-full p-4 bg-gray-100 dark:bg-[#282828] dark:text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-md dark:bg-[#282828] dark:text-white"
      >
        <div className="flex items-center mb-6">
          <FaUserPlus className="text-3xl text-yellow-500 mr-3" />
          <h2 className="text-2xl font-bold text-gray-700 dark:text-white">
            Create User
          </h2>
        </div>

        {errorMessage && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-200 rounded-lg">
            {errorMessage}
          </div>
        )}
        {userIdError && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-200 rounded-lg">
            {userIdError}
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="userId"
                className="block mb-2 text-sm font-medium text-gray-600 dark:text-white"
              >
                <FaUser className="inline-block mr-1" />
                User ID
              </label>
              <input
                type="text"
                id="userId"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:text-white dark:bg-dark_3 dark:border-gray-600"
                required
              />
            </div>
            <div>
              <label
                htmlFor="userName"
                className="block mb-2 text-sm font-medium text-gray-600 dark:text-white"
              >
                <FaUser className="inline-block mr-1" />
                User Name
              </label>
              <input
                type="text"
                id="userName"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:text-white dark:bg-dark_3 dark:border-gray-600"
                required
              />
            </div>
            <div>
              <label
                htmlFor="department"
                className="block mb-2 text-sm font-medium text-gray-600 dark:text-white"
              >
                <FaBuilding className="inline-block mr-1" />
                Department
              </label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:text-white dark:bg-dark_3 dark:border-gray-600"
                required
              />
            </div>
            <div>
              <label
                htmlFor="userType"
                className="block mb-2 text-sm font-medium text-gray-600 dark:text-white"
              >
                <FaUserShield className="inline-block mr-1" />
                User Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:text-white dark:bg-dark_3 dark:border-gray-600"
                required
              >
                <option value="">Select User Type</option>
                <option value="ADMIN">Admin</option>
                <option value="USER1">user1</option>
                <option value="USER2">user2</option>
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-6 px-4 py-3 text-white bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
        >
          <FaUserPlus className="mr-2" />
          Create User
        </button>
      </form>
    </div>
  );
};

export default CreateUser;
