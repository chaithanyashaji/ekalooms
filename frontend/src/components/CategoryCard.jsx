import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';

const CategoryCard = memo(({ category }) => {
  const navigate = useNavigate();
  
  return (
    <div
      className="flex flex-col items-center cursor-pointer"
      onClick={() => navigate(`/collection?category=${category.name}`)}
    >
      <div className="w-20 h-24 sm:w-24 sm:h-28 lg:w-28 lg:h-32 shadow-xl border border-[#A75D5D] rounded-t-full  overflow-hidden">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <p className="mt-2 mb-2 text-xs sm:text-sm lg:text-base prata-regular text-[#A75D5D] font-medium text-center">
        {category.name}
      </p>
    </div>
  );
});

const CategorySection = () => {
  const categories = [
    {
      name: "Saree",
      image: "https://res.cloudinary.com/dzzhbgbnp/image/upload/v1735222267/hero_img4_xdmaiq.jpg",
      slug: "Saree"
    },
    {
      name: "Stitched Suits",
      image: "https://res.cloudinary.com/dzzhbgbnp/image/upload/v1735222265/hero_img3_akf5rs.jpg",
      slug: "Stitched-Suits"
    },
    {
      name: "Home Decor",
      image: "https://res.cloudinary.com/dzzhbgbnp/image/upload/v1735222285/hero_img6_prjeuj.jpg",
      slug: "Home-Decor"
    },
    {
      name: "Unstitched Suits",
      image: "https://res.cloudinary.com/dzzhbgbnp/image/upload/v1735222286/hero_img8_efebfh.jpg",
      slug: "Unstitched-Suits"
    }
  ];

  return (
    <div className="mt-8">
      <div className="flex sm:grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 overflow-x-auto">
        {categories.map((category) => (
          <CategoryCard key={category.slug} category={category} />
        ))}
      </div>
    </div>
  );
};

export default memo(CategorySection);