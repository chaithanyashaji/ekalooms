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
      if (!token) {
        return null;
      }

            
      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {}, // Empty body or replace with actual data
        {
            headers: {
                Authorization: `Bearer ${token}`, // Pass the token correctly
            },
        }
    );
    
      
      if (response.data.success) {
        let allOrdersItem = [];
        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            item.status = order.status;
            item.payment = order.payment;
            item.paymentMethod = order.paymentMethod;
            item.date = order.date;
            allOrdersItem.push(item);
          });
        });
        const reversedOrders = allOrdersItem.reverse();
        setOrderData(reversedOrders);
        setFilteredOrders(reversedOrders); // Initialize filtered orders
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
        item.paymentMethod.toLowerCase().includes(term)
    );

    setFilteredOrders(filtered);
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div className="border-t pt-16 font-poppins">
      <div className="text-2xl">
        <Title text1={"MY "} text2={"ORDERS"} />
      </div>

      {/* Search Bar */}
      <div className="my-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search orders (e.g., product name, status, payment method)"
          className="w-full border px-4 py-2 rounded-sm text-gray-700"
          style={{ borderColor: "#D3756B" }}
        />
      </div>

      {/* Orders List */}
      <div>
        {filteredOrders.length > 0 ? (
          filteredOrders.map((item, index) => (
            <div
              key={index}
              className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              style={{
                borderColor: "#D3756B",
              }}
            >
              <div className="flex items-start gap-6 text-sm">
                <img className="w-16 rounded-md sm:w-20" src={item.image[0]} alt="" />
                <div>
                  <p className="sm:text-base prata-regular font-medium text-black">
                    {item.name}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-base text-gray-800">
                    <p className="text-lg">
                      {currency}
                      {item.price}
                    </p>
                    <p>Quantity: {item.quantity}</p>
                    {item.sizes && item.sizes.length > 0 && item.size && (
        <p>Size: {item.size}</p>
      )}
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    Date:{" "}
                    <span className="text-gray-400">
                      {new Date(item.date).toDateString()}
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    Payment:{" "}
                    <span className="text-gray-400">{item.paymentMethod}</span>
                  </p>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-between">
                <div className="flex items-center gap-2">
                  <p
                    className={`min-w-2 h-2 rounded-full ${
                      item.status === "Delivered"
                        ? "bg-green-600"
                        : "bg-gray-500"
                    }`}
                  ></p>
                  <p className="text-sm md:text-base text-gray-800">
                    {item.status}
                  </p>
                </div>
                {item.status === "Delivered" &&
                  (reviewedItems.includes(item._id) ? (
                    <p className="text-sm font-medium text-gray-800">
                      Reviewed
                    </p>
                  ) : (
                    <button
                      onClick={() => setShowReviewForm(item._id)}
                      className="border px-4 py-2 text-sm font-medium rounded-sm"
                      style={{
                        borderColor: "#A75D5D",
                        color: "#A75D5D",
                      }}
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
