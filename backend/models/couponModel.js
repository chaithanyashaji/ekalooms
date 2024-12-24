import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true }, // Percentage discount
  expiresAt: { type: Date, required: true }, // Expiry date
  isActive: { type: Boolean, default: true }, // Active status
});

export default mongoose.model('Coupon', couponSchema);
