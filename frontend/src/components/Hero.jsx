import React, { useState, useEffect, useCallback,useContext, memo } from "react";
import axios from "axios";
import { ShopContext } from '../context/shopcontext';// Ensure backend URL is used dynamically

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
  const [images, setImages] = useState([]); // Stores fetched images
  const [currentImage, setCurrentImage] = useState(0);
  const {backendUrl} = useContext(ShopContext);
  const [fadeClass, setFadeClass] = useState("opacity-100 transition-opacity duration-1000 ease-in-out");
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error handling

  // 🔥 Fetch featured images from backend
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/featured/list`);
        if (res.data.success) {
          setImages(res.data.images);
        }
      } catch (err) {
        setError("Failed to load featured images.");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // 🔄 Auto-change images with fade transition
  const changeImage = useCallback(() => {
    if (images.length === 0) return;
    setFadeClass("opacity-0 transition-opacity duration-500 ease-in-out"); // Fade-out effect
    setTimeout(() => {
      setCurrentImage((prev) => (prev + 1) % images.length || 0);
      setFadeClass("opacity-100 transition-opacity duration-1000 ease-in-out"); // Fade-in new image
    }, 500);
  }, [images.length]);

  useEffect(() => {
    if (images.length > 0) {
      const interval = setInterval(changeImage, 5000);
      return () => clearInterval(interval);
    }
  }, [changeImage, images.length]);

  return (
    <div className="flex flex-col sm:flex-row border border-gray-400">
      <HeroText />
      <div className="w-full sm:w-1/2 overflow-hidden">
        {loading ? (
          <p className="text-center text-gray-500">Loading images...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : images.length > 0 ? (
          <picture>
            <source
              media="(min-width: 1024px)"
              srcSet={`${images[currentImage].url}?w=1024&h=768&c_fill`}
            />
            <source
              media="(min-width: 640px)"
              srcSet={`${images[currentImage].url}?w=768&h=512&c_fill`}
            />
            <img
              className={`w-full h-[450px] sm:h-[600px] md:h-[700px] object-cover transition-opacity duration-1000 ease-in-out ${fadeClass}`}
              src={images[currentImage]?.url || ""}
              loading="lazy"
              alt="Featured Collection"
            />
          </picture>
        ) : (
          <p className="text-center text-gray-500">No featured images available.</p>
        )}
      </div>
    </div>
  );
};

export default memo(Hero);
