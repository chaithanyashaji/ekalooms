import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      refreshTokens: { type: [String], default: [] },
      cartData: { type: Object, default: {} },
      wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'product' }], // Wishlist field
      resetPasswordToken: { type: String },
      resetPasswordExpires: { type: Date },
    },
    { minimize: false }
  );
  
  const userModel = mongoose.models.user || mongoose.model("user", userSchema);
  export default userModel;
  