// controllers/reviewController.js
import reviewModel from "../models/reviewModel.js";
import productModel from "../models/productModel.js";


// Add a review
const addReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;
        
        const userId=req.user.id;

       
        

        const review = new reviewModel({ userId, productId, rating, comment});
        await review.save();

        const product = await productModel.findById(productId);
        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }

        const newTotalReviews = product.totalReviews + 1;
        const newAverageRating =
            (product.averageRating * product.totalReviews + rating) / newTotalReviews;

        product.averageRating = newAverageRating;
        product.totalReviews = newTotalReviews;
        product.reviews.push(review._id);

        await product.save();

        res.json({ success: true, message: "Review added successfully" });
    } catch (error) {
        console.error(error); // Log the error
        res.json({ success: false, message: error.message });
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
