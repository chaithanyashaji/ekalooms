import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { CSVLink } from "react-csv";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [trackingIds, setTrackingIds] = useState({});
  const [hideDelivered, setHideDelivered] = useState(false); 

// Handle tracking ID changes
const handleTrackingIdChange = (orderId, value) => {
  setTrackingIds((prev) => ({ ...prev, [orderId]: value }));
};

  const [currentPage, setCurrentPage] = useState(1);
const ordersPerPage = 30; 
// Number of orders per page


  // Fetch all orders
  const fetchAllOrders = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setOrders(response.data.orders);
        setFilteredOrders(response.data.orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  // Flatten orders for CSV export
  const flattenOrders = () =>
    orders.map((order) => ({
      OrderID: order._id,
      Date: new Date(order.date).toLocaleDateString(),
      Name: `${order.address.firstName} ${order.address.lastName}`,
      Email: order.address.email,
      Phone: order.address.phone,
      Street: order.address.street,
      City: order.address.city,
      State: order.address.state,
      Country: order.address.country,
      ZipCode: order.address.zipcode,
      DeliveryOption: order.deliveryOption,
      CouponUsed: order.couponCode || "None",
      PaymentStatus: order.payment ? "Done" : "Pending",
      PaymentMethod: order.paymentMethod || "N/A",
      TotalAmount: `${currency}${order.amount}`,
      Items: order.items
        .map(
          (item) =>
            `${item.name} x ${item.quantity}${
              item.size ? ` (Size: ${item.size})` : ""
            }`
        )
        .join("; "),
      OrderStatus: order.status,
    }));

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    if (query === "") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(
        orders.filter((order) =>
          order.address.firstName.toLowerCase().includes(query) ||
          order.address.lastName.toLowerCase().includes(query) ||
          order.address.email.toLowerCase().includes(query)
        )
      );
    }
  };


  const toggleHideDelivered = () => {
    setHideDelivered((prev) => !prev);
    const updatedOrders = hideDelivered
      ? orders
      : orders.filter((order) => order.status?.toLowerCase() !== "delivered");
    setFilteredOrders(updatedOrders);
  };

  const handleSort = (event) => {
    const order = event.target.value;
    setSortOrder(order);
    const sortedOrders = [...filteredOrders].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return order === "asc" ? dateA - dateB : dateB - dateA;
    });
    setFilteredOrders(sortedOrders);
  };

  const saveTrackingId = async (orderId, trackingId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/update-tracking-id`,
        { orderId, trackingId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.data.success) {
        toast.success("Tracking ID saved successfully!");
        fetchAllOrders(); // Refresh the orders
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error saving tracking ID:", error.message);
      toast.error("Failed to save tracking ID. Please try again.");
    }
  };
  
  

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status: event.target.value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.data.success) {
        toast.success("Order status updated successfully!");
        fetchAllOrders(); // Refresh the order list after updating
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating order status:", error.message);
      toast.error("Failed to update order status. Please try again.");
    }
  };
  
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h3 className="text-2xl font-bold mb-6">Manage Orders</h3>

      {/* Search, Sort, and Export */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchQuery}
          onChange={handleSearch}
          className="border p-3 rounded w-full sm:w-1/2"
        />
        <select
          onChange={(event) => setSortOrder(event.target.value)}
          value={sortOrder}
          className="p-3 border rounded w-full sm:w-1/4"
        >
          <option value="">Sort by Date</option>
          <option value="asc">Oldest First</option>
          <option value="desc">Newest First</option>
        </select>
        <CSVLink
          data={flattenOrders()}
          filename="orders_complete.csv"
          className="p-3 bg-blue-600 text-white rounded"
        >
          Export Complete Orders
        </CSVLink>
        <button
          onClick={toggleHideDelivered}
          className="p-3 bg-gray-200 text-gray-800 rounded sm:w-1/4"
        >
          {hideDelivered ? "Show Delivered" : "Hide Delivered"}
        </button>
      </div>


      {/* Order List */}
      <div className="space-y-4">
      {currentOrders.map((order, index) => (
  <div
  key={order._id}
  className={`grid grid-cols-1 sm:grid-cols-[0.2fr_1.5fr_1fr_1fr_1fr] gap-3 w-full items-center border p-2 rounded-lg shadow-sm pb-20 ${
    order.status?.toLowerCase() === "delivered" ? "bg-green-100" : "bg-white"
  }`}
  
    
  >


    {/* Adjust the index to reflect the overall position */}
    <div className="font-bold text-gray-600">
      #{(currentPage - 1) * ordersPerPage + index + 1}
    </div>

    {/* Order Items */}
    <div>
      <div className="flex flex-wrap gap-2">
        {order.items.map((item, idx) => (
          <img
            key={idx}
            src={item.image[0]}
            alt={item.name}
            className="w-24 h-24 object-cover rounded-lg border"
          />
        ))}
      </div>
      <div className="mt-3">
        {order.items.map((item, idx) => (
          <p className="text-sm text-gray-700" key={idx}>
            {item.name} x {item.quantity}
            {item.size && <span> (Size: {item.size})</span>}
          </p>
        ))}
      </div>
    </div>

    {/* Address */}
    <div>
      <p className="font-medium text-gray-800">
        {order.address.firstName + " " + order.address.lastName}
      </p>
      <p className="text-sm text-gray-600">{order.address.email}</p>
      <p className="text-sm text-gray-600">
        {order.address.street}, {order.address.city}
      </p>
      <p className="text-sm text-gray-600">
        {order.address.state}, {order.address.country},{" "}
        {order.address.zipcode}
      </p>
      <p className="text-sm text-gray-600">{order.address.phone}</p>
    </div>

    {/* Order Details */}
    <div>
      <p className="text-sm text-gray-800">
        Delivery Option: {order.deliveryOption}
      </p>
      <p className="text-sm text-gray-800">
        Coupon Used: {order.couponCode || "None"}
      </p>
      <p className="text-sm text-gray-800">
        Payment Method: {order.paymentMethod || "N/A"}
      </p>
      <p className="text-sm text-gray-800">
        Payment: {order.payment ? "Done" : "Pending"}
      </p>
      <p className="text-sm text-gray-800">
        Date: {new Date(order.date).toLocaleDateString()}
      </p>
    </div>

    {/* Order Status */}
    <div className="text-right">
      <p className="text-lg font-bold text-gray-800">
        {currency} {order.amount}
      </p>
      <select
        onChange={(event) => statusHandler(event, order._id)}
        value={order.status}
        className="mt-2 p-2 border rounded w-full bg-gray-100 font-medium"
      >
        <option value="Order Placed">Order Placed</option>
        <option value="Packing">Packing</option>
        <option value="Shipped">Shipped</option>
        <option value="Out for delivery">Out for delivery</option>
        <option value="Delivered">Delivered</option>
        <option value="Cancelled">Cancelled</option>
        <option value="Cancelled and Eligible for Refund">
          Cancelled and Eligible for Refund
        </option>
      </select>
      <div className="mt-4">
  <label className="block text-gray-700 text-sm font-medium">
    Tracking ID
  </label>
  <div className="flex gap-2">
    <input
      type="text"
      value={trackingIds[order._id] || order.trackingId || ""}
      onChange={(e) => handleTrackingIdChange(order._id, e.target.value)}
      placeholder="Enter Tracking ID"
      className="mt-2 p-2 flex-1 border rounded"
    />
    <button
      onClick={() => saveTrackingId(order._id, trackingIds[order._id] || "")}
      className="mt-2 p-2 bg-blue-600 text-white rounded"
    >
      Save
    </button>
  </div>
</div>

</div>
    
  </div>
))}

         
        
      </div>
    {/* Pagination */}
    <div className="flex justify-center mt-6 pb-10">
        {Array.from(
          { length: Math.ceil(filteredOrders.length / ordersPerPage) },
          (_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`px-4 py-2 mx-1 rounded ${
                currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default Orders;
