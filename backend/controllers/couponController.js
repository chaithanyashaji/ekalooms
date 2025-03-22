import Coupon from "../models/couponModel.js";
import orderModel from "../models/orderModel.js";

/**
 * Validate a coupon code
 */
const validateCoupon = async (req, res) => {
  try {
    const { code, email } = req.body;

    // ✅ Check if the user has placed a successful (paid) order before
    const existingOrder = await orderModel.findOne({ "address.email": email, payment: true });

    // ❌ Deny EKA10 if the user has already completed a paid order
    if (code === "EKA10" && existingOrder) {
      return res.status(400).json({
        success: false,
        message: "Coupon EKA10 is only for first-time users!",
      });
    }

    // ✅ Find the coupon in the database
    const coupon = await Coupon.findOne({ code, isActive: true });

    if (!coupon) {
      return res.status(404).json({ success: false, message: "Invalid or expired coupon" });
    }

    // ❌ Check if expired
    if (coupon.expiresAt < Date.now()) {
      return res.status(400).json({ success: false, message: "Coupon has expired" });
    }

    // ✅ Coupon valid
    res.json({ success: true, discount: coupon.discount });

  } catch (error) {
    console.error("Error validating coupon:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


/**
 * Create a new coupon (Admin only)
 */
const createCoupon = async (req, res) => {
  try {
    const { code, discount, expiresAt } = req.body;

    // Ensure the discount is valid
    if (discount <= 0 || discount > 100) {
      return res.status(400).json({ success: false, message: "Invalid discount percentage" });
    }

    // Check if the coupon already exists
    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      return res.status(400).json({ success: false, message: "Coupon code already exists" });
    }

    // Create the coupon
    const newCoupon = new Coupon({ code, discount, expiresAt, isActive: true });
    await newCoupon.save();

    res.json({ success: true, message: "Coupon created successfully", coupon: newCoupon });
  } catch (error) {
    console.error("Error creating coupon:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Deactivate a coupon
 */
const deactivateCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    // Delete the coupon instead of deactivating
    const deletedCoupon = await Coupon.findOneAndDelete({ code });

    if (!deletedCoupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }

    res.json({ success: true, message: "Coupon deleted successfully", coupon: deletedCoupon });
  } catch (error) {
    console.error("Error deleting coupon:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


/**
 * List all coupons (Admin only)
 */
const listCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({});
    res.json({ success: true, coupons });
  } catch (error) {
    console.error("Error fetching coupons:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Reactivate a coupon
 */
const reactivateCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    const updatedCoupon = await Coupon.findOneAndUpdate(
      { code },
      { isActive: true },
      { new: true }
    );

    if (!updatedCoupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }

    res.json({ success: true, message: "Coupon reactivated successfully", coupon: updatedCoupon });
  } catch (error) {
    console.error("Error reactivating coupon:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { validateCoupon, createCoupon, deactivateCoupon, listCoupons, reactivateCoupon };
