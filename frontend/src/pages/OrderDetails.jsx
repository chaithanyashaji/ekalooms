import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaCheckCircle, FaBoxOpen, FaTruck, FaHome, FaShoppingBag, FaArrowLeft } from "react-icons/fa";
import { MdPayment, MdReceipt } from "react-icons/md";
import Spinner from "../components/Spinner";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/order/details/${orderId}`);
        if (response.data.success) {
          setOrder(response.data.order);
        } else {
          toast.error("Order not found.");
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching order details:", error.response?.data || error.message);
        toast.error("Failed to load order details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrderDetails();
  }, [orderId, navigate, backendUrl]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <Spinner />
    </div>
  );

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <FaBoxOpen className="text-4xl text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium">Order not found</p>
          <p className="text-gray-500 mt-2">The order you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => navigate("/")} 
            className="mt-6 px-5 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition flex items-center justify-center mx-auto"
          >
            <FaArrowLeft className="mr-2" /> Back to Home
          </button>
        </div>
      </div>
    );
  }

  const trackingStages = ["Order Placed", "Processing", "Shipped", "Delivered"];
  const icons = [FaShoppingBag, FaBoxOpen, FaTruck, FaCheckCircle];
  const statusIndex = trackingStages.indexOf(order.status) !== -1 
    ? trackingStages.indexOf(order.status) 
    : order.status === "Out for Delivery" ? 2 : 0;

  const calculateSubtotal = () => {
    return order.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <button 
          onClick={() => navigate("/orders")} 
          className="mb-6 flex items-center text-gray-600 hover:text-gray-800 transition"
        >
          <FaArrowLeft className="mr-2" /> Back to Orders
        </button>

        {/* Order Header Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b pb-4 mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
              <p className="text-gray-500 mt-1">
                Order ID: <span className="text-red-500 font-medium">{order.orderId}</span>
              </p>
            </div>
            <div className="mt-3 sm:mt-0">
              <p className="text-gray-500">Placed on: {new Date(order.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
              <p className={`font-medium ${order.payment ? "text-green-600" : "text-amber-600"}`}>
                {order.payment ? "Paid" : "Payment Pending"}
              </p>
            </div>
          </div>

          {/* Tracking Progress Bar */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Status</h3>
            <div className="relative">
              {/* Connect line */}
              <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200">
                <div 
                  className="h-full bg-green-500 transition-all duration-500" 
                  style={{ width: `${(statusIndex / (trackingStages.length - 1)) * 100}%` }}
                ></div>
              </div>
              
              {/* Status points */}
              <div className="flex justify-between relative">
                {trackingStages.map((stage, index) => {
                  const Icon = icons[index];
                  const isActive = index <= statusIndex;
                  return (
                    <div key={index} className="flex flex-col items-center z-10">
                      <div
                        className={`w-12 h-12 flex items-center justify-center rounded-full shadow-md transition-all duration-300 ${
                          isActive ? "bg-green-500 text-white" : "bg-white text-gray-400 border border-gray-200"
                        }`}
                      >
                        <Icon className="text-xl" />
                      </div>
                      <p className={`text-sm mt-2 font-medium ${isActive ? "text-green-600" : "text-gray-400"}`}>
                        {stage}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Order Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Order Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <MdReceipt className="text-2xl text-blue-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-800">Order Items</h3>
              </div>
              
              {order.items.map((item, index) => (
                <div 
                  key={index} 
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-4 border-b last:border-b-0"
                >
                  <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                    <img
                      src={item.image[0]}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-gray-800 font-medium">{item.name}</h4>
                    <div className="flex flex-wrap gap-x-4 text-sm text-gray-600 mt-1">
                    {item.sizes && item.sizes.length > 0 && item.size && <p>Size: {item.size}</p>}



                      <p>Qty: {item.quantity}</p>
                      <p>Price: ₹{item.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="text-right mt-2 sm:mt-0">
                    <p className="text-gray-800 font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
              
              {/* Order summary */}
              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 mt-2">
                  <span>Shipping</span>
                  <span>{order.shipping ? `₹${order.shipping.toFixed(2)}` : "Free"}</span>
                </div>
                {order.discount && (
                  <div className="flex justify-between text-green-600 mt-2">
                    <span>Discount</span>
                    <span>-₹{order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg mt-3 pt-3 border-t">
                  <span>Total</span>
                  <span>₹{order.totalAmount ? order.totalAmount.toFixed(2) : calculateSubtotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Payment & Delivery Info */}
          <div className="space-y-6">
            {/* Payment Status */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-3">
                <MdPayment className="text-2xl text-indigo-500" />
                <h3 className="text-lg font-semibold text-gray-800">Payment Information</h3>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${order.payment ? "bg-green-500" : "bg-amber-500"}`}></div>
                <p className={`text-sm font-medium ${order.payment ? "text-green-600" : "text-amber-600"}`}>
                  {order.payment ? "Payment Successful" : "Payment Pending"}
                </p>
              </div>
              <p className="text-gray-600 text-sm">Method: {order.paymentMethod || "Not specified"}</p>
              {order.paymentId && (
                <p className="text-gray-600 text-sm mt-1">Transaction ID: {order.paymentId}</p>
              )}
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-3">
                <FaHome className="text-2xl text-orange-500" />
                <h3 className="text-lg font-semibold text-gray-800">Delivery Address</h3>
              </div>
              {order.address && (
                <div className="text-gray-600">
                  <p className="font-medium">{order.address.name || "Customer"}</p>
                  <p className="mt-1">{order.address.street}</p>
                  <p>{order.address.city}, {order.address.state} {order.address.zipcode}</p>
                  <p>{order.address.country}</p>
                  <div className="border-t mt-3 pt-2">
                    <p>{order.address.email}</p>
                    <p>{order.address.phone}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Support Button */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Need Help?</h3>
              <button className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;