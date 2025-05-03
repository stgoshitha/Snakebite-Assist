import React from 'react';
import { FaHospitalAlt, FaMicroscope } from 'react-icons/fa';
import { GiSnake } from 'react-icons/gi';
import { MdMedicalServices } from 'react-icons/md';
import { BiMicrophone } from 'react-icons/bi';

const services = [
  {
    icon: <FaHospitalAlt size={32} className="text-gray-700" />,
    title: 'Nearest Medical Help',
    description: 'Instantly find the nearest hospital, Ayurvedic center, or pharmacy.',
  },
  {
    icon: <GiSnake size={32} className="text-white" />,
    title: 'Snake Guide',
    description: 'Access a detailed database of venomous and non-venomous snakes with images and descriptions.',
    highlight: true,
  },
  {
    icon: <MdMedicalServices size={32} className="text-gray-700" />,
    title: 'First-Aid Assistance',
    description: 'Get step-by-step first-aid guidance for snakebites.',
  },
  {
    icon: <BiMicrophone size={32} className="text-gray-700" />,
    title: 'Voice Search',
    description: 'Get step-by-step first-aid guidance for snakebites.',
  },
];

const ServicesSection = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-[#f5f5f5] py-10">
      <h2 className="text-4xl font-semibold mb-10 text-[#0f1600]">Our Services</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl px-4">
        {services.map((service, index) => (
          <div
            key={index}
            className={`rounded-2xl p-6 shadow-md text-center ${
              service.highlight
                ? 'bg-[#0f1600] text-white'
                : 'bg-white text-black'
            }`}
          >
            <div className="mb-4 flex justify-center">{service.icon}</div>
            <h3 className="text-xl font-bold mb-2">{service.title}</h3>
            <p className="text-sm">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesSection;
