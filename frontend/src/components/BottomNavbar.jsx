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
    <nav className="fixed bottom-4 left-2 right-2 bg-[#65000b] bg-opacity-95 backdrop-blur-2xl p-1.5 rounded-full flex justify-between items-center z-50 max-w-[350px] mx-auto shadow-md">
      {/* Home */}
      <NavLink
        to="/"
        onClick={() => handleNavigation('/')}
        className={`cursor-pointer w-[55px] h-[55px] flex flex-col items-center justify-center rounded-full transition-all duration-300 ${
          active === '/'
            ? 'bg-gradient-to-br from-[#D3756B] to-[#FFC3A1] shadow-md shadow-[#F0997D]'
            : ''
        }`}
      >
        <HomeIcon
          className={`w-6 h-6 ${
            active === '/'
              ? 'text-white'
              : 'text-white/50'
          }`}
        />
        <span className={`text-[8px]   mt-0.5 ${
          active === '/' ? 'text-white' : 'text-white/50'
        }`}>Home</span>
      </NavLink>

      {/* Collection */}
      <NavLink
        to="/collection"
        onClick={() => handleNavigation('/collection')}
        className={`cursor-pointer w-[55px] h-[55px] flex flex-col items-center justify-center rounded-full transition-all duration-300 ${
          active === '/collection'
            ? 'bg-gradient-to-br from-[#D3756B] to-[#FFC3A1] shadow-md shadow-[#F0997D]'
            : ''
        }`}
      >
        <ViewGridIcon
          className={`w-6 h-6 ${
            active === '/collection'
              ? 'text-white'
              : 'text-white/50'
          }`}
        />
        <span className={`text-[9px]   mt-0.5 ${
          active === '/collection' ? 'text-white' : 'text-white/50'
        }`}>Shop</span>
      </NavLink>

      {/* Orders */}
      {token && (
        <NavLink
          to="/orders"
          onClick={() => handleNavigation('/orders')}
          className={`cursor-pointer w-[55px] h-[55px] flex flex-col items-center justify-center rounded-full transition-all duration-300 ${
            active === '/orders'
              ? 'bg-gradient-to-br from-[#D3756B] to-[#FFC3A1] shadow-md shadow-[#F0997D]'
              : ''
          }`}
        >
          <ClipboardListIcon
            className={`w-6 h-6 ${
              active === '/orders'
                ? 'text-white'
                : 'text-white/50'
            }`}
          />
          <span className={`text-[9px]   mt-0.5 ${
            active === '/orders' ? 'text-white' : 'text-white/50'
          }`}>Orders</span>
        </NavLink>
      )}

      {/* Wishlist */}
      <NavLink
        to="/wishlist"
        onClick={() => handleNavigation('/wishlist')}
        className={`cursor-pointer w-[55px] h-[55px] flex flex-col items-center justify-center rounded-full transition-all duration-300 ${
          active === '/wishlist'
            ? 'bg-gradient-to-br from-[#D3756B] to-[#FFC3A1] shadow-md shadow-[#F0997D]'
            : ''
        }`}
      >
        <HeartIcon
          className={`w-6 h-6 ${
            active === '/wishlist'
              ? 'text-white'
              : 'text-white/50'
          }`}
        />
        <span className={`text-[9px]   mt-0.5 ${
          active === '/wishlist' ? 'text-white' : 'text-white/50'
        }`}>Wishlist</span>
      </NavLink>

      {/* Cart */}
      <NavLink
        to="/cart"
        onClick={() => handleNavigation('/cart')}
        className={`cursor-pointer w-[55px] h-[55px] flex flex-col items-center justify-center rounded-full transition-all duration-300 ${
          active === '/cart'
            ? 'bg-gradient-to-br from-[#D3756B] to-[#F0997D] shadow-md shadow-[#FFC3A1]'
            : ''
        } relative`}
      >
        <div className="flex flex-col items-center">
          <div className="relative">
            <ShoppingCartIcon
              className={`w-6 h-6 ${
                active === '/cart'
                  ? 'text-white'
                  : 'text-white/50'
              }`}
            />
            <p className="absolute top-[-3px] right-[-3px] w-2.5 h-2.5 text-center leading-[10px] text-white rounded-full text-[6px] bg-[#65000B]">
              {getCartCount()}
            </p>
          </div>
          <span className={`text-[9px]    mt-0.5 ${
            active === '/cart' ? 'text-white' : 'text-white/50'
          }`}>Cart</span>
        </div>
      </NavLink>
    </nav>
  );
};

export default BottomNavbar;