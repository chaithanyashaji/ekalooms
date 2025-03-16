import express from "express";
import upload from "../middleware/multer.js";  // Multer middleware for file uploads
import { addCategoryImage, getCategories, deleteCategoryImage } from "../controllers/categoryController.js";

const categoryRouter = express.Router();

categoryRouter.post("/upload", upload.single("image"), addCategoryImage);
categoryRouter.get("/list", getCategories);
categoryRouter.delete("/delete/:category", deleteCategoryImage);

export default categoryRouter;
