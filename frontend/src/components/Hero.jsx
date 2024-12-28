import React, { useState, useEffect, useCallback, memo } from "react";

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
  const [fadeClass, setFadeClass] = useState("opacity-100");

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
    {
      src: "https://res.cloudinary.com/dzzhbgbnp/image/upload/v1735222265/hero_img3_akf5rs.jpg",
      alt: "Hero Image 3",
      width: 1920,
      height: 1080,
    },
    {
      src: "https://res.cloudinary.com/dzzhbgbnp/image/upload/v1735222267/hero_img4_xdmaiq.jpg",
      width: 1920,
      height: 1080,
    },
    {
      src: "https://res.cloudinary.com/dzzhbgbnp/image/upload/v1735222285/hero_img5_lrofwp.jpg",
      width: 1920,
      height: 1080,
    },
    {
      src: "https://res.cloudinary.com/dzzhbgbnp/image/upload/v1735222285/hero_img6_prjeuj.jpg",
      width: 1920,
      height: 1080,
    },
    {
      src: "https://res.cloudinary.com/dzzhbgbnp/image/upload/v1735222286/hero_img7_v3rbfo.jpg",
      width: 1920,
      height: 1080,
    },
    {
      src: "https://res.cloudinary.com/dzzhbgbnp/image/upload/v1735222286/hero_img8_efebfh.jpg",
      width: 1920,
      height: 1080,
    },
    {
      src: "https://res.cloudinary.com/dzzhbgbnp/image/upload/v1735222304/hero_img10_uthgu7.jpg",
      width: 1920,
      height: 1080,
    },

  ];

  const changeImage = useCallback(() => {
    setFadeClass("opacity-0");
    setTimeout(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
      setFadeClass("opacity-100");
    }, 800);
  }, [images.length]);

  useEffect(() => {
    const interval = setInterval(changeImage, 5000);
    return () => clearInterval(interval);
  }, [changeImage]);

  return (
    <div className="flex flex-col sm:flex-row border border-gray-400">
      <HeroText />
      <div className="w-full sm:w-1/2 overflow-hidden">
        <picture>
          <source
            media="(min-width: 1024px)"
            srcSet={`${images[currentImage].src}?w=1024&h=768&c_fill`}
          />
          <source
            media="(min-width: 640px)"
            srcSet={`${images[currentImage].src}?w=768&h=512&c_fill`}
          />
          <img
            className={`w-full h-[450px] sm:h-[600px] md:h-[700px] object-cover transition-opacity duration-1000 ease-in-out ${fadeClass}`}
            src={images[currentImage].src}
            alt={images[currentImage].alt}
            width={images[currentImage].width}
            height={images[currentImage].height}
            loading={currentImage === 0 ? "eager" : "lazy"}
          />
        </picture>
      </div>
    </div>
  );
};

export default memo(Hero);
