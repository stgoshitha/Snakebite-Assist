import React from "react";
import Header from "../components/common/Header";
import HeroSection from "../components/common/HeroSection";
import Footer from "../components/common/Footer";
import ServicesSection from "../components/common/ServicesSection";


const Home = () => {

  return (
    <div>
      <Header/>
      <HeroSection/>
      <ServicesSection/>
      <Footer/>
    </div>
  );
};

export default Home;
