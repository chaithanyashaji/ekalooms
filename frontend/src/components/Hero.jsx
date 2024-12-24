import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [fadeClass, setFadeClass] = useState("opacity-100");

  const images = [
    assets.hero_img1,
    assets.hero_img3,
    assets.hero_img2,
    assets.hero_img4,
    assets.hero_img7,
    assets.hero_img5,
    assets.hero_img6,
    assets.hero_img8,
    assets.hero_img10,
  ]; // Add more images as required

  useEffect(() => {
    const interval = setInterval(() => {
      // Start fade-out
      setFadeClass("opacity-0");
      setTimeout(() => {
        // Change image and start fade-in
        setCurrentImage((prevImage) => (prevImage + 1) % images.length);
        setFadeClass("opacity-100");
      }, 800); // Duration of fade-out effect (matches CSS transition duration)
    }, 5000); // Total interval for each image (4 seconds display + 1 second transition)
    return () => clearInterval(interval); // Clear interval on unmount
  }, []);

  return (
    <div className="flex flex-col sm:flex-row border border-gray-400">
      {/* Hero Left Side */}
      <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0">
        <div className="text-[#A75D5D]">
          <div className="flex items-center gap-2">
            <p className="w-8 md:w-11 h-[2px] bg-[#A75D5D]"></p>
            <p className="font-medium text-sm md:text-base">OUR BESTSELLERS</p>
          </div>
          <h1 className="prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed">
            Latest Arrivals
          </h1>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm md:text-base">SHOP NOW</p>
            <p className="w-8 md:w-11 h-[2px] bg-[#A75D5D]"></p>
          </div>
        </div>
      </div>

      {/* Hero Right Side - Image with Smooth Transition */}
      <div className="w-full sm:w-1/2 overflow-hidden">
        <img
          className={`w-full h-[500px] sm:h-[600px] md:h-[700px] object-cover transition-opacity duration-1000 ease-in-out ${fadeClass}`}
          src={images[currentImage]} // Dynamically change image based on state
          alt="Hero"
        />
      </div>
    </div>
  );
};

export default Hero;
