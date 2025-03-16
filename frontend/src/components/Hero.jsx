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
  const [fadeClass, setFadeClass] = useState("opacity-100 transition-opacity duration-1000 ease-in-out");

  const images = [
    // 🔹 Alternating SK, DM, RM
    { src: "https://res.cloudinary.com/dzzhbgbnp/image/upload/v1742147087/sk-red_f29tby.jpg", alt: "Red Skirt" },
    { src: "https://res.cloudinary.com/dzzhbgbnp/image/upload/v1742147086/sk-white_zbycp1.jpg", alt: "White Skirt" },
    { src: "https://res.cloudinary.com/dzzhbgbnp/image/upload/v1735222286/hero_img7_v3rbfo.jpg", alt: "Hero Image 7" },
    { src: "https://res.cloudinary.com/dzzhbgbnp/image/upload/v1735222304/hero_img10_uthgu7.jpg", alt: "Hero Image 10" }, 
    { src: "https://res.cloudinary.com/dzzhbgbnp/image/upload/v1742147089/sr-r_ait6gs.jpg", alt: "Rust Red Collection" }, // DM
    { src: "https://res.cloudinary.com/dzzhbgbnp/image/upload/v1742147090/rm-purm_nivhwl.jpg", alt: "Purplish Mix" },
    { src: "https://res.cloudinary.com/dzzhbgbnp/image/upload/v1742147086/sk-ora_nzmoou.jpg", alt: "Orange Skirt" }, // SK
    { src: "https://res.cloudinary.com/dzzhbgbnp/image/upload/v1742147087/sk-pink_rnzbyp.jpg", alt: "Pink Skirt" }, // SK
    { src: "https://res.cloudinary.com/dzzhbgbnp/image/upload/v1742147092/dm-brown_orfh57.jpg", alt: "Dark Brown Collection" }, // DM
    { src: "https://res.cloudinary.com/dzzhbgbnp/image/upload/v1742147093/rm-pink_trx93x.jpg", alt: "Pink Collection" },
   
    { src: "https://res.cloudinary.com/dzzhbgbnp/image/upload/v1735222286/hero_img8_efebfh.jpg", alt: "Hero Image 8" }, // RM
    { src: "https://res.cloudinary.com/dzzhbgbnp/image/upload/v1742147087/sk-bla_yfp0ue.jpg", alt: "Black Skirt" }, // SK
    { src: "https://res.cloudinary.com/dzzhbgbnp/image/upload/v1742147091/sk-pur_sxxot0.jpg", alt: "Purple Collection" }, // DM
    { src: "https://res.cloudinary.com/dzzhbgbnp/image/upload/v1742147092/rm-by_jndwym.jpg", alt: "Burgundy Yellow Collection" }, // RM
 
    { src: "https://res.cloudinary.com/dzzhbgbnp/image/upload/v1742147090/dm-red_yp6ac2.jpg", alt: "Red Collection" }, // DM
    { src: "https://res.cloudinary.com/dzzhbgbnp/image/upload/v1742147090/rm-pur_ehmhix.jpg", alt: "Purple Mix Collection" }, // RM
 // SK
   , // RM
 // SK
    { src: "https://res.cloudinary.com/dzzhbgbnp/image/upload/v1742147085/sk-green_lzo9mb.jpg", alt: "Green Skirt" }, // SK

    // 🔹 Additional Hero Images
    { src: "https://res.cloudinary.com/dzzhbgbnp/image/upload/v1735222267/hero_img4_xdmaiq.jpg", alt: "Hero Image 4" },
  
    { src: "https://res.cloudinary.com/dzzhbgbnp/image/upload/v1735222285/hero_img6_prjeuj.jpg", alt: "Hero Image 6" },
  ];

  const changeImage = useCallback(() => {
    setFadeClass("opacity-0 transition-opacity duration-500 ease-in-out"); // Start fade-out
    setTimeout(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
      setFadeClass("opacity-100 transition-opacity duration-1000 ease-in-out"); // Fade-in new image
    }, 500); // Ensure image updates after fade-out completes
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
            loading="lazy"
            alt={images[currentImage].alt}
          />
        </picture>
      </div>
    </div>
  );
};

export default memo(Hero);
