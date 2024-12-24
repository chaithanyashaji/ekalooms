import React, { useContext, useEffect, useState } from 'react';  
import { NavLink, useLocation } from 'react-router-dom'; 
import { ShopContext } from '../context/shopcontext'; 
import { 
  HomeIcon, 
  ViewGridIcon, 
  ShoppingCartIcon, 
  ClipboardListIcon, 
  HeartIcon 
} from '@heroicons/react/outline';    

const BottomNavbar = () => {   
  const location = useLocation();
  const { token, navigate, getCartCount, } = useContext(ShopContext);   
  const [active, setActive] = useState(location.pathname);    

  // Update active state when location changes
  useEffect(() => {
    setActive(location.pathname);
  }, [location.pathname]);

  const handleNavigation = (path) => {
    navigate(path);
  };    

  return (
    <nav className="fixed bottom-4 left-4 right-4 bg-[#9d4a54] bg-opacity-95 backdrop-blur-2xl p-2 rounded-full flex justify-between items-center z-50 max-w-[400px]  mx-auto shadow-lg">
      {/* Home */}
      <NavLink
        to="/"
        onClick={() => handleNavigation('/')}
        className={`cursor-pointer w-[60px] h-[60px] flex items-center justify-center rounded-full transition-all duration-300 ${
          active === '/' 
            ? 'bg-gradient-to-br from-[#D3756B] to-[#FFC3A1] shadow-md shadow-[#F0997D]' 
            : ''
        }`}
      >
        <HomeIcon
          className={`w-7 h-7 ${
            active === '/' 
              ? 'text-white shadow-white bg-transparent border-circle' 
              : 'text-white/50'
          }`}
        />
      </NavLink>
      
      {/* Collection */}
      <NavLink
        to="/collection"
        onClick={() => handleNavigation('/collection')}
        className={`cursor-pointer w-[60px] h-[60px] flex items-center justify-center rounded-full transition-all duration-300 ${
          active === '/collection' 
            ? 'bg-gradient-to-br from-[#D3756B] to-[#FFC3A1] shadow-md shadow-[#F0997D]' 
            : ''
        }`}
      >
        <ViewGridIcon
          className={`w-7 h-7 ${
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
          className={`cursor-pointer w-[60px] h-[60px] flex items-center justify-center rounded-full transition-all duration-300 ${
            active === '/orders' 
              ? 'bg-gradient-to-br from-[#D3756B] to-[#FFC3A1] shadow-md shadow-[#F0997D]' 
              : ''
          }`}
        >
          <ClipboardListIcon
            className={`w-7 h-7 ${
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
        onClick={() => 
          {
            handleNavigation('/wishlist')}}
        className={`cursor-pointer w-[60px] h-[60px] flex items-center justify-center rounded-full transition-all duration-300 ${
          active === '/wishlist' 
            ? 'bg-gradient-to-br from-[#D3756B] to-[#FFC3A1] shadow-md shadow-[#F0997D]' 
            : ''
        }`}
      >
        <HeartIcon
          className={`w-7 h-7 ${
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
        className={`cursor-pointer w-[60px] h-[60px] flex items-center justify-center rounded-full transition-all duration-300 ${
          active === '/cart' 
            ? 'bg-gradient-to-br from-[#D3756B] to-[#F0997D] shadow-md shadow-[#FFC3A1]' 
            : ''
        } relative`}
      >
        <div className="relative">
          <ShoppingCartIcon
            className={`w-7 h-7 ${
              active === '/cart' 
                ? 'text-white shadow-white' 
                : 'text-white/50'
            }`}
          />
          <p className="absolute top-[-6px] right-[-6px] w-4 h-4 text-center leading-4 text-white aspect-square rounded-full text-[10px] bg-[#A75D5D]">
            {getCartCount()}
          </p>
        </div>
      </NavLink>
    </nav>
  ); 
};  

export default BottomNavbar;