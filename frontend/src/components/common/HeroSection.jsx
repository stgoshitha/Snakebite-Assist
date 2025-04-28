import React from "react";
import AutocompleteSearch from "../AutocompleteSearch";
import logo from "../../assets/logo.png";

const HeroSection = () => {
  return (
    <section className="relative flex items-start justify-center h-screen bg-gradient-to-r from-[#000428] to-[#00B4DB] overflow-hidden ">
      <div className="z-10 backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 md:p-12 max-w-5xl w-full text-center animate-fade-in space-y-1 mt-10">
        <div className="flex justify-center items-center space-x-1">
          <img src={logo} alt="Snake Icon" className="w-20 h-20" />
          <h1 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-lg">
            Bitten by a snake?
          </h1>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg">
          Stay calm!
        </h1>

        <div className="mt-10">
          <AutocompleteSearch />
        </div>

        <button className="mt-6 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-full transition duration-300 shadow-lg">
          Get Nearest Hospital
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
