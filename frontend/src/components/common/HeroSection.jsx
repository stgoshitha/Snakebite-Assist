import React from "react";
import AutocompleteSearch from "../AutocompleteSearch";
import logo from "../../assets/logo.png";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const user = useSelector((state) => state.Auth.user);
  const navigate = useNavigate();

  return (
    <section className="relative h-screen flex justify-center bg-gradient-to-r from-[#557512] to-[#d5aa54] overflow-hidden">
      <div className="z-10 border-white/20 rounded-3xl  p-16 text-center animate-fade-in space-y-6">
        <div className="flex justify-center items-center space-x-5">
          <img src={logo} alt="Snake Icon" className="w-20 h-20" />
          <h1 className="text-7xl font-extrabold text-white drop-shadow-lg">
            Bitten by a snake?
          </h1>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg">
          Stay calm!
        </h1>

        <div className="absolute inset-0 flex justify-center z-20 px-4 top-65 ">
          <div className="w-[60%]">
            <AutocompleteSearch />
          </div>

          <div className="absolute top-1/5 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center space-y-4">
            <button
              className="bg-[#0f1600] hover:bg-[#6a4c11] text-white text-lg font-semibold px-8 py-4 rounded-full shadow-md transition duration-300 ease-in-out"
              onClick={() => navigate("/nearestHospital")}
            >
              Get Nearest Hospital
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
