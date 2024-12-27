import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  WhatsappShareButton, 
  WhatsappIcon, 
  FacebookShareButton, 
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  
} from 'react-share';
import { ShopContext } from '../context/shopcontext';
import { Star, CreditCard, XCircle, Truck } from 'lucide-react';
import RelatedProducts from '../components/RelatedProducts';
import axios from 'axios';
import {FaHeart,FaRegHeart, FaUserAlt, FaStar, FaStarHalfAlt, FaRegStar, FaShareAlt, FaLink } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, backendUrl,wishlist,addToWishlist,removeFromWishlist,token } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [showDescription, setShowDescription] = useState(true);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const isInWishlist = wishlist.some((item) => item._id === productId);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/review/${productId}/showreviews`);
      const data = response.data;

      if (data.success) {
        setReviews(data.reviews);
        setAverageRating(data.averageRating);
        setTotalReviews(data.totalReviews);
      } else {
        
      }
    } catch (error) {
      
    }
  };

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.image[0]);
        return null;
      }
    });
  };

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  useEffect(() => {
    fetchProductData();
    fetchReviews();
  }, [productId, products]);

  const generateStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStars = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;

    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-[#F0997D]" />);
    }

    if (halfStars) {
      stars.push(<FaStarHalfAlt key="half" className="text-[#F0997D]" />);
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-[#F0997D]" />);
    }

    return stars;
  };

  // Copy link to clipboard function
  const copyLinkToClipboard = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.success('Link copied to clipboard!', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }).catch(err => {
     
      toast.error('Failed to copy link', {
        position: "bottom-right",
        autoClose: 3000,
      });
    });
  };
  const handleWishlistClick = () => {
    if (!token) {
      toast.error('Please log in to use the wishlist feature.', {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }
    isInWishlist ? removeFromWishlist(productId) : addToWishlist(productId);
  };

  // Generate share content
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareDescription = productData 
    ? `Check out this amazing ${productData.name} - Only ${currency}${productData.price}! #ShopNow` 
    : '';


    const renderDescription = () => {
      if (!productData.description) {
        return <p className="prata-regular">No description available.</p>;
      }
      return (
        <div
          className="prata-regular rich-text-content"
          dangerouslySetInnerHTML={{
            __html: productData.description,
          }}
        />
      );
    };

    const renderReviews = () => {
      if (reviews.length === 0) {
        return <p className="prata-regular">No reviews yet.</p>;
      }
      return (
        <div className="max-h-150 overflow-y-auto">
          {reviews.map((review) => (
            <div key={review._id} className="border-b py-4">
              {/* Reviewer Info */}
              <div className="flex items-center gap-2">
                <FaUserAlt className="w-4 h-4 text-gray-600" />
                <p className="font-medium prata-regular text-[#9d4a54]">
                  {review.userId.name}
                </p>
              </div>
    
              {/* Review Stars */}
              <div className="flex gap-1">{generateStars(review.rating)}</div>
    
              {/* Review Date */}
              <p className="text-xs text-gray-400 prata-regular">{formatDate(review.date)}</p>
    
              {/* Review Comment */}
              <p className="prata-regular">{review.comment}</p>
            </div>
          ))}
        </div>
      );
    };
    

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">

            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                alt={`Product thumbnail ${index + 1}`}
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%] relative">
  {/* Main Product Image */}
  <img className="w-full h-auto rounded-md shadow" src={image} alt={productData.name} />

  {/* Wishlist and Share Buttons */}
  <div className="absolute top-2 left-2 flex flex-col gap-2 z-10">
    {/* Wishlist Button */}
    <button
      onClick={handleWishlistClick}
      className="p-2 bg-white/90 rounded-full shadow-md hover:bg-gray-100 transition-all"
    >
      {isInWishlist ? (
        <FaHeart className="text-[#A75D5D] w-5 h-5" />
      ) : (
        <FaRegHeart className="text-[#A75D5D] w-5 h-5" />
      )}
    </button>
  </div>

  {/* Share Button */}
  <div className="fixed top-4 right-4 flex flex-col gap-2 z-50">
      <button
        onClick={() => setShowShareOptions(!showShareOptions)}
        className="p-2 bg-white/90 rounded-full shadow-md hover:bg-gray-100 transition-all"
      >
        <FaShareAlt className="text-[#A75D5D] w-5 h-5" />
      </button>

      {/* Share Options Dropdown */}
      {showShareOptions && (
        <div
          className="fixed right-4 top-16 bg-white shadow-lg rounded-lg p-3 flex flex-col gap-3 w-48"
          style={{ zIndex: 9999 }}
        >
          <WhatsappShareButton
            url={shareUrl}
            title={shareDescription}
            className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded transition-all"
          >
            <WhatsappIcon size={24} round />
            <span className="text-sm text-gray-600">WhatsApp</span>
          </WhatsappShareButton>

          <FacebookShareButton
            url={shareUrl}
            quote={shareDescription}
            className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded transition-all"
          >
            <FacebookIcon size={24} round />
            <span className="text-sm text-gray-600">Facebook</span>
          </FacebookShareButton>

          <TwitterShareButton
            url={shareUrl}
            title={shareDescription}
            className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded transition-all"
          >
            <TwitterIcon size={24} round />
            <span className="text-sm text-gray-600">X (Twitter)</span>
          </TwitterShareButton>

          <button
            onClick={copyLinkToClipboard}
            className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded transition-all"
          >
            <FaLink className="text-[#A75D5D]" />
            <span className="text-sm text-gray-600">Copy Link</span>
          </button>
        </div>
      )}
    </div>
</div>

        </div>

        <div className="flex-1">
          <h1 className="font-medium prata-regular text-3xl mt-2 text-[#A75D5D]">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            {generateStars(averageRating)}
            <p className="pl-2 text-[#D3756B] ">({totalReviews})</p>
          </div>
          <p className="mt-5 mb-5 text-2xl font-medium prata-regular text-[#A75D5D]">{currency}{productData.price}</p>
          
          
          {productData.sizes && productData.sizes.length > 0 && (
  <div className="flex flex-col gap-4 my-8">
    <p className="text-[#F0997D] prata-regular">Select Size</p>
    <div className="flex gap-2">
      {productData.sizes.map((item, index) => (
        <button
          onClick={() => setSize(item)}
          className={`border rounded-md py-2 px-4 ${
            item === size ? 'border-[#F0997D] bg-[#FFC3A1]' : 'bg-gray-100'
          }`}
          key={index}
        >
          {item}
        </button>
      ))}
    </div>
  </div>
)}

<button
  onClick={() => {
    if (productData.sizes && productData.sizes.length > 0 && !size) {
      toast.error('Please select a size before adding to cart.', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    addToCart(productData._id, size || null);
  }}
  disabled={!productData.inStock}
  className={`px-8 rounded-md py-3 text-sm ${
    productData.inStock
      ? "text-white bg-gradient-to-r from-[#F0997D] to-[#D3756B] hover:from-[#D3756B] hover:to-[#F0997D]"
      : "text-gray-500 bg-gray-200 cursor-not-allowed"
  }`}
>
  {productData.inStock ? "ADD TO CART" : "OUT OF STOCK"}
</button>


          
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm  text-gray-500 mt-5 flex flex-col gap-2">
      
      <div className="flex items-center gap-2">
        <CreditCard size={16} color="#FFC3A1" />
        <p>Prepaid Orders Only</p>
      </div>
      <div className="flex items-center gap-2">
        <XCircle size={16} color="#A75D5D" />
        <p>No Exchange Policy</p>
      </div>
      <div className="flex items-center gap-2">
        <Truck size={16} color="#F0997D" />
        <p>Standard delivery time 6-7 working days</p>
      </div>
    </div>
        </div>
      </div>

      <div className="mt-10">
      {/* Toggle Buttons */}
      <div className="flex border-b text-sm">
        <button
          onClick={() => setShowDescription(true)}
          className={`px-4 py-2 border prata-regular ${
            showDescription ? "border-2 border-[#F0997D] text-[#A75D5D]" : ""
          }`}
        >
          Description
        </button>
        <button
          onClick={() => setShowDescription(false)}
          className={`px-4 py-2 border prata-regular ${
            !showDescription ? "border-2 border-[#F0997D] text-[#A75D5D]" : ""
          }`}
        >
          Reviews ({totalReviews})
        </button>
      </div>

      {/* Content Section */}
      <div className="px-6 py-6 text-gray-700 text-sm">
        {showDescription ? renderDescription() : renderReviews()}
      </div>
    </div>
  

      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;