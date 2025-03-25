import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import razorpay from 'razorpay'
import productModel from "../models/productModel.js";
import crypto from 'crypto';
import { sendMail } from '../services/emailService.js';


const generateShortOrderId = (mongoId) => {
  if (!mongoId || typeof mongoId.toString !== "function") {
    throw new Error("Invalid MongoDB ObjectId");
  }
  const hash = crypto.createHash("sha1").update(mongoId.toString()).digest("hex");
  const shortId = parseInt(hash.substring(0, 8), 16).toString(36).toUpperCase();
  return `EKA-${shortId}`;
};


const razorpayInstance = new razorpay({
    key_id : process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET
}

)
//placing order using cod

const placeOrder = async (req,res) =>{

    try {
        
            const {userId,items,amount,address,email} = req.body;
            const orderData ={
                userId,
                items,
                amount,
                address,
                email,
                paymentMethod:"COD",
                payment:false,
                date:Date.now()

            }

            const newOrder = new orderModel(orderData)
            await newOrder.save()

            await userModel.findByIdAndUpdate(userId, {cartData:{}})
            res.json({success:true,message:"Order Placed"})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
        
    }

}



//placing order using Razorpay

const placeOrderRazorpay = async (req, res) => {
  try {
    const { items, amount, address, couponCode, deliveryOption } = req.body;
    const userId = req.user.id;

    // Step 1: Check stock availability
    for (const item of items) {
      const { _id, size, quantity } = item;

      const product = await productModel.findById(_id);

      if (!product) {
        return res.status(400).json({ success: false, message: `Product ${item.name} not found.` });
      }

      if (product.sizes && product.sizes.length > 0) {
        // If product has sizes, check the quantity for the specific size
        if (size) {
          const sizeEntry = product.sizes.find((s) => s.size === size);
          if (sizeEntry) {
            if (sizeEntry.quantity < quantity) {
              return res.status(400).json({
                success: false,
                message: `Insufficient stock for ${item.name} size ${size}.`,
              });
            }
          } else {
            return res.status(400).json({
              success: false,
              message: `Size ${size} for ${item.name} not found.`,
            });
          }
        } else {
          // If no size is selected but the product has sizes, return an error
          return res.status(400).json({
            success: false,
            message: `Size must be selected for ${item.name}.`,
          });
        }
      } else {
        // If product doesn't have sizes, check the general stock quantity
        if (product.stockQuantity < quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for ${item.name}.`,
          });
        }
      }
    }

    // Step 2: Create order data for the database
    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      deliveryOption,
      couponCode,
      paymentMethod: "Razorpay",
      payment: false,
      razorpayOrderId: null,
      date: Date.now(),
    });

    const shortOrderId = generateShortOrderId(newOrder._id);
    newOrder.orderId = shortOrderId; // Assign before saving
    await newOrder.save();

    // Step 3: Create Razorpay order
    const options = {
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      receipt: newOrder._id.toString(),
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);
    newOrder.razorpayOrderId = razorpayOrder.id;
    await newOrder.save();

    // Step 4: Update the product stock
   

    // Step 5: Send the response back to the client
    return res.json({
      success: true,
      order: {
        id: newOrder.orderId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        razorpayOrderId: razorpayOrder.id,
      },
    });
  } catch (error) {
    console.error('Error placing Razorpay order:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to create Razorpay order' });
  }
};


  
//all orders data displAY for admin

const allOrders = async(req,res)=>{

    try {
        
        const orders = await orderModel.find({})
        res.json({success:true,orders})
       

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
        
    }

}

// user order data for frontend
const userOrders = async (req, res) => {
  try {
    // If no token or user attached, block immediately
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access. Please login again.",
      });
    }

    const userId = req.user.id;
    const orders = await orderModel.find({ userId });

    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


//update order status
const updateStatus = async (req, res) => {
  try {
      const { orderId, status } = req.body;

      const order = await orderModel.findOneAndUpdate(
          { orderId },
          { status },
          { new: true }
      );

      if (!order) {
          return res.status(404).json({ success: false, message: 'Order not found' });
      }

      const FRONTEND_URL = process.env.FRONTEND_URL;

      const emailHTML = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
          <h2 style="color: #D3756B;">Order Status Update</h2>
          <p>Dear <strong>${order.address.firstName || 'Customer'}</strong>,</p>
          <p>Your order <strong>${order.orderId}</strong> status has been updated to: <strong>${status}</strong>.</p>
          
          <div style="text-align: center; margin-top: 20px;">
              <a href="${FRONTEND_URL}/order-details/${order.orderId}" style="background-color: #D3756B; color: white; padding: 12px 20px; border-radius: 6px; text-decoration: none; font-size: 16px;">
                  View Order Details
              </a>
          </div>

          <p style="margin-top: 20px;">If you have any questions, please contact us at <a href="mailto:contact@ekalooms.com">contact@ekalooms.com</a>.</p>
          <p style="font-size: 14px; text-align: center;">Best regards,<br><strong>ekalooms Team</strong></p>
      </div>
      `;

      await sendMail(order.address.email, 'Order Status Updated', emailHTML, true);

      res.json({ success: true, message: 'Order Status Updated and Email Sent' });
  } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
  }
};

const updateTrackingId = async (req, res) => {
  try {
    const { orderId, trackingId } = req.body;

    // Validate input
    if (!orderId || !trackingId) {
      return res.json({
        success: false,
        message: "Order ID and Tracking ID are required",
      });
    }

    // Update the order's tracking ID and return the updated order
    const order = await orderModel.findOneAndUpdate(
      { orderId },
      { trackingId },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Customize this base URL as per your courier service
    const TRACKING_LINK = `https://your-courier.com/track/${trackingId}`;

    const emailHTML = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
        <h2 style="color: #D3756B;">Your Order is on the Way!</h2>
        <p>Dear <strong>${order.address.firstName || 'Customer'}</strong>,</p>
        <p>Your order <strong>${order.orderId}</strong> has been dispatched and a tracking ID has been assigned.</p>
        <p><strong>Tracking ID:</strong> ${trackingId}</p>

        <div style="text-align: center; margin: 20px 0;">
          <a href="${TRACKING_LINK}" style="background-color: #D3756B; color: white; padding: 12px 20px; border-radius: 6px; text-decoration: none; font-size: 16px;">
              Track Your Order
          </a>
        </div>

        <p>If you have any questions or need help, feel free to contact our support team at <a href="mailto:contact@ekalooms.com" style="color: #007BFF;">contact@ekalooms.com</a>.</p>

        <p style="font-size: 14px; text-align: center;">Thank you for shopping with us!<br><strong>– ekalooms Team</strong></p>
    </div>
    `;

    // Send email
    await sendMail(order.address.email, 'Your Order Tracking ID', emailHTML, true);

    res.json({
      success: true,
      message: "Tracking ID updated and email sent successfully",
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};


// Placing order using Razorpay for guest users
const placeOrderRazorpayGuest = async (req, res) => {
  try {
    const { items, amount, address, email, couponCode, deliveryOption } = req.body;

    // Step 1: Check stock availability
    for (const item of items) {
      const { _id, size, quantity } = item;

      const product = await productModel.findById(_id);

      if (!product) {
        return res.status(400).json({ success: false, message: `Product ${item.name} not found.` });
      }

      if (product.sizes && product.sizes.length > 0) {
        // If product has sizes, check the quantity for the specific size
        if (size) {
          const sizeEntry = product.sizes.find((s) => s.size === size);
          if (sizeEntry) {
            if (sizeEntry.quantity < quantity) {
              return res.status(400).json({
                success: false,
                message: `Insufficient stock for ${item.name} size ${size}.`,
              });
            }
          } else {
            return res.status(400).json({
              success: false,
              message: `Size ${size} for ${item.name} not found.`,
            });
          }
        } else {
          // If no size is selected but the product has sizes, return an error
          return res.status(400).json({
            success: false,
            message: `Size must be selected for ${item.name}.`,
          });
        }
      } else {
        // If product doesn't have sizes, check the general stock quantity
        if (product.stockQuantity < quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for ${item.name}.`,
          });
        }
      }
    }

    // Step 2: Create order data for the database
    const newOrder = new orderModel({
      isGuest: true,
      items,
      amount,
      address,
      email,
      paymentMethod: "Razorpay",
      payment: false,
      razorpayOrderId: null,
      date: Date.now(),
      couponCode,
      deliveryOption,
    });

    const shortOrderId = generateShortOrderId(newOrder._id);
    newOrder.orderId = shortOrderId; // Assign before saving
    await newOrder.save();

    // Step 3: Create Razorpay order
    const options = {
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      receipt: newOrder._id.toString(),
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);

    // Step 4: Update the order with the Razorpay order ID
    newOrder.razorpayOrderId = razorpayOrder.id;
    await newOrder.save();

    // Step 5: Update the product stock

    // Step 6: Send the response back to the client
    return res.json({
      success: true,
      order: {
        id: newOrder.orderId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        razorpayOrderId: razorpayOrder.id,
      },
    });
  } catch (error) {
    console.error('Error placing Razorpay guest order:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to create Razorpay order' });
  }
};
  

// Verifying Razorpay payment for guest users

// Fetch Order Status by Order ID
const getOrderStatus = async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({
      success: false,
      message: "Order ID is required",
    });
  }

  try {
    // Find the order in the database
    const order = await orderModel.findOne({ orderId });


    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      status: order.status,
      trackingId: order.trackingId || "Tracking ID will be updated within 48hrs of placing the order.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export {placeOrder,placeOrderRazorpayGuest,getOrderStatus,  placeOrderRazorpay,allOrders,userOrders,updateStatus,updateTrackingId}