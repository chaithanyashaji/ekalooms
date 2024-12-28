import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from 'stripe'
import razorpay from 'razorpay'
import { sendMail } from '../services/emailService.js';
import productModel from "../models/productModel.js";



//global variables
const currency = 'INR'
const deliverCharge = 10


//gateway initialize

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
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

//placing order using Stripe

const placeOrderStripe = async (req,res) =>{

    try {
        const {userId,items,amount,address,email} = req.body;
        const {origin} = req.headers
        const orderData ={
            userId,
            items,
            email,
            amount,
            address,
            paymentMethod:"Stripe",
            payment:false,
            date:Date.now()

        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        const line_items = items.map((item)=>({
            price_data : {
                currency: currency,
                product_data:{
                    name:item.name
                },
                unit_amount:item.price*100
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data : {
                currency:currency,
                product_data:{
                    name:"Delivery Charges"
                },
                unit_amount:deliverCharge*100
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            success_url:`${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url:`${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode:'payment',
        })

        res.json({success:true,session_url:session.url});


        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
        
    }

}

//Verify Stripe
const verifyStripe = async (req, res) => {
    const { orderId, success, userId } = req.body;

    try {
        if (success === "true") {
            const updatedOrder = await orderModel.findByIdAndUpdate(orderId, { payment: true }, { new: true });
            await userModel.findByIdAndUpdate(userId, { cartData: {} });
            const { items, amount, address } = updatedOrder;

            // Extract email from the address field
            const { email, street,city,state,country,zipcode } = address;

            const itemSummary = items.map((item) => `${item.name} (x${item.quantity})`).join(', ');
            const emailText = `Dear User,
Thank you for your purchase! We are pleased to inform you that your payment for Order ID: ${orderId} has been successfully received.
            
Here are your order details:
            
------------------------------------------
Items: ${itemSummary}
Total Amount: ₹${amount}
------------------------------------------
            
Shipping Address:
${street}, ${city}, ${state}, ${country}, ${zipcode}
            
------------------------------------------
            
Thank you for shopping with us!
            
Best regards,
Forever
`;
            

            // Send email
            await sendMail(email, 'Payment Confirmation', emailText);

            res.json({ success: true });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false });
        }
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};


//placing order using Razorpay

const placeOrderRazorpay = async (req, res) => {
    try {
      const {  items, amount, address,couponCode,deliveryOption } = req.body;
      const userId = req.user.id;
      // Step 1: Create order data for the database
      const orderData = {
        userId,
        items,
        amount,
        address,
        deliveryOption,
        couponCode,
        paymentMethod: 'Razorpay',
        payment: false, // Payment not confirmed initially
        razorpayOrderId: null, // Placeholder for now
        date: Date.now(),
        couponCode,
        deliveryOption 
        
      };
  
      
  
      // Step 2: Save the initial order in the database
      const newOrder = new orderModel(orderData);
      await newOrder.save();
  
      // Step 3: Create Razorpay order
      const options = {
        amount: amount * 100, // Amount in paise
        currency: 'INR', // Default to INR if not provided
        receipt: newOrder._id.toString(), // Use MongoDB order ID as receipt
      };
  
      
  
      const razorpayOrder = await razorpayInstance.orders.create(options);
  
      // Step 4: Update the order with the Razorpay order ID
      newOrder.razorpayOrderId = razorpayOrder.id;
      await newOrder.save();

      for (const item of items) {
        const { _id, size, quantity } = item;
  
        const product = await productModel.findById(_id);
  
        if (product) {
          if (size) {
            const sizeEntry = product.sizes.find((s) => s.size === size);
            if (sizeEntry) {
              sizeEntry.quantity -= quantity;
              if (sizeEntry.quantity <= 0) {
                sizeEntry.quantity = 0;
              }
            }
  
            const totalStock = product.sizes.reduce((acc, s) => acc + s.quantity, 0);
            product.stockQuantity = totalStock;
            product.inStock = totalStock > 0;
          } else {
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
          id: razorpayOrder.id,
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
        await orderModel.findByIdAndUpdate(orderId, {status})
        res.json({success:true,message:"Order Status Updated"})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }


}

const placeGuestOrder = async (req, res) => {
    try {
        const { items, amount, address, email, paymentMethod } = req.body;

        const orderData = {
            isGuest: true,
            items,
            amount,
            address,
            email,
            paymentMethod:"COD",
            payment: false,
            date: Date.now()
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        for (const item of items) {
          const { _id, size, quantity } = item;
    
          const product = await productModel.findById(_id);
    
          if (product) {
            if (size) {
              const sizeEntry = product.sizes.find((s) => s.size === size);
              if (sizeEntry) {
                sizeEntry.quantity -= quantity;
                if (sizeEntry.quantity <= 0) {
                  sizeEntry.quantity = 0;
                }
              }
    
              const totalStock = product.sizes.reduce((acc, s) => acc + s.quantity, 0);
              product.stockQuantity = totalStock;
              product.inStock = totalStock > 0;
            } else {
              product.stockQuantity -= quantity;
              if (product.stockQuantity <= 0) {
                product.stockQuantity = 0;
                product.inStock = false;
              }
            }
            await product.save();
          }
        }

        res.json({ success: true, message: "Guest Order Placed", orderId: newOrder._id });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Placing order using Razorpay for guest users
const placeOrderRazorpayGuest = async (req, res) => {
    try {
      const { items, amount, address, email,couponCode,deliveryOption  } = req.body;
  
      // Step 1: Create order data for the database
      const orderData = {
        isGuest: true,
        items,
        amount,
        address,
        email,
        paymentMethod: 'Razorpay',
        payment: false, // Payment not confirmed initially
        razorpayOrderId: null, // Placeholder for Razorpay Order ID
        date: Date.now(),
        couponCode,
        deliveryOption 
      };
  
      
  
      // Step 2: Save the initial order in the database
      const newOrder = new orderModel(orderData);
      await newOrder.save();

      for (const item of items) {
        const { _id, size, quantity } = item;
  
        const product = await productModel.findById(_id);
  
        if (product) {
          if (size) {
            const sizeEntry = product.sizes.find((s) => s.size === size);
            if (sizeEntry) {
              sizeEntry.quantity -= quantity;
              if (sizeEntry.quantity <= 0) {
                sizeEntry.quantity = 0;
              }
            }
  
            const totalStock = product.sizes.reduce((acc, s) => acc + s.quantity, 0);
            product.stockQuantity = totalStock;
            product.inStock = totalStock > 0;
          } else {
            product.stockQuantity -= quantity;
            if (product.stockQuantity <= 0) {
              product.stockQuantity = 0;
              product.inStock = false;
            }
          }
          await product.save();
        }
      }
      

  
      // Step 3: Create Razorpay order
      const options = {
        amount: amount * 100, // Amount in paise
        currency: 'INR', // Default to INR
        receipt: newOrder._id.toString(), // Use MongoDB order ID as receipt
      };
  
      
  
      const razorpayOrder = await razorpayInstance.orders.create(options);
  
      // Step 4: Update the order with the Razorpay order ID
      newOrder.razorpayOrderId = razorpayOrder.id;
      await newOrder.save();
  
      // Step 5: Send the response back to the client
      return res.json({
        success: true,
        order: {
          id: razorpayOrder.id,
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
    return res.status(400).json({ success: false, message: "Order ID is required" });
  }

  try {
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, status: order.status });
  } catch (error) {
    console.error("Error fetching order status:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};














export {placeOrder,placeOrderRazorpayGuest,getOrderStatus, placeOrderStripe, placeOrderRazorpay,allOrders,userOrders,updateStatus,verifyStripe,placeGuestOrder}