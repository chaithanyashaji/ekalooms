import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ShopContext } from '../context/shopcontext';
import {
  HomeIcon,
  ViewGridIcon,
  ShoppingCartIcon,
  ClipboardListIcon,
  HeartIcon,
} from '@heroicons/react/outline';

const BottomNavbar = () => {
  const location = useLocation();
  const { token, navigate, getCartCount } = useContext(ShopContext);
  const [active, setActive] = useState(location.pathname);

  // Update active state when location changes
  useEffect(() => {
    setActive(location.pathname);
  }, [location.pathname]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <nav className="fixed bottom-4 left-2 right-2 bg-[#9d4a54] bg-opacity-95 backdrop-blur-2xl p-1.5 rounded-full flex justify-between items-center z-50 max-w-[350px] mx-auto shadow-md">
      {/* Home */}
      <NavLink
        to="/"
        onClick={() => handleNavigation('/')}
        className={`cursor-pointer w-[55px] h-[55px] flex items-center justify-center rounded-full transition-all duration-300 ${
          active === '/'
            ? 'bg-gradient-to-br from-[#D3756B] to-[#FFC3A1] shadow-md shadow-[#F0997D]'
            : ''
        }`}
      >
        <HomeIcon
          className={`w-6 h-6 ${
            active === '/'
              ? 'text-white shadow-white'
              : 'text-white/50'
          }`}
        />
      </NavLink>

      {/* Collection */}
      <NavLink
        to="/collection"
        onClick={() => handleNavigation('/collection')}
        className={`cursor-pointer w-[55px] h-[55px] flex items-center justify-center rounded-full transition-all duration-300 ${
          active === '/collection'
            ? 'bg-gradient-to-br from-[#D3756B] to-[#FFC3A1] shadow-md shadow-[#F0997D]'
            : ''
        }`}
      >
        <ViewGridIcon
          className={`w-6 h-6 ${
            active === '/collection'
              ? 'text-white shadow-white'
              : 'text-white/50'
          }`}
        />
      </NavLink>

      {/* Orders */}
      {token && (
        <NavLink
          to="/orders"
          onClick={() => handleNavigation('/orders')}
          className={`cursor-pointer w-[55px] h-[55px] flex items-center justify-center rounded-full transition-all duration-300 ${
            active === '/orders'
              ? 'bg-gradient-to-br from-[#D3756B] to-[#FFC3A1] shadow-md shadow-[#F0997D]'
              : ''
          }`}
        >
          <ClipboardListIcon
            className={`w-6 h-6 ${
              active === '/orders'
                ? 'text-white shadow-white'
                : 'text-white/50'
            }`}
          />
        </NavLink>
      )}

      {/* Wishlist */}
      <NavLink
        to="/wishlist"
        onClick={() => handleNavigation('/wishlist')}
        className={`cursor-pointer w-[55px] h-[55px] flex items-center justify-center rounded-full transition-all duration-300 ${
          active === '/wishlist'
            ? 'bg-gradient-to-br from-[#D3756B] to-[#FFC3A1] shadow-md shadow-[#F0997D]'
            : ''
        }`}
      >
        <HeartIcon
          className={`w-6 h-6 ${
            active === '/wishlist'
              ? 'text-white shadow-white'
              : 'text-white/50'
          }`}
        />
      </NavLink>

      {/* Cart */}
      <NavLink
        to="/cart"
        onClick={() => handleNavigation('/cart')}
        className={`cursor-pointer w-[55px] h-[55px] flex items-center justify-center rounded-full transition-all duration-300 ${
          active === '/cart'
            ? 'bg-gradient-to-br from-[#D3756B] to-[#F0997D] shadow-md shadow-[#FFC3A1]'
            : ''
        } relative`}
      >
        <div className="relative">
          <ShoppingCartIcon
            className={`w-6 h-6 ${
              active === '/cart'
                ? 'text-white shadow-white'
                : 'text-white/50'
            }`}
          />
          <p className="absolute top-[-4px] right-[-4px] w-3 h-3 text-center leading-3 text-white rounded-full text-[8px] bg-[#A75D5D]">
            {getCartCount()}
          </p>
        </div>
      </NavLink>
    </nav>
  );
};

export default BottomNavbar;
