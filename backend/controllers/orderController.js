import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import razorpay from 'razorpay'
import productModel from "../models/productModel.js";
import crypto from 'crypto';


const generateShortOrderId = (mongoId) => {
  if (!mongoId || typeof mongoId.toString !== "function") {
    throw new Error("Invalid MongoDB ObjectId");
  }
  const mongoIdStr = mongoId.toString(); // Convert ObjectId to string
  const base36Id = parseInt(mongoIdStr.substring(0, 8), 16).toString(36).toUpperCase();
  return `EKA-${base36Id}`;
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
    for (const item of items) {
      const { _id, size, quantity } = item;

      const product = await productModel.findById(_id);

      if (product) {
        if (product.sizes && product.sizes.length > 0) {
          // If product has sizes, update the quantity for the specific size
          if (size) {
            const sizeEntry = product.sizes.find((s) => s.size === size);
            if (sizeEntry) {
              sizeEntry.quantity -= quantity;
              if (sizeEntry.quantity <= 0) {
                sizeEntry.quantity = 0;
              }
            }
          }
          const totalStock = product.sizes.reduce((acc, s) => acc + s.quantity, 0);
          product.stockQuantity = totalStock;
          product.inStock = totalStock > 0;
        } else {
          // If product doesn't have sizes, reduce stockQuantity directly
          product.stockQuantity -= quantity;
          if (product.stockQuantity <= 0) {
            product.stockQuantity = 0;
            product.inStock = false;
          }
        }
        await product.save();
      }
    }

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
const userOrders = async(req,res) =>{

    try {
        
        const userId = req.user.id
        const orders = await orderModel.find({userId})
        res.json({success:true, orders})

    } catch (error) {

        console.log(error)
        res.json({success:false,message:error.message})
        
    }

}

//update order status
const updateStatus = async (req,res) =>{

    try {
        
        const {orderId,status} = req.body
        await orderModel.findOneAndUpdate({ orderId }, { status });
        res.json({success:true,message:"Order Status Updated"})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }


}

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

    // Update the order's tracking ID
    await orderModel.findOneAndUpdate({ orderId }, { trackingId });

    res.json({
      success: true,
      message: "Tracking ID updated successfully",
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
    for (const item of items) {
      const { _id, size, quantity } = item;

      const product = await productModel.findById(_id);

      if (product) {
        if (product.sizes && product.sizes.length > 0) {
          // If product has sizes, update the quantity for the specific size
          if (size) {
            const sizeEntry = product.sizes.find((s) => s.size === size);
            if (sizeEntry) {
              sizeEntry.quantity -= quantity;
              if (sizeEntry.quantity <= 0) {
                sizeEntry.quantity = 0;
              }
            }
          }
          const totalStock = product.sizes.reduce((acc, s) => acc + s.quantity, 0);
          product.stockQuantity = totalStock;
          product.inStock = totalStock > 0;
        } else {
          // If product doesn't have sizes, reduce stockQuantity directly
          product.stockQuantity -= quantity;
          if (product.stockQuantity <= 0) {
            product.stockQuantity = 0;
            product.inStock = false;
          }
        }
        await product.save();
      }
    }

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
      trackingId: order.trackingId || "Tracking ID not available",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export {placeOrder,placeOrderRazorpayGuest,getOrderStatus,  placeOrderRazorpay,allOrders,userOrders,updateStatus,updateTrackingId}