import { v2 as cloudinary } from "cloudinary";
import FeaturedImage from "../models/FeaturedImageModel.js";
import fs from "fs/promises"; // Use fs.promises for async operations

// ✅ Add a featured image (Supports Multiple Uploads)
export const addFeaturedImage = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No files uploaded." });
    }

    // Upload each image to Cloudinary
    const imagesUrl = await Promise.all(
      req.files.map(async (file) => {
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            resource_type: "image",
            transformation: [{ width: 1000, crop: "scale" }, { quality: "auto" }],
          });

          await fs.unlink(file.path); // ✅ Delete temp file after upload
          return result.secure_url;
        } catch (uploadError) {
          console.error("Cloudinary upload error:", uploadError);
          return null;
        }
      })
    );

    // Remove failed uploads
    const validImagesUrl = imagesUrl.filter((url) => url !== null);
    if (validImagesUrl.length === 0) {
      return res.status(500).json({ success: false, message: "Failed to upload images." });
    }

    // Save images to database
    const featuredImages = validImagesUrl.map((url, index) => ({
      url,
      order: Date.now() + index, // ✅ Ensures proper order
    }));

    const savedImages = await FeaturedImage.insertMany(featuredImages);

    res.status(201).json({
      success: true,
      message: "Images uploaded successfully.",
      images: savedImages,
    });
  } catch (err) {
    console.error("Error in addFeaturedImage:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get all featured images
export const getFeaturedImages = async (req, res) => {
  try {
    const images = await FeaturedImage.find().sort({ order: 1 }); // ✅ Sorted by order
    res.status(200).json({ success: true, images });
  } catch (err) {
    console.error("Error in getFeaturedImages:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Delete a featured image (Fixes all issues)
export const deleteFeaturedImage = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await FeaturedImage.findById(id);
    if (!image) return res.status(404).json({ success: false, message: "Image not found." });

    // Extract Cloudinary public ID
    const cloudinaryUrlParts = image.url.split("/");
    const publicIdWithExtension = cloudinaryUrlParts[cloudinaryUrlParts.length - 1]; // Get last part
    const publicId = publicIdWithExtension.split(".")[0]; // Remove extension (jpg, png, etc.)

    // Delete image from Cloudinary
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (cloudinaryError) {
      console.error("Cloudinary delete error:", cloudinaryError);
      return res.status(500).json({ success: false, message: "Failed to delete image from Cloudinary." });
    }

    // Delete image from MongoDB
    await FeaturedImage.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Image deleted successfully." });
  } catch (err) {
    console.error("Error in deleteFeaturedImage:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Update the order of images
export const updateImageOrder = async (req, res) => {
  try {
    const { orderedImages } = req.body; // ✅ Array of { id, order }

    if (!Array.isArray(orderedImages) || orderedImages.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid image order data." });
    }

    await Promise.all(
      orderedImages.map(async (img) => {
        await FeaturedImage.findByIdAndUpdate(img.id, { order: img.order });
      })
    );

    res.status(200).json({ success: true, message: "Order updated successfully." });
  } catch (err) {
    console.error("Error in updateImageOrder:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
