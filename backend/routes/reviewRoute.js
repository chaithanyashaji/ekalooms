// routes/reviewRoutes.js
import express from "express";
import authUser from "../middleware/auth.js";
import { addReview, getReviews } from "../controllers/reviewController.js";

const reviewRouter = express.Router();

reviewRouter.post("/submitreview", addReview);
reviewRouter.get("/:productId/showreviews",getReviews);

export default reviewRouter;
