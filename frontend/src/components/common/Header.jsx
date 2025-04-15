import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { post } from "../../services/ApiEndpoint";
import { Logout } from "../../redux/AuthSlice";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import { FaRegNewspaper } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { LiaHospital } from "react-icons/lia";
import { HiOutlineViewGrid } from "react-icons/hi";
import { IoNotificationsOutline } from "react-icons/io5";
import logo from "../../assets/logo.png";

const Header = () => {
  const user = useSelector((state) => state.Auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const hideNav = location.pathname.startsWith("/admin");

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    <header className="bg-[#00448B] rr shadow-md sticky top-0 z-50 ">
      <div className="container mx-auto px-10 py-5 flex items-center justify-between">
        {!hideNav && (
          <Link
            to="/"
            className="text-2xl font-bold text-white flex items-center gap-2"
          >
            <img src={logo} className="w-12" /> <span>Snakebite Assist</span>
          </Link>
        )}

        {!hideNav && (
          <nav className="hidden md:flex gap-6 text-white font-bold font-sans text-xl">
            <Link to="/" className="hover:text-green-600">
              Home
            </Link>
            <Link
              to={
                user?.role === "user" || user?.role === "hospital"
                  ? "/blog"
                  : "/blogs"
              }
              className="hover:text-green-600"
            >
              Blog
            </Link>
            <Link to="/contact" className="hover:text-green-600">
              About
            </Link>
            <Link to="/contact" className="hover:text-green-600">
              Contact
            </Link>
          </nav>
        )}

        {hideNav && <div></div>}

        {user ? (
          <div className="flex items-center gap-5">
            {hideNav && (
              <div>
                <IoNotificationsOutline size={30} />
              </div>
            )}
            <div className="relative" ref={dropdownRef}>
              <button onClick={toggleDropdown}>
                <FaCircleUser
                  size={36}
                  className="text-gray-500 cursor-pointer"
                />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-72 p-4 bg-white rounded-xl shadow-lg border border-gray-200 z-10">
                  <div className="mb-3 py-3 rounded-t-xl text-center bg-gray-100">
                    <p className="font-semibold text-xl text-gray-800">
                      {user.name}
                    </p>
                    <p className="text-sm text-gray-600">{user.email}</p>

                    {(user?.role === "superadmin" ||
                      user?.role === "admin") && (
                      <p className="text-sm text-red-600">{user.role}</p>
                    )}
                  </div>
                  <div>
                    {(user?.role === "user" || user?.role === "hospital") && (
                      <Link to="/userBlog">
                        <div className="flex items-center w-full px-4 py-2 rounded hover:bg-gray-100 transition duration-300">
                          <FaRegNewspaper size={20} />
                          <span className="ml-2 font-semibold">My Blogs</span>
                        </div>
                      </Link>
                    )}

                    {user?.role === "hospital" && (
                      <Link to="/hospital/hospitalprofile">
                        <div className="flex items-center w-full px-4 py-2 rounded hover:bg-gray-100 transition duration-300">
                          <LiaHospital size={20} />
                          <span className="ml-2 font-semibold">
                            Hospital Profile
                          </span>
                        </div>
                      </Link>
                    )}

                    {(user?.role === "admin" ||
                      user?.role === "superadmin") && (
                      <Link to="/admin/adminUsers">
                        <div className="flex items-center w-full px-4 py-2 rounded hover:bg-gray-100 transition duration-300">
                          <HiOutlineViewGrid size={20} />
                          <span className="ml-2 font-semibold">
                            Admin Dashboard
                          </span>
                        </div>
                      </Link>
                    )}

                    <div
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 rounded text-red-500 cursor-pointer hover:bg-red-50 transition duration-300"
                    >
                      <FiLogOut size={20} />
                      <span className="ml-2 font-semibold">Logout</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <Link to="/login">
            <button className="hidden md:block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-300">
              Login
            </button>
          </Link>
        )}

        <div className="md:hidden text-2xl text-gray-700 cursor-pointer">
          <FaBars />
        </div>
      </div>
    </header>
  );
};

export default Header;
