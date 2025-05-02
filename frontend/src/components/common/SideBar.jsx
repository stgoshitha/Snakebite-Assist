import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineViewGrid } from "react-icons/hi";
import { FaChevronDown, FaChevronUp,FaRegHospital,FaRegNewspaper,FaRegUser } from "react-icons/fa";
import { FiArrowDownRight } from "react-icons/fi";
import { VscSnake } from "react-icons/vsc";


const SideBar = () => {
  const user = useSelector((state) => state.Auth.user);
  const [userMgmtOpen, setUserMgmtOpen] = useState(false);
  const [hospitalMgmtOpen, setHospitalMgmtOpen] = useState(false);
  const [blogMgmtOpen, setBlogMgmtOpen] = useState(false);

  return (
    <aside className="w-72 h-screen bg-white shadow-md overflow-y-auto fixed">
      <nav className="flex flex-col text-gray-700 text-base font-medium">
        <div className="px-3 py-6 ">
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold text-green-700 "
          >
            🐍 <span>Snakebite Assist</span>
          </Link>
        </div>

        <div className="px-3 py-4 hover:bg-gray-200 cursor-pointer ">
          <Link
            to="/dashboard"
            className="flex  items-center gap-3 hover:bg-gray-200 hover:text-green-600"
          >
            <HiOutlineViewGrid size={25} /> Dashboard
          </Link>
        </div>

        <div className="px-3 py-4 hover:bg-gray-200 cursor-pointer ">
          <button
            onClick={() => setUserMgmtOpen(!userMgmtOpen)}
            className="flex items-center justify-between w-full   hover:text-green-600"
          >
            <span className="flex items-center gap-3">
              <FaRegUser size={25} /> User Management
            </span>
            {userMgmtOpen ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>

        {userMgmtOpen && (
          <div className=" flex flex-col ">
            {user?.role === "superadmin" && (
              <Link
              to="/admin/allAdmins"
              className="px-3 py-4 hover:bg-gray-200  hover:text-green-600"
            >
              <span className="flex items-center gap-3">
                <FiArrowDownRight size={25} />
                Super Admin & Admin Details
              </span>
            </Link>
            )}
            <Link
              to="/admin/adminUsers"
              className="px-3 py-4 hover:bg-gray-200  hover:text-green-600"
            >
              <span className="flex items-center gap-3">
                <FiArrowDownRight size={25} />
                General User Details
              </span>
            </Link>
          </div>
        )}

        <div className="px-3 py-4 hover:bg-gray-200 hover:text-green-600 cursor-pointer">
          <Link
            to="/snakes"
            className="flex items-center gap-3 hover:text-green-600"
          >
            <VscSnake size={25} /> Snake Information
          </Link>
        </div>

        <div className="px-3 py-4 hover:bg-gray-200 hover:text-green-600 cursor-pointer">
          <button
            onClick={() => setHospitalMgmtOpen(!hospitalMgmtOpen)}
            className="flex items-center justify-between w-full  hover:text-green-600"
          >
            <span className="flex items-center gap-3">
              <FaRegHospital size={25} /> Hospital Management
            </span>
            {hospitalMgmtOpen ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>

        {hospitalMgmtOpen && (
          <div className="flex flex-col">
            <Link
              to="/admin/adminHospitalApproved"
              className="px-3 py-4 hover:bg-gray-200 hover:text-green-600"
            >
              <span className="flex items-center gap-3">
                <FiArrowDownRight size={25} />
                Approved Hospitals
              </span>
            </Link>
            <Link
              to="/admin/adminHospitalNotApproved"
              className="px-3 py-4 hover:bg-gray-200 hover:text-green-600"
            >
              <span className="flex items-center gap-3">
                <FiArrowDownRight size={25} />
                Not Approved Hospitals
              </span>
            </Link>
          </div>
        )}

        <div className="px-3 py-4 hover:bg-gray-200 hover:text-green-600">
          <button
            onClick={() => setBlogMgmtOpen(!blogMgmtOpen)}
            className="flex items-center justify-between w-full hover:text-green-600"
          >
            <span className="flex items-center gap-3">
              <FaRegNewspaper size={25} /> Blog Management
            </span>
            {blogMgmtOpen ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>

        {blogMgmtOpen && (
          <div className="flex flex-col">
            <Link
              to="/admin/adminBlogApproved"
              className="px-3 py-4 hover:bg-gray-200 hover:text-green-600"
            >
              <span className="flex items-center gap-3">
                <FiArrowDownRight size={25} />
                Approved Blogs
              </span>
            </Link>
            <Link
              to="/admin/adminBlogNotApproved"
              className="px-3 py-4 hover:bg-gray-200 hover:text-green-600"
            >
              <span className="flex items-center gap-3">
                <FiArrowDownRight size={25} />
                Not Approved Hospitals
              </span>
            </Link>
          </div>
        )}

      </nav>
    </aside>
  );
};

export default SideBar;
