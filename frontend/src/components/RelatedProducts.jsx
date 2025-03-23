import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/shopcontext";
import Title from "./Title";
import ProductItem from "../components/ProductItem";

const RelatedProducts = ({ category, subCategory }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = products.slice();
      productsCopy = productsCopy.filter(
        (item) => category === item.category && subCategory === item.subCategory
      );
      setRelated(productsCopy); // Show all related products
    }
  }, [products, category, subCategory]);

  return (
    <div className="my-8">
      {/* Title */}
      <div className="text-center text-xl py-2">
        <Title text1={"You may "} text2={"also like"} />
      </div>

      {/* Horizontal Scroll */}
      <div className="overflow-x-auto">
        <div className="flex gap-4">
          {related.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-40 sm:w-48 md:w-56 lg:w-64"
            >
              <ProductItem
                id={item._id}
                price={item.price}
                image={item.image}
                name={item.name}
                rating={item.averageRating || 0}
                totalReviews={item.totalReviews}
                bestseller={item.bestseller}
                inStock={item.inStock}
                category={item.category}
              subCategory={item.subCategory}
              currentPage={1}
  categoryFilter={[]}
  subCategoryFilter={[]}
  sortType={'relevant'}
              />
            </div>
          ))}
        </div>
      </div>
      <hr/>
    </div>
  );
};

export default RelatedProducts;
