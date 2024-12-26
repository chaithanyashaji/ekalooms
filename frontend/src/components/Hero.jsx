import React, { useState, useEffect } from "react";

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [fadeClass, setFadeClass] = useState("opacity-100");

  // Use the Cloudinary URLs directly
  const images = [
    "https://res.cloudinary.com/dzzhbgbnp/image/upload/v1735222243/hero_img1_n4rk9q.jpg",
    "https://res.cloudinary.com/dzzhbgbnp/image/upload/v1735222264/hero_img2_t8gvlm.jpg",
    "https://res.cloudinary.com/dzzhbgbnp/image/upload/v1735222265/hero_img3_akf5rs.jpg",
    "https://res.cloudinary.com/dzzhbgbnp/image/upload/v1735222267/hero_img4_xdmaiq.jpg",
    "https://res.cloudinary.com/dzzhbgbnp/image/upload/v1735222285/hero_img5_lrofwp.jpg",
    "https://res.cloudinary.com/dzzhbgbnp/image/upload/v1735222285/hero_img6_prjeuj.jpg",
    "https://res.cloudinary.com/dzzhbgbnp/image/upload/v1735222286/hero_img7_v3rbfo.jpg",
    "https://res.cloudinary.com/dzzhbgbnp/image/upload/v1735222286/hero_img8_efebfh.jpg",
    "https://res.cloudinary.com/dzzhbgbnp/image/upload/v1735222304/hero_img10_uthgu7.jpg",
  ];

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
  }, [images.length]);

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
