import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/shopcontext';
import { useLocation } from 'react-router-dom';
import { FaSearch, FaTimes } from "react-icons/fa";

const SearchBar = () => {
    const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
    const location = useLocation();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (location.pathname.includes('collection')) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    }, [location]);

    return showSearch && visible ? (
        <div className="py-4 flex justify-center bg-transparent">
            <div className="relative w-11/12 sm:w-1/2">
                {/* Search Input - Simplified with burgundy focus */}
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full py-2 px-4 pl-10 pr-12 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#65000B] focus:border-[#65000B] text-gray-800 placeholder-gray-500 bg-white"
                    type="text"
                    placeholder="Search for products..."
                />

                {/* Search Icon - Using primary burgundy */}
                <FaSearch className="absolute left-3 top-2.5 text-[#65000B] w-4 h-4" />

                {/* Close Icon - Using primary burgundy */}
                <FaTimes
                    onClick={() => setShowSearch(false)}
                    className="absolute right-3 top-2.5 text-gray-400 w-4 h-4 cursor-pointer hover:text-[#65000B] transition-colors"
                />
            </div>
        </div>
    ) : null;
};

export default SearchBar;