import { v2 as cloudinary } from "cloudinary";
import Category from "../models/categoryModel.js"
import fs from "fs/promises";

// ✅ Add or Update a Category Image
export const addCategoryImage = async (req, res) => {
  try {
    const { category } = req.body;
    if (!category) return res.status(400).json({ success: false, message: "Category name is required." });
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded." });

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "image",
      transformation: [{ width: 500, crop: "scale" }, { quality: "auto" }],
    });

    await fs.unlink(req.file.path); // ✅ Delete temp file after upload

    // Update or create category image
    const updatedCategory = await Category.findOneAndUpdate(
      { name: category },
      { image: result.secure_url },
      { new: true, upsert: true }
    );

    res.status(201).json({ success: true, message: "Image uploaded successfully.", category: updatedCategory });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get all categories with images
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ success: true, images: categories.reduce((obj, cat) => ({ ...obj, [cat.name]: cat.image }), {}) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Delete a category image
export const deleteCategoryImage = async (req, res) => {
  try {
    const { category } = req.params;
    await Category.findOneAndUpdate({ name: category }, { image: null });
    res.status(200).json({ success: true, message: "Image deleted successfully." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
