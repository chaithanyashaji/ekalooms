import express from "express";
import {
  validateCoupon,
  createCoupon,
  deactivateCoupon,
  listCoupons,
  reactivateCoupon,
} from "../controllers/couponController.js";

const couponRouter = express.Router();

couponRouter.post("/validate", validateCoupon); // Validate a coupon
couponRouter.post("/create", createCoupon); // Create a new coupon
couponRouter.post("/deactivate", deactivateCoupon); // Deactivate a coupon
couponRouter.post("/reactivate", reactivateCoupon); // Reactivate a coupon
couponRouter.get("/list", listCoupons); // List all coupons

export default couponRouter;
