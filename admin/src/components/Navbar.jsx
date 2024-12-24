import React from 'react';
import { assets } from '../assets/assets';

const Navbar = ({ setToken }) => {
  return (
    <div className='flex items-center py-4 px-6 justify-between bg-white shadow-md'>
      <img className='w-[80px] max-w-[10%] object-contain' src={assets.logo} alt='Logo' />
      <button 
        onClick={() => setToken('')} 
        className='bg-[#D3756B] hover:bg-[#FFC3A1] text-white px-6 py-2 rounded-full text-sm transition duration-300'>
        Logout
      </button>
    </div>
  );
};

export default Navbar;
