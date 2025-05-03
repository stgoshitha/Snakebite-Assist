import React, { useState } from "react";
import { post } from "../services/ApiEndpoint";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SetUser } from "../redux/AuthSlice";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import Header from "../components/common/Header";
import logo from "../assets/logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
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

  //form validation
  const validateForm = () => {
    let newErrors = {};

    //email
    if (!email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Invalid email format";

    //password
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters long";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const request = await post("/api/auth/login", { email, password });
      const response = request.data;

      if (request.status === 200 && response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        dispatch(SetUser(response.user));

        if (response.user.role === "superadmin") {
          navigate("/admin");
        } else if (response.user.role === "admin") {
          navigate("/admin");
        } else if (response.user.role === "hospital") {
          navigate("/hospital");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      console.error(err);
      setErrors({ form: "Invalid email or password" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-grow flex flex-col md:flex-row bg-white shadow-inner">
        {/* Login Form Section */}
        <div className="md:w-1/2 flex justify-center items-center px-6 py-12 bg-white">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800">Login</h1>
              <p className="text-sm text-gray-500 mt-2">Welcome back! Please enter your credentials.</p>
            </div>
  
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
  
              <div className="relative">
                <input
                  type={passwordVisibility.password ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                  onClick={() => togglePasswordVisibility("password")}
                >
                  {passwordVisibility.password ? <MdOutlineVisibilityOff size={25}/> : <MdOutlineVisibility size={25}/>}
                </button>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>
  
              <button
                type="submit"
                className="w-full py-3 bg-[#0f1600] hover:bg-[#6a4c11] text-white font-semibold rounded-lg transition shadow"
              >
                Login
              </button>
  
              {errors.form && (
                <p className="text-red-500 text-sm text-center">{errors.form}</p>
              )}
            </form>
  
            <div className="text-center text-sm mt-4">
              Don't have an account?{" "}
              <a href="/register" className="text-green-700 hover:underline">
                Register
              </a>
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
              <p className="mb-1">Don’t have an account?</p>
              <a href="/register" className="text-green-800 font-medium hover:underline">
                Register Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
}
export default Login;
