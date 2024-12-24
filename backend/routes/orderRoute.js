import express from 'express';
import rateLimit from "express-rate-limit";
import {
  placeOrder,
  placeGuestOrder,
  placeOrderRazorpayGuest,

  placeOrderRazorpay,
  placeOrderStripe,
  allOrders,
  userOrders,
  updateStatus,
  verifyStripe,
  
  getOrderStatus
} from '../controllers/orderController.js';
import orderModel from '../models/orderModel.js';
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';

const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests
  message: 'Too many requests, please try again later.',
});

const orderRouter = express.Router();

// Admin routes
orderRouter.post('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateStatus);

// User routes
orderRouter.post('/place', authUser, orderLimiter, placeOrder);
orderRouter.post('/stripe', authUser, placeOrderStripe);
orderRouter.post('/razorpay', authUser, placeOrderRazorpay);

// Guest routes
orderRouter.post('/guest', orderLimiter, placeGuestOrder);
orderRouter.post('/razorpayguest', orderLimiter, placeOrderRazorpayGuest);

// Payment status routes
orderRouter.post('/userorders', authUser, userOrders);
orderRouter.get('/track/:receipt', orderLimiter, getOrderStatus);

// Verify payment
orderRouter.post('/verifyStripe', authUser, verifyStripe);

// Route to check payment status via polling
orderRouter.get('/status/:receipt', async (req, res) => {
    try {
      const { receipt } = req.params;
  
      // Step 1: Validate receipt
      if (!receipt ) {
        console.error('Invalid receipt parameter received');
        return res.status(400).json({ success: false, message: 'Invalid receipt parameter' });
      }
  
     
      
      // Step 2: Find the order using razorpayOrderId
      const order = await orderModel.findOne({ razorpayOrderId: receipt });
  
      if (!order) {
        console.error(`Order not found for Razorpay Order ID: ${receipt}`);
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
  
      // Step 3: Return the payment status
     
      return res.status(200).json({
        success: true,
        payment: order.payment,
      });
    } catch (error) {
      console.error('Error fetching payment status:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  });
  
export default orderRouter;
