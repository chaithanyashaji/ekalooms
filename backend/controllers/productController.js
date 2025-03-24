import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";
import fs from "fs";

// Function to add a product
const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, sizes,colors, bestseller, inStock, stockQuantity } = req.body;
    const images = [
      req.files?.image1?.[0],
      req.files?.image2?.[0],
      req.files?.image3?.[0],
      req.files?.image4?.[0],
    ].filter(Boolean);

   

    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
          transformation: [
            { width: 1000, crop: "scale" },
            { quality: "auto" },
            { fetch_format: "auto" },
          ],
        });
        fs.unlink(item.path, (err) => {
          if (err) console.error("Failed to delete temporary file:", err);
        });
        return result.secure_url;
      })
    );

    const productData = {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      stockQuantity: Number(stockQuantity),
      
      sizes: JSON.parse(sizes),
      colors: JSON.parse(colors),
      bestseller: bestseller === "true" || bestseller === true || false,

      inStock: inStock === "true",
      image: imagesUrl,
      date: Date.now(),
    };

    const product = new productModel(productData);
    await product.save();
    res.status(201).json({ success: true, message: "Product added successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Function to update a product
const updateProduct = async (req, res) => {
  try {
    const {
      productId,
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      colors,
      bestseller,
      inStock,
      stockQuantity,
      existingImages
    } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID is required." });
    }

    const existingProduct = await productModel.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    // Parse preserved images
    let finalImages = [];
    try {
      finalImages = JSON.parse(existingImages || "[]");
    } catch (parseError) {
      console.error("Failed to parse existingImages:", parseError);
      return res.status(400).json({ success: false, message: "Invalid existing images format." });
    }

    // Collect new images (from req.files)
    const newImages = [
      req.files?.image1?.[0],
      req.files?.image2?.[0],
      req.files?.image3?.[0],
      req.files?.image4?.[0],
    ].filter(Boolean);

    // Upload new images to Cloudinary
    const newImageUrls = await Promise.all(
      newImages.map(async (item) => {
        try {
          const result = await cloudinary.uploader.upload(item.path, {
            resource_type: "image",
            transformation: [
              { width: 1000, crop: "scale" },
              { quality: "auto" },
              { fetch_format: "auto" },
            ],
          });
          // Delete temp file
          fs.unlink(item.path, (err) => {
            if (err) console.error("Failed to delete temporary file:", err);
          });
          return result.secure_url;
        } catch (uploadErr) {
          console.error("Image upload failed:", uploadErr);
          return null;
        }
      })
    );

    // Merge and filter nulls, limit to 4
    finalImages = [...finalImages, ...newImageUrls.filter(Boolean)].slice(0, 4);

    // Final update object
    const updateData = {
      name: name ?? existingProduct.name,
      description: description ?? existingProduct.description,
      price: price ? Number(price) : existingProduct.price,
      category: category ?? existingProduct.category,
      subCategory: subCategory ?? existingProduct.subCategory,
      stockQuantity: stockQuantity ? Number(stockQuantity) : existingProduct.stockQuantity,
      sizes: sizes ? JSON.parse(sizes) : existingProduct.sizes,
      colors: colors ? JSON.parse(colors) : existingProduct.colors,
      bestseller: bestseller !== undefined ? bestseller === "true" || bestseller === true : existingProduct.bestseller,
      inStock: inStock !== undefined ? inStock === "true" || inStock === true : existingProduct.inStock,
      image: finalImages,
      date: Date.now(),
    };

    const updatedProduct = await productModel.findByIdAndUpdate(productId, updateData, { new: true });

    return res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      product: updatedProduct,
    });
  } catch (err) {
    console.error("Error in updateProduct:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


// Function to list products with pagination and filtering
const listProducts = async (req, res) => {
  try {
    const {
      category,
      subCategory,
      minPrice,
      maxPrice,
      bestseller,
      inStock,
      sortField = "date",
      sortOrder = -1,
    } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (subCategory) filter.subCategory = subCategory;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (bestseller !== undefined) filter.bestseller = bestseller === "true";
    if (inStock !== undefined) filter.inStock = inStock === "true";

    const sortOptions = {
      [sortField]: sortField === "bestseller" ? -1 : Number(sortOrder),
    };

    // Fetch all filtered and sorted products
    const products = await productModel.find(filter).sort(sortOptions);

    // Transform product data
    const transformedProducts = products.map((product) => ({
      ...product._doc,
      image: product.image?.map((url) =>
        cloudinary.url(url, {
          transformation: [
            { width: 500, crop: "scale" },
            { quality: "auto" },
            { fetch_format: "auto" },
          ],
        })
      ) || [],
    }));

    res.status(200).json({
      success: true,
      products: transformedProducts,
      totalProducts: products.length, // Provide the total count for frontend reference
    });
  } catch (err) {
    console.error("Error in listProducts:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};



// Function to remove a product
const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: "Product ID is required." });
    }

    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    await Promise.all(
      product.image.map(async (imageUrl) => {
        try {
          const publicId = imageUrl.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error("Failed to delete image from Cloudinary:", err);
        }
      })
    );

    await productModel.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Product removed successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Function to get single product info
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID is required." });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    const transformedProduct = {
      ...product._doc,
      image: product.image.map((url) =>
        cloudinary.url(url, {
          transformation: [
            { width: 500, crop: "scale" },
            { quality: "auto" },
            { fetch_format: "auto" },
          ],
        })
      ),
    };

    res.status(200).json({ success: true, product: transformedProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export {
  listProducts,
  removeProduct,
  addProduct,
  singleProduct,
  updateProduct,
};
