import React, { useState, useEffect, useCallback, useContext, memo, useRef } from "react";
import axios from "axios";
import { ShopContext } from "../context/shopcontext";
import Spinner from "../components/Spinner"; // Import Spinner

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
  const [images, setImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);
  const { backendUrl } = useContext(ShopContext);
  const [fade, setFade] = useState(true);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(false); // Track individual image loading
  const imageRef = useRef(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/featured/list`);
        if (res.data.success) {
          setImages(res.data.images);
        }
      } catch (err) {
        console.error("Failed to load featured images.");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [backendUrl]);

  const preloadNextImage = useCallback(() => {
    if (images.length > 0) {
      const nextImage = new Image();
      nextImage.src = images[(currentImage + 1) % images.length]?.url || "";
    }
  }, [currentImage, images]);

  useEffect(() => {
    if (images.length > 0) {
      preloadNextImage();
      const interval = setInterval(() => {
        setFade(false); // Start fade-out
        setTimeout(() => {
          setCurrentImage((prev) => (prev + 1) % images.length);
          setFade(true); // Fade-in new image
          setImageLoading(true); // Show spinner for new image
        }, 500); // Change image **after** fade-out completes
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [images.length, preloadNextImage]);

  return (
    <div className="flex flex-col sm:flex-row border border-gray-400">
      <HeroText />
      <div className="w-full sm:w-1/2 relative flex items-center justify-center overflow-hidden h-[450px] sm:h-[600px] md:h-[700px]">
        {loading || images.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50">
            <Spinner /> {/* Spinner for initial image loading */}
          </div>
        ) : (
          <picture className="relative w-full h-full">
            <source
              media="(min-width: 1024px)"
              srcSet={`${images[currentImage]?.url}?w=1024&h=768&c_fill`}
            />
            <source
              media="(min-width: 640px)"
              srcSet={`${images[currentImage]?.url}?w=768&h=512&c_fill`}
            />

            {/* Spinner in the center of Featured Collection image */}
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/30 z-10">
                <Spinner />
              </div>
            )}

            <img
              ref={imageRef}
              className={`w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${fade ? "opacity-100" : "opacity-0"}`}
              src={images[currentImage]?.url || ""}
              alt="Featured Collection"
              onLoad={() => setImageLoading(false)} // Hide spinner when image loads
              onError={() => setImageLoading(false)} // Hide spinner if image fails to load
            />
          </picture>
        )}
      </div>
    </div>
  );
};

export default memo(Hero);
