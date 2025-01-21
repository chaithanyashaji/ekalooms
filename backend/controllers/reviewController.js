// controllers/reviewController.js
import reviewModel from "../models/reviewModel.js";
import productModel from "../models/productModel.js";


// Add a review
const addReview = async (req, res) => {
    try {
        const { productId, rating, comment, guestName, guestEmail } = req.body;

        if (!rating || !comment || !productId || (!req.user && (!guestName || !guestEmail))) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        const reviewData = req.user
            ? { userId: req.user.id, productId, rating, comment }
            : { guestName, guestEmail, productId, rating, comment };

        const review = new reviewModel(reviewData);
        await review.save();

        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found." });
        }

        const newTotalReviews = product.totalReviews + 1;
        const newAverageRating =
            (product.averageRating * product.totalReviews + rating) / newTotalReviews;

        product.averageRating = newAverageRating;
        product.totalReviews = newTotalReviews;
        product.reviews.push(review._id);

        await product.save();

        res.json({ success: true, message: "Review added successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};


// Get reviews for a product
const getReviews = async (req, res) => {
    try {
        const { productId } = req.params;

        const product = await productModel.findById(productId).populate({
            path: 'reviews',
            populate: { path: 'userId', select: 'name' },
        });

        res.json({
            success: true,
            reviews: product.reviews,
            averageRating: product.averageRating,
            totalReviews: product.totalReviews,
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export { addReview, getReviews };
