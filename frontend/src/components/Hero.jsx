import React, { useState, useEffect, useCallback, memo } from "react";

const images = [
  {
    src: "https://res.cloudinary.com/dzzhbgbnp/image/upload/v1735222243/hero_img1_n4rk9q.jpg",
    alt: "Hero Image 1",
    width: 1920,
    height: 1080,
  },
  {
    src: "https://res.cloudinary.com/dzzhbgbnp/image/upload/v1735222264/hero_img2_t8gvlm.jpg",
    alt: "Hero Image 2",
    width: 1920,
    height: 1080,
  },
  // Add remaining images here...
];

const HeroText = memo(() => (
  <div className="w-full sm:w-1/2 flex items-center justify-center py-5 sm:py-0">
    <div className="text-[#A75D5D]">
      <h1 className="prata-regular text-2xl sm:py-3 lg:text-5xl leading-relaxed">
        Featured Collections
      </h1>
      <div className="flex items-center gap-2">
        <p className="font-semibold text-sm md:text-base">SHOP NOW</p>
        <div className="w-8 md:w-11 h-[2px] bg-[#A75D5D]"></div>
      </div>
    </div>
  </div>
));

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);

  const changeImage = useCallback(() => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(changeImage, 5000);
    return () => clearInterval(interval);
  }, [changeImage]);

  return (
    <div className="flex flex-col sm:flex-row border border-gray-400">
      <HeroText />
      <div className="w-full sm:w-1/2 overflow-hidden relative">
        <img
          className="absolute inset-0 w-full h-[450px] sm:h-[600px] md:h-[700px] object-cover transition-opacity duration-1000 ease-in-out opacity-100"
          src={images[currentImage].src}
          loading={currentImage === 0 ? "eager" : "lazy"}
          alt={images[currentImage].alt}
          width={images[currentImage].width}
          height={images[currentImage].height}
        />
      </div>
    </div>
  );
};

export default memo(Hero);
