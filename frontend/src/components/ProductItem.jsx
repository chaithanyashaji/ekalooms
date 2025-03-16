import React, { useContext } from 'react';
import { ShopContext } from '../context/shopcontext';
import { FaHeart, FaRegHeart, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const ProductItem = ({ id, image, name, price, rating, totalReviews, bestseller, description, inStock,sizes,stockQuantity,category,subCategory }) => {
    const { currency, wishlist, addToWishlist, removeFromWishlist, token } = useContext(ShopContext);
    const navigate = useNavigate();
    const isInWishlist = wishlist.some((item) => item._id === id);

    const isOutOfStock =
  !sizes || sizes.length === 0
    ? stockQuantity === 0 || !inStock // For products without sizes, check stockQuantity and inStock
    : sizes.every((size) => size.quantity === 0) || !inStock; // For products with sizes, check if all sizes have quantity 0 or inStock is false


    const generateStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStars = rating % 1 >= 0.5 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStars;

        return (
            <div className="flex items-center text-xs">
                {Array(fullStars).fill().map((_, i) => <FaStar key={`full-${i}`} className="text-[#A75D5D]" />)}
                {halfStars ? <FaStarHalfAlt key="half" className="text-[#A75D5D]" /> : null}
                {Array(emptyStars).fill().map((_, i) => <FaRegStar key={`empty-${i}`} className="text-[#A75D5D]" />)}
            </div>
        );
    };

    return (
        <div className="relative group border-gray-200 hover:shadow-lg transition-shadow duration-300 h-[350px] sm:h-[450px] w-full mt-2 mb-2">
            {/* Wishlist Button */}
            <button
                onClick={() => {
                    if (!token) {
                        navigate("/login");
                    } else {
                        isInWishlist ? removeFromWishlist(id) : addToWishlist(id);
                    }
                }}
                className="absolute top-2 right-2 z-10 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100"
                aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}

            >
                {isInWishlist ? (
                    <FaHeart className="text-[#A75D5D] w-4 h-4" />
                ) : (
                    <FaRegHeart className="text-[#A75D5D] w-4 h-4" />
                )}
            </button>

            {/* Bestseller Badge */}
            {bestseller && (
                <div
                role="status"
                aria-label="This product is a bestseller"
                className="absolute shadow-lg top-2 left-2 bg-white text-[#A75D5D] text-xs px-2 py-0.5 rounded z-10"
              >
                BESTSELLER
              </div>
              
            )}

            {/* Product Image */}
            <Link to={`/product/${id}`} className="block">
                <div className="relative overflow-hidden">
                    <img
                        className="w-full h-[250px] sm:h-[320px] rounded-md shadow-lg border border-[#e6dede] object-cover group-hover:scale-105 transition-transform duration-300 "
                        src={image[0]}
                        alt={`Image of ${name}`}
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>

                    {/* Out of Stock Badge */}
                    {isOutOfStock && (
                        <div role="status" aria-label="Out of Stock" className="absolute bottom-2 right-2 bg-[#A75D5D] text-white text-xs px-2 py-1 rounded shadow-md">

                            OUT OF STOCK
                        </div>
                    )}
                </div>
            </Link>

            {/* Product Details */}
            <div className="p-2 text-left">
                {/* Brand/Product Name */}
                <h3 className="text-md font-bold prata-regular text-gray-900 truncate tracking-wider">
                    {name}
                </h3>

                {/* Product Description */}
               <p className='text-xs Outfit text-gray-600 truncate tracking-wider'>{category} - {subCategory}</p>

                {/* Price and Ratings */}
                <div className="mt-1 prata-regular flex flex-wrap items-center gap-2">
  <span
    role="text"
    style={{ color: "#A75D5D" }}
    aria-label={`Price: ${currency}${price}`}
  >
    {currency}{price}
  </span>
  <span
    role="text"
    aria-label={`Original price: ${currency}${(Math.round(price * 1.2 * 100) / 100).toFixed(0)}`}
    className="text-xs line-through text-gray-600"
>
    {currency}{(Math.round(price * 1.2 * 100) / 100).toFixed(0)}
</span>


  <span
    role="text"
    aria-label="30% discount on the original price"
    className="text-xs text-[#A75D5D] font-semibold"
  >
    30% OFF
  </span>
</div>


                {/* Ratings */}
                <div className="flex items-center gap-1 mt-1">
                    {totalReviews > 0 && (
                        <>
                            {generateStars(rating)}
                            <span className="text-xs text-gray-500 ml-1">
                                ({totalReviews})
                            </span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductItem;
