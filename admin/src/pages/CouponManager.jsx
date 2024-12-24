import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaTrash, FaCheck, FaPlus } from "react-icons/fa";
import { backendUrl } from "../App";

const CouponManager = ({ token }) => {
  const [coupons, setCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discount: "",
    expiresAt: "",
  });

  const fetchCoupons = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/coupon/list`, {
        headers: { token },
      });
      if (response.data.success) {
        setCoupons(response.data.coupons);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error fetching coupons");
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const validateCoupon = async (code) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/coupon/validate`,
        { code },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(`Coupon is valid with ${response.data.discount}% discount!`);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error validating coupon");
    }
  };

  const createCoupon = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/coupon/create`,
        newCoupon,
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success("Coupon created successfully!");
        fetchCoupons();
        setNewCoupon({ code: "", discount: "", expiresAt: "" });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error creating coupon");
    }
  };

  const deactivateCoupon = async (code) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/coupon/deactivate`,
        { code },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success("Coupon deactivated!");
        fetchCoupons();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error deactivating coupon");
    }
  };

  const reactivateCoupon = async (code) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/coupon/reactivate`,
        { code },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success("Coupon reactivated!");
        fetchCoupons();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error reactivating coupon");
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 pb-20">
      <h2 className="text-xl font-semibold mb-4">Coupon Management</h2>

      {/* Create Coupon Form */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium mb-4">Create New Coupon</h3>
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <input
            type="text"
            placeholder="Coupon Code"
            value={newCoupon.code}
            onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
            className="p-2 border rounded flex-1"
          />
          <input
            type="number"
            placeholder="Discount (%)"
            value={newCoupon.discount}
            onChange={(e) => setNewCoupon({ ...newCoupon, discount: e.target.value })}
            className="p-2 border rounded flex-1"
          />
          <input
            type="date"
            placeholder="Expires At"
            value={newCoupon.expiresAt}
            onChange={(e) => setNewCoupon({ ...newCoupon, expiresAt: e.target.value })}
            className="p-2 border rounded flex-1"
          />
        </div>
        <button
          onClick={createCoupon}
          className="mt-4 w-full sm:w-auto px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          Create Coupon
        </button>
      </div>

      {/* Coupons List */}
      <div className="overflow-x-auto pb-20">
        <h3 className="text-lg font-medium mb-4">All Coupons</h3>
        
        {/* Desktop View */}
        <div className="hidden md:block">
          <div className="grid grid-cols-4 gap-4 items-center bg-gray-100 p-4 rounded-t-lg font-medium">
            <p>Code</p>
            <p>Discount</p>
            <p>Status</p>
            <p className="text-center">Actions</p>
          </div>
          {coupons.map((coupon) => (
            <div
              key={coupon.code}
              className="grid grid-cols-4 gap-4 items-center p-4 border-b hover:bg-gray-50"
            >
              <p>{coupon.code}</p>
              <p>{coupon.discount}%</p>
              <p>{coupon.isActive ? "Active" : "Inactive"}</p>
              <div className="flex justify-center items-center">
                {coupon.isActive ? (
                  <button
                    onClick={() => deactivateCoupon(coupon.code)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <FaTrash />
                  </button>
                ) : (
                  <button
                    onClick={() => reactivateCoupon(coupon.code)}
                    className="p-2 text-green-500 hover:bg-green-50 rounded-full transition-colors"
                  >
                    <FaCheck />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-4">
          {coupons.map((coupon) => (
            <div
              key={coupon.code}
              className="bg-white p-4 rounded-lg border shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">{coupon.code}</h4>
                {coupon.isActive ? (
                  <button
                    onClick={() => deactivateCoupon(coupon.code)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <FaTrash />
                  </button>
                ) : (
                  <button
                    onClick={() => reactivateCoupon(coupon.code)}
                    className="p-2 text-green-500 hover:bg-green-50 rounded-full transition-colors"
                  >
                    <FaCheck />
                  </button>
                )}
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Discount: {coupon.discount}%</p>
                <p>Status: {coupon.isActive ? "Active" : "Inactive"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CouponManager;