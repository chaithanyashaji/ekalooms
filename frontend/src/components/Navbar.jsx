import React, { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/shopcontext";
import { MenuIcon, SearchIcon, UserIcon, XIcon } from "@heroicons/react/outline";
import { useLocation } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const { setShowSearch, navigate, token, setToken, setCartItems, setWishlist } = useContext(ShopContext);
  const location = useLocation();

  const logout = () => {
    setToken(null);
    setCartItems({});
    setWishlist([]);
    localStorage.removeItem("token");
    navigate("/login");
  };
  
  const isCollectionPage = location.pathname.includes("collection");
  
  const toggleCategories = () => {
    setCategoriesOpen(!categoriesOpen);
  };

  // Categories data
  const categories = [
    { name: "Sarees", slug: "Saree" },
    { name: "Readymades", slug: "Readymades" },
    { name: "Home Decor", slug: "Home Decor" },
    { name: "Dress Materials", slug: "Dress materials" },
  ];

  return (
    <div className="flex items-center justify-between h-16 px-4 sm:px-6 font-medium w-full mx-auto prata-regular">
      {/* Left Section: Menu Icon */}
      <div className="flex items-center">
        {/* Mobile menu toggle */}
        <MenuIcon
          onClick={() => setVisible(true)}
          className="w-6 h-6 cursor-pointer text-[#A75D5D] hover:text-[#d1856c] transition-all"
        />
      </div>

      {/* Center Section: Logo */}
      <div className="flex-1 flex justify-center">
        <Link to="/" className="flex items-center gap-3">
          <img
            className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
            src="https://res.cloudinary.com/dzzhbgbnp/image/upload/v1735222002/logo_bo4y6g.png"
            alt="Logo"
          />
          <h1 className="text-xl sm:text-2xl prata-regular text-[#A75D5D]">
            ekalooms
          </h1>
        </Link>
      </div>

      {/* Right Section: Search and User */}
      <div className="flex items-center gap-4">
        {/* Search Icon */}
        {isCollectionPage && (
          <SearchIcon
            onClick={() => setShowSearch(true)}
            className="w-6 h-6 cursor-pointer text-[#A75D5D] hover:text-[#d1856c] transition-all"
          />
        )}

        {/* User Icon */}
        <div className="relative group">
          <UserIcon
            onClick={() => (!token ? navigate("/login") : null)}
            className="w-6 h-6 prata-regular cursor-pointer text-[#A75D5D] hover:text-[#d1856c] transition-all"
            aria-label={token ? "User Options" : "Login"}
          />

          {token && (
            <div className="absolute right-0 mt-2 hidden group-hover:block z-50">
              <div className="flex flex-col w-28 py-3 px-4 bg-white border border-[#F0E0DC] shadow-md text-[#A75D5D] rounded prata-regular">
                <p
                  onClick={logout}
                  className="prata-regular hover:text-[#d1856c] cursor-pointer transition-colors"
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
      </div>

      {/* Minimal Sidebar with Brand Colors */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-xl transition-all duration-300 ease-in-out ${
          visible ? "translate-x-0" : "-translate-x-full"
        } w-64 z-50 flex flex-col prata-regular`}
      >
        {/* Sidebar Header */}
        <div className="p-5 flex items-center justify-between relative border-b border-[#F0E0DC]">
          <div className="flex items-center gap-2">
            <img
              className="w-9 h-9 object-contain"
              src="https://res.cloudinary.com/dzzhbgbnp/image/upload/v1735222002/logo_bo4y6g.png"
              alt="Logo"
            />
            <h1 className="text-lg prata-regular text-[#A75D5D]">
              ekalooms
            </h1>
          </div>
          <button
            onClick={() => setVisible(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#FCF0EE] transition-all"
          >
            <XIcon className="w-5 h-5 text-[#A75D5D]" />
          </button>
        </div>
        
        {/* Scrollable Sidebar Content */}
        <div className="flex-1 overflow-y-auto pb-28 prata-regular">

          {/* Navigation Links with Vertical Lines */}
          <div className="flex flex-col prata-regular">
            <NavLink
              to="/about"
              onClick={() => setVisible(false)}
              className={({ isActive }) =>
                `px-5 py-4 flex items-center justify-between border-b border-[#F0E0DC] prata-regular ${
                  isActive ? "text-[#A75D5D] font-medium" : "text-[#d1856c]"
                }`
              }
            >
              <div className="flex items-center prata-regular">
                <i className="fas fa-info-circle w-5 h-5 mr-3 prata-regular text-[#A75D5D]"></i>
                <span className="prata-regular">About Us</span>
              </div>
            </NavLink>

            <NavLink
              to="/trackyourOrder"
              onClick={() => setVisible(false)}
              className={({ isActive }) =>
                `px-5 py-4 flex items-center justify-between border-b border-[#F0E0DC] prata-regular ${
                  isActive ? "text-[#A75D5D] font-medium" : "text-[#d1856c]"
                }`
              }
            >
              <div className="flex items-center prata-regular">
                <i className="fas fa-map-marker-alt w-5 h-5 mr-3 text-[#A75D5D]"></i>
                <span className="prata-regular">Track Order</span>
              </div>
            </NavLink>

            <NavLink
              to="/policy"
              onClick={() => setVisible(false)}
              className={({ isActive }) =>
                `px-5 py-4 flex items-center justify-between border-b border-[#F0E0DC] prata-regular ${
                  isActive ? "text-[#A75D5D] font-medium" : "text-[#d1856c]"
                }`
              }
            >
              <div className="flex items-center prata-regular">
                <i className="fas fa-question-circle w-5 h-5 mr-3 text-[#A75D5D]"></i>
                <span className="prata-regular">FAQ</span>
              </div>
            </NavLink>

            {/* Categories with Toggle */}
            <div className="border-b border-[#F0E0DC] prata-regular">
              <div 
                className="px-5 py-4 flex items-center justify-between cursor-pointer prata-regular"
                onClick={toggleCategories}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && toggleCategories()}
              >
                <div className="flex items-center prata-regular">
                  <i className="fas fa-tags w-5 h-5 mr-3 text-[#A75D5D]"></i>
                  <span className={`prata-regular ${location.pathname.includes("/collection") ? "text-[#A75D5D] font-medium" : "text-[#d1856c]"}`}>
                    Categories
                  </span>
                </div>
                <i className={`fas ${categoriesOpen ? 'fa-minus' : 'fa-plus'} text-xs text-[#d1856c]`}></i>
              </div>
              
              {/* Categories List - Fixed to remove any black background */}
              <div className={`transition-all duration-300 overflow-hidden prata-regular ${
                categoriesOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                {categories.map((cat, index) => {
                  const categoryParam = new URLSearchParams(location.search).get('category');
                  const isCategoryActive = location.pathname.includes('/collection') && categoryParam === cat.slug;
                  
                  return (
                    <NavLink
                      key={cat.slug}
                      to={`/collection?category=${encodeURIComponent(cat.slug)}`}
                      onClick={() => setVisible(false)}
                      className={`block p-3 mx-3 my-2 rounded text-center transition-all prata-regular ${
                        isCategoryActive
                          ? "!bg-white border-2 border-[#A75D5D] !text-[#A75D5D] font-medium"
                          : "!bg-white border border-[#d1856c] !text-[#d1856c] hover:border-[#A75D5D] hover:!text-[#A75D5D]"
                      }`}
                    >
                      {cat.name}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Account Section */}
          <div className="mt-auto px-5 py-4 border-t border-[#F0E0DC] prata-regular">
            {token ? (
              <button
                onClick={() => {
                  logout();
                  setVisible(false);
                }}
                className="w-full py-2.5 px-4 rounded-md border border-[#A75D5D] text-[#A75D5D] hover:bg-[#fcf0ee] transition-all flex items-center justify-center gap-2 prata-regular"
              >
                <i className="fas fa-sign-out-alt"></i>
                <span className="prata-regular">Logout</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  navigate("/login");
                  setVisible(false);
                }}
                className={`w-full py-2.5 px-4 rounded-md prata-regular ${
                  location.pathname === "/login"
                    ? "bg-[#A75D5D] text-white"
                    : "border border-[#A75D5D] text-[#A75D5D] hover:bg-[#fcf0ee]"
                } transition-all flex items-center justify-center gap-2`}
              >
                <i className="fas fa-sign-in-alt"></i>
                <span className="prata-regular">Login</span>
              </button>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-4 text-center text-xs text-[#d1856c] border-t border-[#F0E0DC] prata-regular">
            © 2025 ekalooms. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;