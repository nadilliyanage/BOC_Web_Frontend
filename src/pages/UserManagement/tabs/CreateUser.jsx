import React, { useState } from "react";
import axios from "axios";

const CreateUser = () => {
  const [formData, setFormData] = useState({
    userId: "",
    userName: "",
    department: "",
    userType: "",
    smsType: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/users",
        formData
      );
      console.log("User created:", response.data);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <div className="flex justify-center h-full p-4 bg-gray-100 dark:bg-[#282828] dark:text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-md dark:bg-[#282828] dark:text-white"
      >
        <h2 className="mb-6 text-3xl font-semibold text-center text-gray-700 dark:text-white ">
          Create User
        </h2>
        <div className="flex flex-wrap -mx-2">
          {/* Left Section */}
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
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#eab308] dark:text-black"
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
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#eab308] dark:text-black"
              required
            />
          </div>

          {/* Right Section */}
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
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#eab308] dark:text-black"
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
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#eab308]  dark:text-black"
              required
            >
              <option value="" disabled>
                Select User Type
              </option>
              <option value="2-Opr1">2-Opr1(Promotional SMS)</option>
              <option value="3-Opr2">3-Opr2(Non Promotional SMS)</option>
              <option value="4-Opr3">4-opr3(both)</option>
              <option value="Loan">Loan SMS</option>
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
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#eab308] dark:text-black"
              required
            >
              <option value="" disabled>
                Select SMS Type
              </option>
              <option value="ATM">ATM</option>
              <option value="BSG">BSG Message</option>
              <option value="Branch_loan">Branch Loan Recoveries</option>
              <option value="BOCIT">BOC IT</option>
              <option value="CreditCard">Credit Card</option>
              <option value="InwardRemmitance">Inward Remmitance Alerts</option>
              <option value="Loan">Loan Messages</option>
              <option value="LankaPay">Lanka Pay</option>
              <option value="Marketing">Marketing</option>
              <option value="Remmitance">Remmitance</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full  mt-4 px-4 py-2 text-white bg-[#eab308] rounded-md hover:bg-[#ce9b03] focus:outline-none focus:ring-2 focus:ring-[#a0801f]"
        >
          Create User
        </button>
      </form>
    </div>
  );
};

export default CreateUser;
