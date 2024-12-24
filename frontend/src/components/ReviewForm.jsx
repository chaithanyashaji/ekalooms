import React, { useState, useContext } from "react";
import axios from "axios";
import { ShopContext } from "../context/shopcontext";
import { FaStar } from "react-icons/fa";

const ReviewForm = ({ productId, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const { backendUrl, token } = useContext(ShopContext);

  const submitReview = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/review/submitreview`,
        { productId, rating, comment },
        { headers: { token } }
      );
      if (response.data.success) {
        onSubmit();
        onClose(); // Close the modal
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">
          Leave a Review
        </h3>
        <div className="flex justify-center mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              size={30}
              className={`cursor-pointer mx-1 ${
                star <= (hover || rating) ? "text-yellow-400" : "text-gray-300"
              }`}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your comment here..."
          className="w-full h-28 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none mb-4"
        ></textarea>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-500 bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={submitReview}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;
