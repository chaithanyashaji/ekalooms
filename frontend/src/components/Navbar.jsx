import React, { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/shopcontext";
import { MenuIcon, SearchIcon, UserIcon, XIcon } from "@heroicons/react/outline";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { assets } from "../assets/assets";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const { setShowSearch, navigate, token, setToken, } = useContext(ShopContext);

  const logout = () => {
    // Clear tokens and navigate to the login page
    localStorage.removeItem("token");
    
    localStorage.removeItem("refreshToken"); // Clear the refresh token as well
    setToken("");
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-between h-16 px-4 sm:px-6 md:px-10 font-medium w-full mx-auto">
      {/* Left Section: Menu Icon and Links for larger screens */}
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        <MenuIcon
          onClick={() => setVisible(true)}
          className="w-6 h-6 cursor-pointer text-[#D3756B] hover:text-[#F0997D] transition-all sm:hidden"
        />

        {/* Links for larger screens */}
        <div className="hidden sm:flex items-center">
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? "py-2 px-2 text-sm prata-regular text-[#D3756B] hover:text-[#F0997D] border-b-2 border-[#D3756B] transition-all"
                : "py-2 px-2 text-sm prata-regular text-[#D3756B] hover:text-[#F0997D] transition-all"
            }
          >
            About
          </NavLink>

          <NavLink
            to="/policy"
            className={({ isActive }) =>
              isActive
                ? "py-2 px-2 text-sm prata-regular text-[#D3756B] hover:text-[#F0997D] border-b-2 border-[#D3756B] transition-all"
                : "py-2 px-2 text-sm prata-regular text-[#D3756B] hover:text-[#F0997D] transition-all"
            }
          >
            Our Policy
          </NavLink>
        </div>
      </div>

      {/* Center Section: Logo */}
      <div className="flex-1 flex justify-center">
        <Link to="/" className="flex items-center gap-2">
          <img className="w-10 sm:w-12" src={assets.logo} alt="Logo" />
          <h1 className="mt-2 text-xl sm:text-lg prata-regular text-[#A75D5D]">
            ekalooms
          </h1>
        </Link>
      </div>

      {/* Right Section: Search, Cart, and User */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Search Icon */}
        <SearchIcon
          onClick={() => setShowSearch(true)}
          className="w-6 h-6 cursor-pointer text-[#D3756B] hover:text-[#F0997D] transition-all"
        />

        {/* User Icon */}
        <div className="relative group">
          <UserIcon
            onClick={() => (!token ? navigate("/login") : null)}
            className="w-6 h-6 cursor-pointer text-[#D3756B] hover:text-[#F0997D] transition-all"
            aria-label={token ? "User Options" : "Login"}
          />

          {token && (
            <div className="absolute right-0 mt-2 hidden group-hover:block z-50">
              <div className="flex flex-col gap-2 w-32 py-3 px-4 bg-white border border-gray-200 shadow-lg text-[#D3756B] rounded-lg transition-transform duration-150 ease-in-out">
                
                <p
                  onClick={logout}
                  className="hover:text-[#F0997D] cursor-pointer transition-colors duration-150 ease-in-out"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && logout()}
                >
                  Logout
                </p>
              </div>
            </div>
          )}
        </div>

        <NavLink
          to="/trackyourOrder"
          className={({ isActive }) =>
            isActive
              ? "hidden sm:flex flex-row py-2 px-2 text-sm prata-regular text-[#D3756B] hover:text-[#F0997D] border-b-2 border-[#D3756B] transition-all"
              : "hidden sm:flex flex-row py-2 px-2 text-sm prata-regular text-[#D3756B] hover:text-[#F0997D] transition-all"
          }
        >
          Track order
        </NavLink>
      </div>

      {/* Sidebar: Sliding Menu */}
      <div
        className={`fixed top-0 left-0 h-full z-10 bg-white shadow-md transition-transform ease-in-out duration-300 ${
          visible ? "translate-x-0" : "-translate-x-full"
        } w-64 sm:w-72 z-50`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between py-6 px-4 shadow-sm">
            <div className="flex items-center gap-2">
              <img className="w-12" src={assets.logo} alt="Logo" />
              <h1 className="text-xl sm:text-2xl prata-regular text-[#A75D5D]">
                ekalooms
              </h1>
            </div>
            <XIcon
              onClick={() => setVisible(false)}
              className="w-6 h-6 cursor-pointer text-[#D3756B] hover:text-[#F0997D] transition-all"
            />
          </div>

          {/* Sidebar Links */}
          <div className="flex prata-regular flex-col mt-4">
            <NavLink
              to="/about"
              onClick={() => setVisible(false)}
              className={({ isActive }) =>
                isActive
                  ? "py-3 px-6 bg-gradient-to-r from-[#D3756B] to-[#FFC3A1] text-white hover:bg-[#F8E4E7] hover:text-[#F0997D] transition-all"
                  : "py-3 px-6 text-[#D3756B] hover:bg-[#F8E4E7] hover:text-[#F0997D] transition-all"
              }
            >
              About Us
            </NavLink>

            <NavLink
              to="/trackyourOrder"
              onClick={() => setVisible(false)}
              className={({ isActive }) =>
                isActive
                  ? "py-3 px-6 bg-gradient-to-r from-[#D3756B] to-[#FFC3A1] text-white hover:bg-[#F8E4E7] hover:text-[#F0997D] transition-all"
                  : "py-3 px-6 text-[#D3756B] hover:bg-[#F8E4E7] hover:text-[#F0997D] transition-all"
              }
            >
              Track Your Order
            </NavLink>
            <NavLink
              to="/policy"
              onClick={() => setVisible(false)}
              className={({ isActive }) =>
                isActive
                  ? "py-3 px-6 bg-gradient-to-r from-[#D3756B] to-[#FFC3A1] text-white hover:bg-[#F8E4E7] hover:text-[#F0997D] transition-all"
                  : "py-3 px-6 text-[#D3756B] hover:bg-[#F8E4E7] hover:text-[#F0997D] transition-all"
              }
            >
              Our Policy
            </NavLink>

            {token && (
              <p
                onClick={() => {
                  logout();
                  setVisible(false);
                }}
                className="py-3 px-6 text-[#D3756B] hover:bg-[#F8E4E7] hover:text-[#F0997D] cursor-pointer transition-all"
              >
                Logout
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
