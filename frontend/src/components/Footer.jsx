import React from 'react';

import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
        <div>
          <img src="https://res.cloudinary.com/dzzhbgbnp/image/upload/v1735222002/logo_bo4y6g.png" className='mb-5 w-32' alt="Logo" />
          <p className='prata-regular text-gray-600 p-2 text-left'>
          Eka Looms—Where craft meets comfort, & every thread tells a story</p>
        </div>
        <div>
          <p className='text-xl font-medium mb-5 text-[#D3756B]'>COMPANY</p>
          <ul className="flex flex-col gap-1 text-gray-600">
      <li className="cursor-pointer" onClick={() => navigate('/')}>
        Home
      </li>
      <li className="cursor-pointer" onClick={() => navigate('/about')}>
        About us
      </li>
      <li className="cursor-pointer" onClick={() => navigate('/policy')}>
        FAQ
      </li>
     
    </ul>
        </div>
        <div>
          <p className='text-xl font-medium mb-5 text-[#D3756B]'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>+91 9113054569</li>
            <li>Contact us :  ekalooms@gmail.com</li>
          </ul>
        </div>
      </div>
      <div>
        <hr className='border-[#F0997D]' />
        <p className='py-5 text-sm text-center text-[#A75D5D] pb-40'>
          Copyright 2024 @ekalooms.com - All rights reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
