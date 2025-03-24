import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 text-sm">
        {/* Logo and About Section */}
        <div>
          <img
            src="https://res.cloudinary.com/dzzhbgbnp/image/upload/v1742820840/cropped_ekalooms_rmp6ds.png"
            className="mb-5 w-32"
            alt="Logo"
          />
          <p className="prata-regular text-[#4A2932] text-left">
            Adding colorful weaves to your wardrobe.
          </p>
        </div>

        {/* Quick Links Section */}
        <div>
          <p className="text-xl font-medium mb-5 text-[#65000B]">Quick Links</p>
          <ul className="flex flex-col gap-1 text-[#6E4A51]">
            <li
              className="cursor-pointer hover:text-[#65000B] transition-colors duration-200"
              onClick={() => navigate('/')}
            >
              Home
            </li>
            <li
              className="cursor-pointer hover:text-[#65000B] transition-colors duration-200"
              onClick={() => navigate('/about')}
            >
              About Us
            </li>
            <li
              className="cursor-pointer hover:text-[#65000B] transition-colors duration-200"
              onClick={() => navigate('/policy')}
            >
              FAQ
            </li>
          </ul>
        </div>

        {/* Need Help Section */}
        <div>
          <p className="text-xl font-medium mb-5 text-[#65000B]">Need Help?</p>
          <div className="bg-[#F9F2F3] p-5 rounded-md border border-[#E5D3D5]">
            <p className="text-sm text-[#65000B] mb-3 font-semibold">
              MON - SAT: 10:00 AM TO 7:30 PM (IST)
            </p>
            <ul className="flex flex-col gap-2 text-[#6E4A51]">
              <li>
                <a
                  href="https://wa.me/9113054569"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[#65000B] transition-colors duration-200"
                >
                  <i className="fab fa-whatsapp text-[#872F3C]"></i> Order on WhatsApp
                </a>
              </li>
              <li
                className="cursor-pointer hover:text-[#65000B] flex items-center gap-2 transition-colors duration-200"
                onClick={() => navigate('/policy/#refund')}
              >
                <i className="fas fa-handshake text-[#872F3C]"></i> Return/Refund Policy
              </li>
              <li
                className="cursor-pointer hover:text-[#65000B] flex items-center gap-2 transition-colors duration-200"
                onClick={() => navigate('/policy#privacy')}
              >
                <i className="fas fa-shield-alt text-[#872F3C]"></i> Privacy Policy
              </li>
              <li>
                <a href="tel:+919113054569" className="flex items-center gap-2 hover:text-[#65000B] transition-colors duration-200">
                  <i className="fas fa-phone-alt text-[#872F3C]"></i> Call Us: +91-9113054569
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@ekalooms.com"
                  className="flex items-center gap-2 hover:text-[#65000B] transition-colors duration-200"
                >
                  <i className="fas fa-envelope text-[#872F3C]"></i> Email Us: contact@ekalooms.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Divider and Copyright with decorative pattern */}
      <div className="relative mt-8">
        <div className="h-px w-full bg-gradient-to-r from-[#F9F2F3] via-[#872F3C] to-[#F9F2F3]"></div>
        <p
          className="py-5 text-sm text-center text-[#65000B]"
          style={{ marginBottom: '70px' }}
        >
          &copy; {new Date().getFullYear()} ekalooms - All rights reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;