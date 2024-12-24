import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets"; // Import the assets

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/collection?category=${category.name}`);
  };

  return (
    <div
      className="flex flex-col items-center cursor-pointer"
      onClick={handleClick}
    >
      <div className="w-24 h-28 shadow-xl border border-[#A75D5D] rounded-t-full overflow-hidden">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover"
        />
      </div>
      <p className="mt-2 mb-2 text-sm prata-regular text-[#A75D5D] font-medium text-center">
        {category.name}
      </p>
    </div>
  );
};

const CategorySection = () => {
  const {
    hero_img1,
    hero_img2,
    hero_img3,
    hero_img4,
    hero_img5,
    hero_img6,
    hero_img7,
    hero_img8,
    hero_img9,
    hero_img41,
    hero_img11,
  } = assets;

  const categories = [
    {
      name: "Saree",
      image: hero_img4,
      slug: "Saree",
    },
    {
      name: "Stitched Suits",
      image: hero_img3,
      slug: "Stitched-Suits",
    },
    {
      name: "Home Decor",
      image: hero_img6,
      slug: "Home-Decor",
    },
    {
      name: "Unstitched Suits",
      image: hero_img8,
      slug: "Unstitched-Suits",
    },
  ];

  return (
    <div className="mt-8">
      {/* Mobile: horizontal scroll, Larger screens: grid layout */}
      <div className="overflow-x-auto sm:overflow-x-visible">
        <div className="flex sm:grid sm:grid-cols-4 sm:gap-4 sm:justify-between sm:space-x-0 space-x-8 whitespace-nowrap">
          {categories.map((category, index) => (
            <CategoryCard key={index} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySection;
