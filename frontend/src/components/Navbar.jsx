import React, { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/shopcontext";
import { MenuIcon, SearchIcon, UserIcon, XIcon } from "@heroicons/react/outline";
import { useLocation } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

// Standardized color palette
// Primary: #65000B (deep burgundy)
// Secondary: #A75D5D (medium burgundy)
// Accent: #D1856C (terracotta)
// Light: #F0E0DC (light pink/beige)
// Background: #FCF0EE (extremely light pink/beige)

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const { setShowSearch, navigate, token, setToken, setCartItems, setWishlist } = useContext(ShopContext);
  const [expandedCategory, setExpandedCategory] = useState(null);

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
    {
      name: "Sarees",
      slug: "Saree",
      subCategories: [
        "Chanderi silk", "Jimmy Choo", "Kota Doria", "Linen", 
        "Madurai Sungudi / Velthari", "Maheshwari silk", "Mul Mul", 
        "Organza", "Soft khadi cotton", "Soft silk", "Viscose/Georgettes", 
        "Silk", "Chiffon", "Modal Silk", "Cotton"
      ],
    },
    {
      name: "Kurta Sets",
      slug: "Kurta Sets",
      subCategories: ["Cotton", "Muslin", "Rayon", "Georgette", "Silk"],
    },
    {
      name: "Co-ords",
      slug: "Co-ords",
      subCategories: ["Cotton", "Muslin", "Rayon", "Georgette", "Silk"],
    },
    {
      name: "Dresses",
      slug: "Dresses",
      subCategories: ["Cotton", "Muslin", "Rayon", "Georgette", "Silk"],
    },
    {
      name: "Home Decor",
      slug: "Home Decor",
      subCategories: ["Bedsheets", "Cushion Covers", "Curtains", "Table Linen"],
    },
    {
      name: "Dress Materials",
      slug: "Dress materials",
      subCategories: [
        "Chanderi silk", "Cotton", "Georgette", "Kota silk",
        "Linen", "Muslin", "Rayon", "Tissue", "Modal silk"
      ],
    },
  ];
  
  return (
    <div className="flex items-center justify-between h-16 px-4 sm:px-6 font-medium w-full mx-auto prata-regular">
      {/* Left Section: Menu Icon */}
      <div className="flex items-center">
        {/* Mobile menu toggle */}
        <MenuIcon
          onClick={() => setVisible(true)}
          className="w-6 h-6 cursor-pointer text-[#65000B] hover:text-[#A75D5D] transition-all"
        />
      </div>

      {/* Center Section: Logo */}
      <div className="flex-1 flex justify-center">
        <Link to="/" className="flex items-center gap-3">
          <img
            className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
            src="https://res.cloudinary.com/dzzhbgbnp/image/upload/v1742820840/cropped_ekalooms_rmp6ds.png"
            alt="Logo"
          />
       <h1 className="text-xl sm:text-2xl prata-regular text-[#65000B] drop-shadow-md">
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
            className="w-6 h-6 cursor-pointer text-[#65000B] hover:text-[#A75D5D] transition-all"
          />
        )}

        {/* User Icon */}
        <div className="relative group">
          <UserIcon
            onClick={() => (!token ? navigate("/login") : null)}
            className="w-6 h-6 prata-regular cursor-pointer text-[#65000B] hover:text-[#A75D5D] transition-all"
            aria-label={token ? "User Options" : "Login"}
          />

          {token && (
            <div className="absolute right-0 mt-2 hidden group-hover:block z-50">
              <div className="flex flex-col w-28 py-3 px-4 bg-white border border-[#F0E0DC] shadow-md text-[#65000B] rounded prata-regular">
                <p
                  onClick={logout}
                  className="prata-regular hover:text-[#A75D5D] cursor-pointer transition-colors"
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
              src="https://res.cloudinary.com/dzzhbgbnp/image/upload/v1742820840/cropped_ekalooms_rmp6ds.png"
              alt="Logo"
            />
           <h1 className="text-xl sm:text-2xl prata-regular text-[#65000B] drop-shadow-md">
  ekalooms
</h1>
          </div>
          <button
            onClick={() => setVisible(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#FCF0EE] transition-all"
          >
            <XIcon className="w-5 h-5 text-[#65000B]" />
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
                  isActive ? "text-[#65000B] font-medium" : "text-[#A75D5D]"
                }`
              }
            >
              <div className="flex items-center prata-regular">
                <i className="fas fa-info-circle w-5 h-5 mr-3 prata-regular text-[#65000B]"></i>
                <span className="prata-regular">About Us</span>
              </div>
            </NavLink>

            <NavLink
              to="/trackyourOrder"
              onClick={() => setVisible(false)}
              className={({ isActive }) =>
                `px-5 py-4 flex items-center justify-between border-b border-[#F0E0DC] prata-regular ${
                  isActive ? "text-[#65000B] font-medium" : "text-[#A75D5D]"
                }`
              }
            >
              <div className="flex items-center prata-regular">
                <i className="fas fa-map-marker-alt w-5 h-5 mr-3 text-[#65000B]"></i>
                <span className="prata-regular">Track Order</span>
              </div>
            </NavLink>

            <NavLink
              to="/policy"
              onClick={() => setVisible(false)}
              className={({ isActive }) =>
                `px-5 py-4 flex items-center justify-between border-b border-[#F0E0DC] prata-regular ${
                  isActive ? "text-[#65000B] font-medium" : "text-[#A75D5D]"
                }`
              }
            >
              <div className="flex items-center prata-regular">
                <i className="fas fa-question-circle w-5 h-5 mr-3 text-[#65000B]"></i>
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
                  <i className="fas fa-tags w-5 h-5 mr-3 text-[#65000B]"></i>
                  <span className={`prata-regular ${location.pathname.includes("/collection") ? "text-[#65000B] font-medium" : "text-[#A75D5D]"}`}>
                    Categories
                  </span>
                </div>
                <i className={`fas ${categoriesOpen ? 'fa-minus' : 'fa-plus'} text-xs text-[#A75D5D]`}></i>
              </div>
              
              {/* Categories List */}
              <div className={`transition-all duration-300 overflow-hidden prata-regular ${
                categoriesOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
              }`}>
                {categories.map((cat) => {
                  const categoryParam = new URLSearchParams(location.search).get("category");
                  const subParam = new URLSearchParams(location.search).get("sub");
                  const isCategoryActive = location.pathname.includes("/collection") && categoryParam === cat.slug;
                  const isExpanded = expandedCategory === cat.slug;

                  return (
                    <div key={cat.slug} className="mb-2 mx-3">
                      {/* Category Toggle Button */}
                      <button
                        onClick={() => setExpandedCategory(isExpanded ? null : cat.slug)}
                        className={`w-full text-left p-3 rounded-md flex justify-between items-center transition-all shadow-sm ${
                          isCategoryActive
                            ? "bg-[#FCF0EE] border-2 border-[#65000B] text-[#65000B]"
                            : "bg-white border border-[#A75D5D] text-[#A75D5D] hover:border-[#65000B] hover:text-[#65000B]"
                        }`}
                      >
                        <span className="text-sm">{cat.name}</span>
                        <i className={`fas ${isExpanded ? "fa-minus" : "fa-plus"} text-xs`} />
                      </button>

                      {/* Subcategories */}
                      {isExpanded && cat.subCategories && (
                        <div className="mt-2 ml-4 max-h-64 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#A75D5D]/80 scrollbar-track-[#F0E0DC]/20">
                          {cat.subCategories.map((subCat) => {
                            const isSubActive = subParam === subCat;
                            return (
                              <NavLink
                                key={subCat}
                                to={`/collection?category=${encodeURIComponent(cat.slug)}&sub=${encodeURIComponent(subCat)}`}
                                onClick={() => setVisible(false)}
                                className={`block text-sm px-3 py-2 rounded-md mb-1 transition-all ${
                                  isSubActive
                                    ? "!bg-white !text-[#65000B] font-medium border-2 border-[#65000B]"
                                    : "!bg-white !text-[#65000B] hover:!bg-[#FCF0EE] hover:!text-[#65000B] border border-[#A75D5D]"
                                }`}
                              >
                                {subCat}
                              </NavLink>
                            );
                          })}
                        </div>
                      )}
                    </div>
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
                className="w-full py-2.5 px-4 rounded-md border border-[#65000B] text-[#65000B] hover:bg-[#FCF0EE] transition-all flex items-center justify-center gap-2 prata-regular"
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
                    ? "bg-[#65000B] text-white"
                    : "border border-[#65000B] text-[#65000B] hover:bg-[#FCF0EE]"
                } transition-all flex items-center justify-center gap-2`}
              >
                <i className="fas fa-sign-in-alt"></i>
                <span className="prata-regular">Login</span>
              </button>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-4 text-center text-xs text-[#A75D5D] border-t border-[#F0E0DC] prata-regular">
            © 2025 ekalooms. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;