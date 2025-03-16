import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/shopcontext";
import Title from "../components/Title";
import axios from "axios";
import ReviewForm from "../components/ReviewForm";

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(null);
  const [reviewedItems, setReviewedItems] = useState([]);

  const handleReviewSubmit = () => {
    setReviewedItems([...reviewedItems, showReviewForm]); // Mark the item as reviewed
    setShowReviewForm(null); // Close the modal
    loadOrderData(); // Reload orders to reflect changes
  };

  const loadOrderData = async () => {
    try {
      if (!token) return;

      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        let allOrdersItem = [];
        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            item.orderId = order._id; // Add Order ID to item
            item.status = order.status;
            item.payment = order.payment;
            item.paymentMethod = order.paymentMethod;
            item.date = order.date;
            item.trackingId = order.trackingId;
            allOrdersItem.push(item);
          });
        });

        const reversedOrders = allOrdersItem.reverse();
        setOrderData(reversedOrders);
        setFilteredOrders(reversedOrders);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = orderData.filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        item.status.toLowerCase().includes(term) ||
        item.paymentMethod.toLowerCase().includes(term) ||
        item.orderId.toLowerCase().includes(term) // Search by Order ID
    );

    setFilteredOrders(filtered);
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div className="border-t pt-16 ">
      <div className="text-2xl">
        <Title text1={"MY "} text2={"ORDERS"} />
      </div>

      {/* Search Bar */}
      <div className="my-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search orders (e.g., product name, status, payment method, order ID)"
          className="w-full border px-4 py-2 rounded-sm text-gray-700"
          style={{ borderColor: "#D3756B" }}
        />
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((item, index) => (
            <div
              key={index}
              className="border p-4 rounded-md shadow-md bg-white"
            >
              {/* Order Header */}
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <p className="font-medium text-lg">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    Date: {new Date(item.date).toDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Order ID: <span className="text-gray-800">{item.orderId}</span>
                  </p>
                </div>
                <p
                  className={`px-2 py-1 rounded-md ${
                    item.status === "Delivered"
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {item.status}
                </p>
              </div>

              {/* Order Details */}
              <div className="mt-4 flex flex-wrap gap-4">
                <img
                  src={item.image[0]}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-md border"
                />
                <div className="flex flex-col justify-between">
                  <p className="text-sm">
                    <strong>Price:</strong> {currency}
                    {item.price}
                  </p>
                  <p className="text-sm">
                    <strong>Quantity:</strong> {item.quantity}
                  </p>
                  {item.sizes && item.sizes.length > 0 && item.size && (
  <p className="text-sm">
    <strong>Size:</strong> {item.size}
  </p>
)}

                  <p className="text-sm">
                    <strong>Payment Method:</strong> {item.paymentMethod}
                  </p>
                  {item.trackingId && (
                    <p className="text-sm">
                      <strong>Tracking ID:</strong> {item.trackingId}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex justify-end items-center gap-4">
                {item.status === "Delivered" &&
                  (reviewedItems.includes(item._id) ? (
                    <p className="text-sm font-medium text-gray-500">Reviewed</p>
                  ) : (
                    <button
                      onClick={() => setShowReviewForm(item._id)}
                      className="px-4 py-2 border text-sm font-medium rounded-md text-blue-600 border-blue-600 hover:bg-blue-50"
                    >
                      Write a Review
                    </button>
                  ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center mt-4">
            No orders found matching your search.
          </p>
        )}
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <ReviewForm
          productId={showReviewForm}
          onClose={() => setShowReviewForm(null)}
          onSubmit={handleReviewSubmit}
        />
      )}
    </div>
  );
};

export default Orders;
