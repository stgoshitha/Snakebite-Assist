import React, { useState } from "react";
import { post } from "../services/ApiEndpoint";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SetUser } from "../redux/AuthSlice";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import Header from "../components/common/Header";

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
    <div>
      <Header/>
    <div className="flex justify-center mt-5">
      <div className="p-6 w-96 bg-white rounded">
        <h1 className="text-2xl mb-4 text-center font-bold">Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div className="relative">
            <input
              type={passwordVisibility.password ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Login
          </button>
          {errors.form && (
            <p className="text-red-500 text-sm text-center">{errors.form}</p>
          )}
        </form>

        <label className="text-center block mt-4">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500 underline">
            Register
          </a>
        </label>
      </div>
    </div>
    </div>
  );
};

export default Login;
