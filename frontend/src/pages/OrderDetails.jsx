import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { 
  FaCheckCircle, 
  FaBoxOpen, 
  FaTruck, 
  FaHome, 
  FaShoppingBag, 
  FaArrowLeft, 
  FaCopy, 
  FaExternalLinkAlt,
  FaTimesCircle
} from "react-icons/fa";
import { MdPayment, MdReceipt, MdLocalShipping } from "react-icons/md";
import { BiPackage } from "react-icons/bi";
import Spinner from "../components/Spinner";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const trackingIdRef = useRef(null);

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

  const copyTrackingId = () => {
    if (order?.trackingId && trackingIdRef.current) {
      navigator.clipboard.writeText(order.trackingId)
        .then(() => {
          setCopied(true);
          toast.success("Tracking ID copied to clipboard!");
          setTimeout(() => setCopied(false), 3000);
        })
        .catch(() => {
          toast.error("Failed to copy tracking ID");
        });
    }
  };

  const navigateToTracking = () => {
    if (order?.trackingId) {
      window.open(`https://www.dtdc.com/tracking?reference-numbers=${order.trackingId}`, '_blank');
    }
  };

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

  const trackingStages = [
    "Order Placed",
    "Packing",
    "Shipped",
    "Out for delivery",
    "Delivered"
  ];
  
  const icons = [
    FaShoppingBag, 
    BiPackage, 
    FaTruck, 
    MdLocalShipping, 
    FaCheckCircle
  ];

  // Determine which status to show in the tracking bar
  const isCancelled = order.status === "Cancelled" || order.status === "Cancelled and Eligible for Refund";
  const statusIndex = !isCancelled ? trackingStages.indexOf(order.status) : -1;

  
  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
       

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

          {/* Tracking ID Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Tracking Information</h3>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">Tracking ID:</span>
              {order.trackingId ? (
                <div className="flex items-center">
                  <span 
                    ref={trackingIdRef}
                    className="text-blue-600 cursor-pointer hover:underline mr-2"
                    onClick={navigateToTracking}
                  >
                    {order.trackingId}
                  </span>
                  <button 
                    onClick={copyTrackingId}
                    className="text-gray-500 hover:text-gray-700 mr-2"
                    title="Copy tracking ID"
                  >
                    <FaCopy />
                  </button>
                  <button
                    onClick={navigateToTracking}
                    className="text-gray-500 hover:text-gray-700"
                    title="Open tracking page"
                  >
                    <FaExternalLinkAlt />
                  </button>
                  {copied && <span className="text-green-500 text-sm ml-2">Copied!</span>}
                </div>
              ) : (
                <span className="text-gray-500">Not available</span>
              )}
            </div>
          </div>

          {/* Tracking Progress Bar or Cancelled Status */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Status</h3>
            
            {isCancelled ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                <FaTimesCircle className="text-2xl text-red-500 mr-3" />
                <div>
                  <p className="text-red-600 font-medium">{order.status}</p>
                  <p className="text-gray-600 text-sm mt-1">
                    {order.status === "Cancelled and Eligible for Refund" ? 
                      "Your order has been cancelled and is eligible for a refund." : 
                      "Your order has been cancelled."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative">
                {/* Connect line */}
                <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200">
                  <div 
                    className="h-full bg-[#d1856c] transition-all duration-500" 
                    style={{ width: `${statusIndex >= 0 ? (statusIndex / (trackingStages.length - 1)) * 100 : 0}%` }}
                  ></div>
                </div>
                
                {/* Status points */}
               {/* Status points */}
               <div className="w-full overflow-x-auto pb-4">
      <div className="flex justify-between min-w-full relative gap-2 sm:gap-4 md:gap-6">
        {trackingStages.map((stage, index) => {
          const Icon = icons[index];
          const isActive = index <= statusIndex;
          return (
            <div key={index} className="flex flex-col items-center z-10 min-w-0 flex-1">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full shadow-md transition-all duration-300 ${
                  isActive ? "bg-[#A75D5D] text-white" : "bg-white text-gray-400 border border-gray-200"
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <p className={`text-xs sm:text-sm mt-1 font-sm text-center truncate w-full ${isActive ? "text-[#d1856c]" : "text-gray-400"}`}>
                {stage}
              </p>
            </div>
          );
        })}
      </div>
    </div>
              </div>
            )}
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
                  <span>Amount</span>
                  <span>₹{order.amount}</span>
                </div>
                <div className="flex justify-between text-gray-600 mt-2">
                  <span>Shipping</span>
                  <span>{order.deliveryOption }</span>
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
           <p className="font-medium">
  {order.address.firstName && order.address.lastName
    ? `${order.address.firstName} ${order.address.lastName}`
    : "Customer"}
</p>

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
  <button
    onClick={() => window.location.href = "mailto:ekalooms@gmail.com"}
    className="w-full py-3 text-white rounded-md transition"
    style={{ backgroundColor: "#A75D5D" }}
    onMouseOver={(e) => e.target.style.backgroundColor = "#D1856C"}
    onMouseOut={(e) => e.target.style.backgroundColor = "#A75D5D"}
  >
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