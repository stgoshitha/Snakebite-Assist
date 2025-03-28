import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { post } from "../services/ApiEndpoint";
import { Logout } from "../redux/AuthSlice";

import AutocompleteSearch from "../components/AutocompleteSearch";

const Home = () => {
  const user = useSelector((state) => state.Auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getWelcomeMessage = () => {
    if (!user) return "Welcome, Guest";
    switch (user.role) {
      case "admin":
        return "Welcome, Admin";
      case "hospital":
        return "Welcome, Hospital";
      default:
        return "Welcome, User";
    }
  };

  const handleLogout = async () => {
    try {
      const response = await post("/api/auth/logout");
      if (response.status === 200) {
        dispatch(Logout());
        navigate("/");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mt-4 flex justify-center">
        {getWelcomeMessage()}
      </h1>

      {user ? (
        <div className="flex justify-center items-center">
          <button
            onClick={handleLogout}
            className="mt-4 mb-4 px-4 py-2 w-40 bg-red-500 text-white rounded"
          >
            Logout
          </button>
        </div>
      ) : (
        <div>
          <div className="flex justify-center items-center">
            <button
              onClick={() => navigate("/login")}
              className="mt-4 mb-4 px-4 py-2 w-40  bg-blue-500 text-white rounded"
            >
              Login
            </button>
          </div>
          <AutocompleteSearch />
        </div>
      )}

      {user?.role === "admin" && (
        <div className="mt-4 space-x-4">
          <button
            onClick={() => navigate("/admin/adminUsers")}
            className="px-4 py-2 bg-zinc-600 text-white rounded"
          >
            View User Details
          </button>
          <button
            onClick={() => navigate("/admin/snake-details")}
            className="px-4 py-2 bg-zinc-600 text-white rounded"
          >
            View Snake Details
          </button>

          <button
            onClick={() => navigate("/admin/adminHospitalApproved")}
            className="px-4 py-2 bg-zinc-600 text-white rounded"
          >
            View Hospital Approved Details
          </button>
          <button
            onClick={() => navigate("/admin/adminHospitalNotApproved")}
            className="px-4 py-2 bg-zinc-600 text-white rounded"
          >
            View Hospital Not Approved Details
          </button>
        </div>
      )}

      {user?.role === "hospital" && (
        <div className="mt-4 space-x-4">
          <button
            onClick={() => navigate("/hospital/hospitalprofile")}
            className="px-4 py-2 bg-zinc-600 text-white rounded"
          >
            Hosital Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
