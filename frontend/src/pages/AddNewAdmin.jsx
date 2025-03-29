import React, { useState } from "react";
import { post } from "../services/ApiEndpoint";
import { useNavigate } from "react-router-dom";

const AddNewAdmin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "superadmin", // Default role is 'superadmin'
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name" && !/^[A-Za-z\s]*$/.test(value)) {
      return; 
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      newErrors.name = "Full Name can only contain letters and spaces";
    }

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.password.trim()) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (formData.confirmPassword !== formData.password)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await post("/api/auth/register", formData);
      console.log(response.data);
      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      setErrors({ form: err.response?.data?.message || "Registration failed" });
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="p-6 bg-white  rounded-md w-96">
        <h1 className="text-2xl mb-4 text-center font-bold">Register</h1>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="p-2 border rounded focus:outline-none focus:ring-2 mb-6"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="p-2 border rounded focus:outline-none focus:ring-2"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}{" "}
          {/* Email Field */}
          <br />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="p-2 border rounded focus:outline-none focus:ring-2"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
          {/* Password Field */}
          <br />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="p-2 border rounded focus:outline-none focus:ring-2"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
          )}
          {/* Confirm Password Field */}
          <br />
          <div className="flex gap-3">
            <div className="flex gap-1">
              <input
                type="radio"
                name="role"
                value="superadmin"
                checked={formData.role === "superadmin"}
                onChange={handleChange}
                className="h-5 w-5"
              />
              <label className="ml-2 text-justify">Super Admin</label>
            </div>

            <div className="flex gap-1">
              <input
                type="radio"
                name="role"
                value="admin"
                checked={formData.role === "admin"}
                onChange={handleChange}
                className="h-5 w-5"
              />
              <label className="ml-2 text-justify">Admin</label>
            </div>
          </div>
          <br />
          {errors.form && (
            <p className="text-red-500 text-sm text-center">{errors.form}</p>
          )}
          {/* Submit Button */}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add new Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNewAdmin;
