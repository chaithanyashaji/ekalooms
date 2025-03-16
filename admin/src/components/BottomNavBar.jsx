import React from 'react';
import { NavLink } from 'react-router-dom';
import { AiOutlinePlus, AiOutlineUnorderedList, AiOutlineShoppingCart, AiOutlineTags,AiOutlinePicture } from 'react-icons/ai';

const BottomNavBar = () => {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[90%] bg-[#A75D5D] bg-opacity-95 shadow-lg rounded-full z-50">
      <div className="flex justify-around py-3 px-3">
        {/* Add Items */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center text-white transition ${
              isActive ? 'text-[#FFD1C1]' : ''
            }`
          }
        >
          {({ isActive }) => (
            <div
              className={`flex flex-col items-center p-3 ${
                isActive ? 'bg-white text-[#A75D5D] rounded-full ' : ''
              }`}
            >
              <AiOutlinePlus className="w-6 h-6 " />
            </div>
          )}
        </NavLink>

        {/* List Items */}
        <NavLink
          to="/list"
          className={({ isActive }) =>
            `flex flex-col items-center text-white transition ${
              isActive ? 'text-[#FFD1C1]' : ''
            }`
          }
        >
          {({ isActive }) => (
            <div
              className={`flex flex-col items-center p-3 ${
                isActive ? 'bg-white text-[#A75D5D] rounded-full ' : ''
              }`}
            >
              <AiOutlineUnorderedList className="w-6 h-6 " />
            </div>
          )}
        </NavLink>

        {/* Orders */}
        <NavLink
          to="/orders"
          className={({ isActive }) =>
            `flex flex-col items-center text-white transition ${
              isActive ? 'text-[#FFD1C1]' : ''
            }`
          }
        >
          {({ isActive }) => (
            <div
              className={`flex flex-col items-center p-3 ${
                isActive ? 'bg-white text-[#A75D5D] rounded-full ' : ''
              }`}
            >
              <AiOutlineShoppingCart className="w-6 h-6 " />
            </div>
          )}
        </NavLink>

        {/* Coupon Manager */}
        <NavLink
          to="/coupons"
          className={({ isActive }) =>
            `flex flex-col items-center text-white transition ${
              isActive ? 'text-[#FFD1C1]' : ''
            }`
          }
        >
          {({ isActive }) => (
            <div
              className={`flex flex-col items-center p-3 ${
                isActive ? 'bg-white text-[#A75D5D] rounded-full ' : ''
              }`}
            >
              <AiOutlineTags className="w-6 h-6 " />
            </div>
          )}
        </NavLink>

           {/* Featured Collections Manager */}
           <NavLink
          to="/featured-images"
          className={({ isActive }) =>
            `flex flex-col items-center text-white transition ${
              isActive ? 'text-[#FFD1C1]' : ''
            }`
          }
        >
          {({ isActive }) => (
            <div
              className={`flex flex-col items-center p-3 ${
                isActive ? 'bg-white text-[#A75D5D] rounded-full ' : ''
              }`}
            >
              <AiOutlinePicture className="w-6 h-6 " />
            </div>
          )}
        </NavLink>
      </div>
    </div>
  );
};

export default BottomNavBar;
