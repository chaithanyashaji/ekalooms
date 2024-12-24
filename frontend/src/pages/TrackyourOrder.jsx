import React, { useState, useContext } from "react";
import axios from "axios";
import { ShopContext } from "../context/shopcontext";
import Title from "../components/Title";

const TrackYourOrder = () => {
  const { backendUrl } = useContext(ShopContext);
  const [orderId, setOrderId] = useState("");
  const [orderStatus, setOrderStatus] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // For better UX

  const handleTrackOrder = async () => {
    if (!orderId.trim()) {
      setError("Please enter a valid Order ID.");
      setOrderStatus(null);
      return;
    }

    setLoading(true); // Start loading
    setError(null);
    setOrderStatus(null);

    try {
      const response = await axios.post(`${backendUrl}/api/order/track`, { orderId });

      if (response.data.success) {
        setOrderStatus(response.data.status);
      } else {
        setError("Order not found or invalid Order ID.");
      }
    } catch (error) {
      console.error("Error tracking order:", error.message);
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="border-t pt-16 font-poppins">
      <div className="text-2xl mb-6">
        <Title text1={"TRACK "} text2={"YOUR ORDER"} />
      </div>

      {/* Input Field */}
      <div className="my-4">
        <input
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Enter Order ID"
          className="w-full border px-4 py-2 rounded-sm text-gray-700"
          style={{ borderColor: "#D3756B" }}
        />
        <div className="flex justify-center mt-4">
          <button
            onClick={handleTrackOrder}
            className="px-6 py-2 text-white rounded-sm"
            style={{
              background: "linear-gradient(90deg, #A75D5D, #D3756B)",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            }}
            disabled={loading} // Disable button during loading
          >
            {loading ? "Tracking..." : "Track Order"}
          </button>
        </div>
      </div>

      {/* Status or Error Message */}
      <div className="mt-6">
        {orderStatus && (
          <div className="p-4 text-center bg-green-100 text-green-700 rounded-sm">
            <p>
              <strong>Order Status:</strong> {orderStatus}
            </p>
          </div>
        )}
        {error && (
          <div className="p-4 text-center bg-red-100 text-red-700 rounded-sm">
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackYourOrder;
