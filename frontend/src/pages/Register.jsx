import React, { useState } from "react";
import { post } from "../services/ApiEndpoint";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "user", // Default role is 'user'
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, checked } = e.target;

    if (name === "role") {
      setFormData((prevData) => ({
        ...prevData,
        role: checked ? value : "user", // Default to 'user' when unchecked
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const validateForm = () => {
    let newErrors = {};

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
      <div className="p-6 bg-white rounded-md w-96">
        <h1 className="text-2xl mb-4 text-center font-bold">Register</h1>
        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* Email Field */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="p-2 border rounded focus:outline-none focus:ring-2 "
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          <br />

          {/* Password Field */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="p-2 border rounded focus:outline-none focus:ring-2 "
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          <br />

          {/* Confirm Password Field */}
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="p-2 border rounded focus:outline-none focus:ring-2 "
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
          <br />

          {/* Role Selection with checkbox */}
          <div className="flex gap-3">
            <input
              type="checkbox"
              name="role"
              value="hospital"
              checked={formData.role === "hospital"}
              onChange={handleChange}
              className="h-5 w-5"
            />
            <label className="ml-2 text-justify">
              Select if you want to register as a hospital owner
            </label>
          </div>
          <br />

          {/* Display API error message */}
          {errors.form && <p className="text-red-500 text-sm text-center">{errors.form}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Register
          </button>
        </form>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
