import React, { useState } from "react";
import { post } from "../services/ApiEndpoint";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SetUser } from "../redux/AuthSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(email, password);
    try {
      const request = await post("/api/auth/login", { email, password });
      const response = request.data;
      console.log(response.token);
      if (request.status === 200 && response.token) {
        localStorage.setItem("token", response.token);
        // localStorage.setItem("user", response.user._id);
        dispatch(SetUser(response.user));

        if (
          response.user.role === "admin" || response.user.role === "superadmin"
        ) {
          navigate("/admin");
        } else if (response.user.role === "hospital") {
          navigate("/hospital");
        } else if (response.user.role === "user") {
          navigate("/");
        }
        
      }
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div>
        <h1>
          Login
        </h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            autoComplete="email"
            className="border-2 border-black mt-2 mb-2 ml-2"
            
          /><br/>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            autoComplete="current-password"
            className="border-2 border-black mb-2 ml-2"
          /><br/>
          <button
            type="submit"
            className="mt-4 px-4 py-2 w-40 bg-green-600 text-white ml-2 "
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
