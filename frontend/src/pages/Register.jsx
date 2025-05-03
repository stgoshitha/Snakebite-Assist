import React, { useState } from "react";
import { post } from "../services/ApiEndpoint";
import { useNavigate } from "react-router-dom";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import { LiaHospital } from "react-icons/lia";
import { Link } from "react-router-dom";
import Header from "../components/common/Header";
import logo from "../assets/logo.png";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
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

    if (!formData.name.trim()) newErrors.name = "Name is required";

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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-grow flex flex-col md:flex-row bg-white shadow-inner">
        {/* Register Form Section */}
        <div className="md:w-1/2 flex justify-center items-center px-6 py-12 bg-white">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800">Register</h1>
              <p className="text-sm text-gray-500 mt-2">Create your account to get started.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div className="relative">
                <input
                  type={passwordVisibility.password ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                  onClick={() => togglePasswordVisibility("password")}
                >
                  {passwordVisibility.password ? <MdOutlineVisibilityOff size={25} /> : <MdOutlineVisibility size={25}/>}
                </button>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              <div className="relative">
                <input
                  type={passwordVisibility.confirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                >
                  {passwordVisibility.confirmPassword ? <MdOutlineVisibilityOff size={25} /> : <MdOutlineVisibility size={25}/>}
                </button>
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>

              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="role"
                    value="hospital"
                    checked={formData.role === "hospital"}
                    onChange={handleChange}
                    className="h-5 w-5 cursor-pointer "
                  />
                  <LiaHospital className="text-2xl" />
                  <span className="text-gray-700 select-none">
                    Register as Hospital Owner
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#0f1600] hover:bg-[#6a4c11] text-white font-semibold rounded-lg transition shadow"
              >
                {formData.role === "hospital" ? "Register as Hospital Owner" : "Register"}
              </button>
            </form>

            {errors.form && <p className="text-red-500 text-sm text-center">{errors.form}</p>}

            <div className="text-center text-sm mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-green-700 hover:underline">
                Login
              </Link>
            </div>
          </div>
        </div>

        {/* Info Panel Section */}
        <div className="md:w-1/2 bg-gradient-to-br from-green-100 via-amber-100 to-yellow-50 flex flex-col justify-center px-10 py-12">
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-bold text-green-800 mb-4">Welcome to</h1>
            <div className="flex items-center gap-3 mb-6">
              <img src={logo} className="w-12 h-12" alt="Logo" />
              <span className="text-3xl font-bold text-green-900">Snakebite Assist</span>
            </div>
            <p className="text-gray-700 mb-4 leading-relaxed">
              A national solution to assist snakebite victims quickly and safely.
            </p>

            <ul className="text-gray-600 space-y-2 mb-6 text-base">
              <li>✅ Find nearby hospitals</li>
              <li>✅ Create & read blogs</li>
              <li>✅ Hospital & admin access</li>
              <li>✅ Safety tips for everyone</li>
            </ul>

            <div className="text-sm text-gray-600">
              <p className="mb-1">Already have an account?</p>
              <Link to="/login" className="text-green-800 font-medium hover:underline">
                Login Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
