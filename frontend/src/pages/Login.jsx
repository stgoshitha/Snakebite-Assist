import React, { useState } from "react";
import { post } from "../services/ApiEndpoint";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SetUser } from "../redux/AuthSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateForm = () => {
    let newErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Invalid email format";

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
        dispatch(SetUser(response.user));

        if (response.user.role === "superadmin") {
          navigate("/admin");
        }else if (response.user.role === "admin") {
          navigate("/admin")
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
    <div className='flex justify-center  '>
      <div className='p-6 w-96 bg-white rounded'>
        <h1 className="text-2xl mb-4 text-center font-bold">Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          <br/>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          <br/>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Login
          </button>
          {errors.form && <p className="text-red-500 text-sm text-center">{errors.form}</p>}
        </form>

        <label className="text-center block mt-4">
          Don't have an account? {" "}
          <a href="/register" className="text-blue-500 underline">
            Register
          </a>
        </label>
      </div>
    </div>
  );
};

export default Login;
