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
import {FaHeart,FaRegHeart, FaUserAlt, FaStar, FaStarHalfAlt, FaRegStar, FaShareAlt, FaLink,FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Title from '../components/Title';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, backendUrl,wishlist,addToWishlist,removeFromWishlist,token } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');
  const [guestName, setGuestName] = useState('');
const [guestEmail, setGuestEmail] = useState('');
const [reviewRating, setReviewRating] = useState(0);
const [reviewComment, setReviewComment] = useState('');
const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [showDescription, setShowDescription] = useState(true);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const isInWishlist = wishlist.some((item) => item._id === productId);
  const [showSizeChart, setShowSizeChart] = useState(false);


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
      stars.push(<FaStar key={`full-${i}`} className="text-[#67000b]" />);
    }

    if (halfStars) {
      stars.push(<FaStarHalfAlt key="half" className="text-[#67000b]" />);
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-[#67000b]" />);
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
        return <p className=" text-gray-600">No description available.</p>;
      }
      return (
        <div
          className="rich-text-content  text-gray-600"
          dangerouslySetInnerHTML={{
            __html: productData.description,
          }}
        />
      );
    };
    


const submitReview = async () => {
    if (!reviewRating || !reviewComment || (!token && (!guestName || !guestEmail))) {
        toast.error('All fields are required.', {
            position: "bottom-right",
            autoClose: 3000,
        });
        return;
    }

    try {
        setIsSubmittingReview(true);
        const reviewData = token
            ? { productId, rating: reviewRating, comment: reviewComment }
            : { productId, rating: reviewRating, comment: reviewComment, guestName, guestEmail };

        const response = await axios.post(
            `${backendUrl}/api/review/submitreview`,
            reviewData,
            token ? { headers: { Authorization: `Bearer ${token}` } } : {}
        );

        const data = response.data;
        if (data.success) {
            toast.success('Review submitted successfully!', {
                position: "bottom-right",
                autoClose: 3000,
            });
            setGuestName('');
            setGuestEmail('');
            setReviewRating(0);
            setReviewComment('');
            fetchReviews(); // Refresh reviews
        } else {
            toast.error(data.message, {
                position: "bottom-right",
                autoClose: 3000,
            });
        }
    } catch (error) {
        toast.error('Failed to submit review. Please try again.', {
            position: "bottom-right",
            autoClose: 3000,
        });
    } finally {
        setIsSubmittingReview(false);
    }
};

const renderWriteReview = () => (
  <div className="mt-6 p-6 bg-white shadow rounded-lg border border-gray-200">
       <Title text1={'WRITE A '} text2={'REVIEW'} />

    {/* Guest Input Fields */}
    {!token && (
      <div className="flex flex-col gap-4 mb-4">
        <input
          type="text"
          placeholder="Your Name"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          className="border border-gray-300 rounded-md p-3 w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#F0997D]"
        />
        <input
          type="email"
          placeholder="Your Email"
          value={guestEmail}
          onChange={(e) => setGuestEmail(e.target.value)}
          className="border border-gray-300 rounded-md p-3 w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#F0997D]"
        />
      </div>
    )}

    {/* Rating Selector */}
    <div className="flex flex-col gap-4">
      <div className="flex gap-1 items-center">
        <label className="text-sm text-gray-600 font-medium">Rating:</label>
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            className={`text-2xl transition ${
              reviewRating >= num ? 'text-[#F0997D]' : 'text-gray-300'
            }`}
            onClick={() => setReviewRating(num)}
          >
            ★
          </button>
        ))}
      </div>

      {/* Comment Input */}
      <textarea
        className="border border-gray-300 rounded-md p-3 w-full h-28 text-sm focus:outline-none focus:ring-2 focus:ring-[#F0997D] resize-none"
        placeholder="Write your comment here..."
        value={reviewComment}
        onChange={(e) => setReviewComment(e.target.value)}
      ></textarea>

      {/* Submit Button */}
      <button
        onClick={submitReview}
        disabled={isSubmittingReview}
        className={`px-6 py-3 rounded-md font-medium transition ${
          isSubmittingReview
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-[#F0997D] to-[#D3756B] text-white hover:from-[#D3756B] hover:to-[#F0997D]'
        }`}
      >
        {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
      </button>
    </div>
  </div>
);


   const renderReviews = () => {
  if (reviews.length === 0) {
    return <p>No reviews yet.</p>;
  }

  return (
    <div className="max-h-150 overflow-y-auto">
      {reviews.map((review) => (
        <div key={review._id} className="border-b py-4">
          {/* Reviewer Info */}
          <div className="flex items-center gap-2">
            <FaUserAlt className="w-4 h-4 text-gray-600" />
            <p className="font-medium prata-regular text-[#9d4a54]">
              {review.userId?.name || review.guestName || "Anonymous"}
            </p>
          </div>

          {/* Review Stars */}
          <div className="flex gap-1">{generateStars(review.rating)}</div>

          {/* Review Date */}
          <p className="text-xs text-gray-400">{formatDate(review.date)}</p>

          {/* Review Comment */}
          <p>{review.comment}</p>
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
        <FaHeart className="text-[#65000B] w-5 h-5" />
      ) : (
        <FaRegHeart className="text-[#65000B] w-5 h-5" />
      )}
    </button>
  </div>

  {/* Share Button */}
  <div className="absolute top-2 right-2 flex flex-col gap-2 z-10">
      <button
        onClick={() => setShowShareOptions(!showShareOptions)}
        className="p-2 bg-white/90 rounded-full shadow-md hover:bg-gray-100 transition-all"
      >
        <FaShareAlt className="text-[#65000B] w-5 h-5" />
      </button>
      

      {/* Share Options Dropdown */}
     {/* Share Options Dropdown */}
{showShareOptions && (
  <div
    className="absolute right-4 top-16 bg-white shadow-lg rounded-lg p-3 flex flex-col gap-3 w-48"
    style={{ zIndex: 9999 }}
  >
    {/* WhatsApp Share */}
    <WhatsappShareButton
      url={shareUrl}
      title={shareDescription}
    >
      <div className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded transition-all">
        <WhatsappIcon size={24} round />
        <span className="text-sm text-gray-600">WhatsApp</span>
      </div>
    </WhatsappShareButton>

    {/* Facebook Share with Image */}
    <FacebookShareButton
      url={shareUrl}
      quote={shareDescription}
      hashtag="#ShopNow"
    >
      <div className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded transition-all">
        <FacebookIcon size={24} round />
        <span className="text-sm text-gray-600">Facebook</span>
      </div>
    </FacebookShareButton>

    {/* Twitter (X) Share with Image */}
    <TwitterShareButton
      url={shareUrl}
      title={shareDescription}
    >
      <div className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded transition-all">
        <TwitterIcon size={24} round />
        <span className="text-sm text-gray-600">X (Twitter)</span>
      </div>
    </TwitterShareButton>

    {/* Copy Link */}
    <button
      onClick={copyLinkToClipboard}
      className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded transition-all"
    >
      <FaLink className="text-[#65000B]" />
      <span className="text-sm text-gray-600">Copy Link</span>
    </button>
  </div>
)}

    </div>
</div>

        </div>

        <div className="flex-1">
          <h1 className="font-medium prata-regular text-3xl mt-2 text-[#65000B]">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            {generateStars(averageRating)}
            <p className="pl-2 text-[#D3756B] ">({totalReviews})</p>
          </div>
          <p className="mt-5 mb-5 text-2xl font-medium prata-regular text-[#65000B]">{currency}{productData.price}</p>
         
          
          {productData.sizes && productData.sizes.length > 0 && (
  <div className="flex flex-col gap-4 my-8">
    <p className="text-[#d08268] prata-regular">Select Size</p>
    
    <div className="flex flex-wrap gap-4">
      {productData.sizes.map((item, index) => (
        <div key={index} className="flex flex-col items-center">
          {/* Size Button */}
          <button
            onClick={() => item.quantity > 0 && setSize(item.size)} // Only allow selection if quantity > 0
            disabled={item.quantity === 0} // Disable button if quantity is 0
            className={`border rounded-md py-2 px-4 ${
              item.size === size ? 'border-[#F0997D] bg-[#FFC3A1]' : 'bg-gray-100'
            } ${
              item.quantity === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {item.size}
          </button>


          {/* Quantity Indicator */}
         
        </div>
      ))}
    </div>
    {/* Show "Size Chart" button only for Readymades */}
    {productData.category === "Readymades" && (
  <>
    <button
      onClick={() => setShowSizeChart(true)}
      className="mt-2 text-[#65000B] underline text-left w-full"
    >
      Size Chart
    </button>

    {/* Size Chart Modal */}
    {showSizeChart && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
          {/* Close Button */}
          <button
            onClick={() => setShowSizeChart(false)}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-600 hover:text-gray-900"
          >
            <FaTimes size={18} />
          </button>

          {/* Modal Content */}
          <h2 className="text-xl font-semibold text-[#65000B] mb-4">Size Chart</h2>

          {/* Responsive Table Container */}
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-[#F0997D] text-white">
                  <th className="border border-gray-300 px-2 sm:px-4 py-2">Size</th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2">Bust (in)</th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2">Waist (in)</th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2">Hips (in)</th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2">Shoulder (in)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { size: "S", bust: 36, waist: 34, hips: 38, shoulder: 14 },
                  { size: "M", bust: 38, waist: 36, hips: 40, shoulder: 14.5 },
                  { size: "L", bust: 40, waist: 38, hips: 42, shoulder: 15 },
                  { size: "XL", bust: 42, waist: 40, hips: 44, shoulder: 15.5 },
                  { size: "XXL", bust: 44, waist: 42, hips: 46, shoulder: 16 },
                  { size: "3XL", bust: 46, waist: 44, hips: 48, shoulder: 16.5 },
                  { size: "4XL", bust: 48, waist: 46, hips: 50, shoulder: 17 },
                ].map((row, index) => (
                  <tr key={index} className="text-center">
                    <td className="border border-gray-300 px-2 sm:px-4 py-2">{row.size}</td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2">{row.bust}</td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2">{row.waist}</td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2">{row.hips}</td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2">{row.shoulder}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Extra Notes */}
          <div className="mt-4 text-sm text-gray-600">
            <p>• Measurements are mentioned in inches.</p>
            <p>• All garments have little to no margin.</p>
            <p>• If you're between two sizes, choose smaller for a tight fit or larger for a relaxed fit.</p>
            <p>• Larger sizes can be altered if needed.</p>
          </div>
        </div>
      </div>
    )}
  </>
)}
  </div>
  
  
  
)}





<button
  onClick={() => {
    // Ensure size or color is selected if applicable
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
    
    
    

    // Add to cart logic
    addToCart(productData._id, size || null);
  }}
  disabled={
    (!productData.sizes || productData.sizes.length === 0) // For products without sizes
      ? productData.stockQuantity === 0 // Check stockQuantity
      : productData.sizes.every((s) => s.quantity === 0) // Check if all sizes are out of stock
  }
  className={`px-8 rounded-md py-3 text-sm ${
    ((!productData.sizes || productData.sizes.length === 0) && productData.stockQuantity > 0) || // Product without sizes and stockQuantity > 0
    (productData.sizes && productData.sizes.some((s) => s.quantity > 0)) // Product with sizes and at least one size has quantity > 0
      ? "text-white bg-gradient-to-r from-[#F0997D] to-[#D3756B] hover:from-[#D3756B] hover:to-[#F0997D]"
      : "text-gray-500 bg-gray-200 cursor-not-allowed"
  }`}
>
  {/* Button Label */}
  {(!productData.sizes || productData.sizes.length === 0) // For products without sizes
    ? productData.stockQuantity === 0 // Check stockQuantity
      ? "OUT OF STOCK"
      : "ADD TO CART"
    : productData.sizes.every((s) => s.quantity === 0) // For products with sizes
    ? "OUT OF STOCK"
    : "ADD TO CART"}
</button>








          
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm  text-gray-500 mt-5 flex flex-col gap-2">
      
      <div className="flex items-center gap-2">
        <CreditCard size={16} color="#FFC3A1" />
        <p>Prepaid Orders Only</p>
      </div>
      <div className="flex items-center gap-2">
        <XCircle size={16} color="#65000B" />
        <p>No Exchange Policy</p>
      </div>
      <div className="flex items-center gap-2">
        <Truck size={16} color="#F0997D" />
        <p>Standard delivery time is 6-8 working days</p>
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
            showDescription ? "border-2 border-[#F0997D] text-[#65000B]" : ""
          }`}
        >
          Description
        </button>
        <button
          onClick={() => setShowDescription(false)}
          className={`px-4 py-2 border prata-regular ${
            !showDescription ? "border-2 border-[#F0997D] text-[#65000B]" : ""
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
    <div>
  {renderWriteReview()}
 
</div>
  

      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;