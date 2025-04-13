import React, { useState } from "react";
import { post } from "../services/ApiEndpoint";
import { useNavigate } from "react-router-dom";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import { LiaHospital } from "react-icons/lia";
import { Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "user", 
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

  //form validation
  const validateForm = () => {
    let newErrors = {};

    //email
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email format";

    //pasword
    if (!formData.password.trim()) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    //confirm password
    if (formData.confirmPassword !== formData.password)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await post("/api/auth/register", formData);
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <div className="relative gap-1">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="p-2 w-full border rounded focus:outline-none focus:ring-2 "
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
              className="p-2 w-full border rounded focus:outline-none focus:ring-2 "
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
              type={passwordVisibility.password ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="p-2 w-full border rounded focus:outline-none focus:ring-2 "
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

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="role"
                value="hospital"
                checked={formData.role === "hospital"}
                onChange={handleChange}
                className="h-5 w-5 cursor-pointer"
              />
              <LiaHospital className="text-2xl" />
              <span className="text-gray-700 select-none">
                Register as Hospital Owner
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="px-4 py-2 mt-5 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {formData.role === "hospital"
              ? "Register as Hospital Owner"
              : "Register"}
          </button>
        </form>
        {errors.form && (
          <p className="text-red-500 text-sm text-center">{errors.form}</p>
        )}

        <p className="text-center mt-5">
          Already have an account?{" "}
          <Link to={'/login'} className="text-blue-500 underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
