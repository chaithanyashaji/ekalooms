import express from "express";
import authUser from "../middleware/auth.js"; // If authentication is required
import { addFeaturedImage, getFeaturedImages, deleteFeaturedImage, updateImageOrder } from "../controllers/featuredImageController.js";
import upload from "../middleware/multer.js"; // Import Multer middleware

const featuredRouter = express.Router();

// Routes
featuredRouter.post("/add", upload.array("images"), addFeaturedImage);
// Allow up to 5 images
featuredRouter.get("/list", getFeaturedImages); // Get all featured images
featuredRouter.delete("/delete/:id",  deleteFeaturedImage); // Delete an image
featuredRouter.put("/update-image", updateImageOrder); // Update order of images

export default featuredRouter;
