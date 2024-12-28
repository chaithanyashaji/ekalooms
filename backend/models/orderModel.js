import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: false }, // Optional for guest orders
    isGuest: { type: Boolean, default: false }, // New field for guest orders
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: 'Order Placed', required: true },
    paymentMethod: { type: String, required: true },
    payment: { type: Boolean, required: true, default: false },
    date: { type: Number, required: true },
    razorpayOrderId: { type: String, sparse: true},
    receipt: { type: String, },
    couponCode: { type: String},
    deliveryOption: { type: String},
    trackingId: { type: String, }
});


const orderModel= mongoose.models.order || mongoose.model('order',orderSchema);
export default orderModel