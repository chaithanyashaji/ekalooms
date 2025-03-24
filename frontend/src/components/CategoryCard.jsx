import React, { memo } from "react";
import { useNavigate } from "react-router-dom";

// Memoized CategoryCard for performance optimization
const CategoryCard = memo(({ category }) => {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col items-center cursor-pointer"
      onClick={() => navigate(`/collection?category=${category.name}`)}
    >
      <div className="w-20 h-24 sm:w-24 sm:h-28 lg:w-28 lg:h-32 shadow-xl border border-[#65000B] rounded-t-full overflow-hidden">
      <img
  loading="lazy"
  src={`${category.image}?w=112&h=134&c_fill&f=auto&q=70`} // Automatically pick best format (e.g., WebP)
  srcSet={`
    ${category.image}?w=112&h=134&c_fill&f=auto&q=70 1x,
    ${category.image}?w=224&h=268&c_fill&f=auto&q=70 2x
  `}
  sizes="(max-width: 640px) 80px, 112px"
  alt={category.name}
  width="112"
  height="134"
  className="w-full h-full object-cover"
/>

      </div>
      <p className="mt-2 mb-2 text-xs sm:text-sm lg:text-base prata-regular text-[#65000B] font-medium text-center">
        {category.name}
      </p>
    </div>
  );
});

// CategorySection Component
const CategorySection = () => {
  const categories = [
    {
      name: "Saree",
      image: "https://res.cloudinary.com/dzzhbgbnp/image/upload/v1742193305/cpink_jh9nma.jpg",
      slug: "Saree",
    },
    {
      name: "Kurta Sets",
      image: "https://res.cloudinary.com/dzzhbgbnp/image/upload/v1742725848/sk_pur2_woxd8l.jpg", // Replace with relevant image if needed
      slug: "Kurta-Sets",
    },
    {
      name: "Co-ords",
      image: "https://res.cloudinary.com/dzzhbgbnp/image/upload/v1742802137/dressessk_ttdeds.jpg", // Replace with relevant image if needed
      slug: "Co-ords",
    },
    {
      name: "Dresses",
      image: "https://res.cloudinary.com/dzzhbgbnp/image/upload/v1742147086/sk-ora_nzmoou.jpg", // Replace with relevant image if needed
      slug: "Dresses",
    },
    {
      name: "Home Decor",
      image: "https://res.cloudinary.com/dzzhbgbnp/image/upload/v1735222285/hero_img6_prjeuj.jpg",
      slug: "Home-Decor",
    },
    {
      name: "Dress materials",
      image: "https://res.cloudinary.com/dzzhbgbnp/image/upload/v1742725558/sk_pista_z9db6d.jpg",
      slug: "Dress-materials",
    },
  ];



  return (
    <div className="mt-8">
      <div className="flex sm:grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 overflow-x-auto">
        {categories.map((category) => (
          <CategoryCard key={category.slug} category={category} />
        ))}
      </div>
    </div>
  );
};

export default memo(CategorySection);
