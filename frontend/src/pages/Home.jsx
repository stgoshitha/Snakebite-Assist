import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { post } from "../services/ApiEndpoint";
import { Logout } from "../redux/AuthSlice";

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
      <h1 className="text-xl font-bold mt-4">{getWelcomeMessage()}</h1>

      {user ? (
        <button
          onClick={handleLogout}
          className="mt-4 px-4 py-2 w-40 bg-red-500 text-white rounded"
        >
          Logout
        </button>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="mt-4 px-4 py-2 w-40  bg-blue-500 text-white rounded"
        >
          Login
        </button>
      )}

      {user?.role === "admin" && (
        <div className="mt-4 space-x-4">
          <button
            onClick={() => navigate("/admin/adminUsers")}
            className="px-4 py-2 bg-purple-500 text-white rounded"
          >
            View User Details
          </button>
          <button
            onClick={() => navigate("/snake-details")}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            View Snake Details
          </button>

          <button
            onClick={() => navigate("/hospital-details")}
            className="px-4 py-2 bg-purple-500 text-white rounded"
          >
            View Hospital Details
          </button>
        </div>
      )}

      {user?.role === "hospital" && (
              <div className="mt-4 space-x-4">
                <button
                  onClick={() => navigate("/hospital/hospitaldash")}
                  className="px-4 py-2 bg-purple-500 text-white rounded"
                >
                  hosital Dashboard
                </button>
              </div>
            )}
    </div>
  );
};

export default Home;
