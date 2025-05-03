import React, { useState } from "react";
import { post } from "../services/ApiEndpoint";
import { useNavigate } from "react-router-dom";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import Header from "../components/common/Header";
import SideBar from "../components/common/SideBar";

const AddNewAdmin = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "superadmin",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Handle form data changes
  const handleChange = ({ target: { name, value } }) => {
    if (name === "name" && !/^[A-Za-z\s]*$/.test(value)) {
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    //all
    Object.keys(formData).forEach((field) => {
      if (!formData[field].trim()) {
        newErrors[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is required`;
      }
    });

    //name
    if (formData.name && !/^[A-Za-z\s]+$/.test(formData.name)) {
      newErrors.name = "Full Name can only contain letters and spaces";
    }

    //email
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    //password
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    //confirm password
    if (
      formData.confirmPassword &&
      formData.confirmPassword !== formData.password
    ) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await post("/api/auth/register", formData);
      alert("Admin added successfully");
      navigate("/admin/allAdmins");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed";
      setErrors({ form: errorMessage });
    }
  };

  return (
    <div className="flex gap-1">
      <div><SideBar/></div>
      <div className="ml-70 flex flex-col overflow-auto w-full h-screen">
      <Header/>
      <div className="flex justify-start items-center">
      <div className="relative px-20 py-10 bg-white rounded-md min-w-[600px]">
        <div className="absolute right-15 top-5 ">
          <button
            onClick={() => navigate("/admin/allAdmins")}
            className="absolute text-gray-500 text-xl cursor-pointer"
          >
            <IoClose size={35} className="absolute text-2xl" />
          </button>
        </div>
        <h1 className="text-2xl mt-4 mb-4 text-center font-bold">
          Add New Admin
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative gap-1">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="p-2 w-full border rounded focus:outline-none focus:ring-2"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          <div className="relative gap-1 ">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="p-2 w-full border rounded focus:outline-none focus:ring-1 focus:ring-[#0f1600] "
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div className="relative gap-1">
            <input
              type={passwordVisibility.password ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="p-2 w-full border rounded focus:outline-none focus:ring-1 focus:ring-[#0f1600] "
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-500 text-xl"
              onClick={() => togglePasswordVisibility("password")}
            >
              {passwordVisibility.password ? (
                <MdOutlineVisibilityOff />
              ) : (
                <MdOutlineVisibility />
              )}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          <div className="relative gap-1">
            <input
              type={passwordVisibility.confirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="p-2 w-full border rounded focus:outline-none focus:ring-1 focus:ring-[#0f1600] "
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-500 text-xl"
              onClick={() => togglePasswordVisibility("confirmPassword")}
            >
              {passwordVisibility.confirmPassword ? (
                <MdOutlineVisibilityOff />
              ) : (
                <MdOutlineVisibility />
              )}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="flex gap-5">
            <label className="flex justify-start items-center cursor-pointer">
              <input
                type="radio"
                name="role"
                value="superadmin"
                checked={formData.role === "superadmin"}
                onChange={handleChange}
                className="h-5 w-5 cursor-pointer "
              />
              <span className="ml-2 text-justify ">Super Admin</span>
            </label>

            <label className="flex justify-start items-center cursor-pointer">
              <input
                type="radio"
                name="role"
                value="admin"
                checked={formData.role === "admin"}
                onChange={handleChange}
                className="h-5 w-5 cursor-pointer"
              />
              <span className="ml-2 text-justify">Admin</span>
            </label>
          </div>

          {errors.form && (
            <p className="text-red-500 text-sm text-center">{errors.form}</p>
          )}

          <button
            type="submit"
            className="px-4 py-2 bg-[#0f1600] hover:bg-[#6a4c11] text-white rounded cursor-pointer"
          >
            {formData.role === "superadmin" ? "Add Super Admin" : "Add Admin"}
          </button>
        </form>
      </div>
    </div>
      </div>
    </div>
  );
};

export default AddNewAdmin;
