import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const ImageSlider = ({ images, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrev = () => {
    if (currentImageIndex > 0) setCurrentImageIndex(currentImageIndex - 1);
  };

  const handleNext = () => {
    if (currentImageIndex < images.length - 1) setCurrentImageIndex(currentImageIndex + 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white bg-black/60 p-2 rounded-full hover:bg-black/80 transition"
      >
        <X size={24} />
      </button>

      {/* Image Container */}
      <div className="relative max-w-3xl w-full flex items-center justify-center px-4">
        {/* Left Arrow */}
        {currentImageIndex > 0 && (
          <button
            onClick={handlePrev}
            className="absolute left-6 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition"
          >
            <ChevronLeft size={32} />
          </button>
        )}

        <img
          src={images[currentImageIndex]}
          alt={`Slide ${currentImageIndex}`}
          className="max-h-[80vh] w-auto object-contain rounded-lg shadow-xl"
        />

        {currentImageIndex < images.length - 1 && (
          <button
            onClick={handleNext}
            className="absolute right-6 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition"
          >
            <ChevronRight size={32} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageSlider;
