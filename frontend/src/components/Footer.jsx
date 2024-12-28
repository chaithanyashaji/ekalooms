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
          <p className="prata-regular text-gray-600 text-left">
            Adding colorful weaves to your wardrobe.
          </p>
        </div>

        {/* Quick Links Section */}
        <div>
          <p className="text-xl font-medium mb-5 text-[#D3756B]">Quick Links</p>
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

        {/* Need Help Section */}
        <div>
          <p className="text-xl font-medium mb-5 text-[#D3756B]">Need Help?</p>
          <div className="bg-[#FFF5EB] p-5 rounded-md">
            <p className="text-sm text-[#A75D5D] mb-3 font-semibold">
              MON - SAT: 10:00 AM TO 7:30 PM (IST)
            </p>
            <ul className="flex flex-col gap-2 text-gray-600">
              <li>
                <a
                  href="https://wa.me/9113054569"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[#A75D5D]"
                >
                  <i className="fab fa-whatsapp text-[#A75D5D]"></i> Order on WhatsApp
                </a>
              </li>
              <li
                className="cursor-pointer hover:text-[#A75D5D] flex items-center gap-2"
                onClick={() => navigate('/policy/#refund')}
              >
                <i className="fas fa-handshake text-[#D3756B]"></i> Return/Refund Policy
              </li>
              <li
                className="cursor-pointer hover:text-[#A75D5D] flex items-center gap-2"
                onClick={() => navigate('/policy#privacy')}
              >
                <i className="fas fa-shield-alt text-[#A75D5D]"></i> Privacy Policy
              </li>
              <li>
                <a href="tel:+919113054569" className="flex items-center gap-2 hover:text-[#A75D5D]">
                  <i className="fas fa-phone-alt text-[#D3756B]"></i> Call Us: +91-9113054569
                </a>
              </li>
              <li>
                <a
                  href="mailto:ekalooms@gmail.com"
                  className="flex items-center gap-2 hover:text-[#A75D5D]"
                >
                  <i className="fas fa-envelope text-[#A75D5D]"></i> Email Us: ekalooms@gmail.com
                </a>
              </li>
              
            </ul>
          </div>
        </div>
      </div>

      {/* Divider and Copyright */}
      <div className="relative mt-8">
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
