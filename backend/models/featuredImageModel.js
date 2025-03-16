import mongoose from "mongoose";

const FeaturedImageSchema = new mongoose.Schema({
  url: { type: String, required: true }, // Cloudinary image URL
  order: { type: Number, required: true }, // Order of display
});

export default mongoose.model("FeaturedImage", FeaturedImageSchema);
