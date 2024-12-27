import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-40">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 text-sm">
        {/* Logo and About Section */}
        <div>
          <img
            src="https://res.cloudinary.com/dzzhbgbnp/image/upload/v1735222002/logo_bo4y6g.png"
            className="mb-5 w-32"
            alt="Logo"
          />
          <p className="prata-regular text-gray-600 text-left ">
            Eka Looms — Adding colorful weaves to your wardrobe.
          </p>
        </div>

        {/* Company Links Section */}
        <div>
          <p className="text-xl font-medium mb-5 text-[#D3756B]">COMPANY</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li
              className="cursor-pointer hover:text-[#A75D5D]"
              onClick={() => navigate('/')}
            >
              Home
            </li>
            <li
              className="cursor-pointer hover:text-[#A75D5D]"
              onClick={() => navigate('/about')}
            >
              About Us
            </li>
            <li
              className="cursor-pointer hover:text-[#A75D5D]"
              onClick={() => navigate('/policy')}
            >
              FAQ
            </li>
          </ul>
        </div>

        {/* Contact Information Section */}
        <div>
          <p className="text-xl font-medium mb-5 text-[#D3756B]">GET IN TOUCH</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>Phone: +91-9113054569</li>
            <li>Email: ekalooms@gmail.com</li>
          </ul>
        </div>
      </div>

      {/* Divider and Copyright */}
      <div className="relative">
        <hr className="border-[#F0997D]" />
        <p
          className="py-5 text-sm text-center text-[#A75D5D]"
          style={{ marginBottom: '70px' }} // Adjust margin to avoid overlapping with bottom navigation
        >
          &copy; {new Date().getFullYear()} @ekalooms.com - All rights reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
