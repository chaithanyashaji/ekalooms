// Collection Component
import React, { useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/shopcontext';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import MobileFilterPanel from '../components/MobileFilterPanel';

const Collection = () => {
  const { products, search, showSearch, } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relevant');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 60;

  const location = useLocation();
  const params = useParams();
  const queryParams = new URLSearchParams(location.search);
  const selectedCategory = params.categorySlug || queryParams.get('category');

  const categorySubCategoryMap = {
    "Saree": [
      "Chanderi silk", "Jimmy Choo", "Kota Doria", "Linen", 
      "Madurai Sungudi / Velthari", "Maheshwari silk", "Mul Mul", 
      "Organza", "Soft khadi cotton","Soft silk","Viscose/Georgettes","Silk","Chiffon","Modal Silk","Cotton"
    ],
    "Readymades": [
      "Cotton", "Muslin", "Rayon","Georgette"
    ],
    "Dress materials": [
      "Chanderi silk", "Cotton", "Georgette", "Kota silk", 
      "Linen", "Muslin", "Rayon", "Tissue","Modal silk"
    ],
    "Home Decor": [
      "Bedsheets", "Cushion Covers", "Curtains", "Table Linen"
    ]
  };

  useEffect(() => {
    if (selectedCategory) {
      setCategory([selectedCategory]);
    }
  }, [selectedCategory]);

  useEffect(() => {
    const savedPosition = sessionStorage.getItem("scrollPosition");
  
    if (savedPosition !== null) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          window.scrollTo({
            top: parseInt(savedPosition, 10),
            behavior: "instant",
          });
  
          // Delay clearing session storage after scroll restoration
          setTimeout(() => {
            sessionStorage.removeItem("scrollPosition");
          }, 1000);
        }, 200);
      });
    }
  }, []);
  
  
  
  
  

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products]);

  const applyFilter = () => {
    let filtered = [...products];

    // Apply search filter
    if (showSearch && search) {
      const searchLowerCase = search.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchLowerCase) ||
          item.category.toLowerCase().includes(searchLowerCase) ||
          item.subCategory.toLowerCase().includes(searchLowerCase)
      );
    }

    // Apply category and subcategory filters
    if (category.length > 0) {
      filtered = filtered.filter((item) => category.includes(item.category));
    }
    if (subCategory.length > 0) {
      filtered = filtered.filter((item) => subCategory.includes(item.subCategory));
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortType === 'low-high') return a.price - b.price;
      if (sortType === 'high-low') return b.price - a.price;
      if (sortType === 'rating') return b.averageRating - a.averageRating;
      if (sortType === 'bestseller') return b.bestseller ? 1 : -1;
      return 0; // Default: Relevant
    });

    setFilterProducts(filtered);
    setCurrentPage(1); // Reset to the first page whenever filters are applied
  };

  const paginate = () => {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return filterProducts.slice(startIndex, endIndex);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const toggleCategory = (cat) => {
    setCategory((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleSubCategory = (subCat) => {
    setSubCategory((prev) =>
      prev.includes(subCat) ? prev.filter((s) => s !== subCat) : [...prev, subCat]
    );
  };

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      <p
        onClick={() => setShowFilter(!showFilter)}
        className="my-2 text-xl flex items-center text-[#9d4a54] cursor-pointer gap-2 sm:hidden"
      >
        FILTERS
        <img
          className={`h-3 transition-transform ${showFilter ? 'rotate-90' : ''}`}
          src={assets.dropdown_icon}
          alt="dropdown-icon"
        />
      </p>

      <MobileFilterPanel
        showFilter={showFilter}
        setShowFilter={setShowFilter}
        categorySubCategoryMap={categorySubCategoryMap}
        category={category}
        subCategory={subCategory}
        toggleCategory={toggleCategory}
        toggleSubCategory={toggleSubCategory}
        applyFilter={applyFilter}
        sortType={sortType}
        setSortType={setSortType}
      />

<div className="hidden sm:block w-1/3">
  <div className="sticky top-4 border border-[#D3756B]/20 p-6 rounded-xl shadow-md bg-white">
    <h2 className="text-2xl font-bold text-[#A75D5D] mb-6">Filters</h2>

    {/* Category Section */}
    <div className="mb-8">
      <p className="text-lg font-semibold text-[#D3756B] mb-4">Category</p>
      <div className="space-y-3">
        {Object.keys(categorySubCategoryMap).map((cat) => (
          <label key={cat} className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={category.includes(cat)}
              onChange={() => toggleCategory(cat)}
              className="w-5 h-5 rounded-md accent-[#D3756B] cursor-pointer"
            />
            <span className="text-md text-[#9d4a54] group-hover:text-[#D3756B] transition-colors">
              {cat}
            </span>
          </label>
        ))}
      </div>
    </div>

    {/* Sub-Category Section */}
    <div className="mb-8">
      <p className="text-lg font-semibold text-[#D3756B] mb-4">Sub-Category</p>
      <div className="space-y-3 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#D3756B] scrollbar-track-gray-100">
        {category.length > 0 && Array.isArray(categorySubCategoryMap[category[0]]) ? (
          categorySubCategoryMap[category[0]].map((subCat) => (
            <label key={subCat} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={subCategory.includes(subCat)}
                onChange={() => toggleSubCategory(subCat)}
                className="w-5 h-5 rounded-md accent-[#D3756B] cursor-pointer"
              />
              <span className="text-md text-[#9d4a54] group-hover:text-[#D3756B] transition-colors">
                {subCat}
              </span>
            </label>
          ))
        ) : (
          <p className="text-[#A75D5D] italic text-base">Select a category first</p>
        )}
      </div>
    </div>

    {/* Apply Filter Button */}
    <button
      onClick={applyFilter}
      className="w-full py-3 bg-[#D3756B] text-white text-lg font-semibold rounded-lg shadow-md 
                hover:bg-[#A75D5D] active:scale-[0.98] transition-all duration-200"
    >
      Apply Filters
    </button>
  </div>
</div>

      <div className="flex flex-col min-h-screen">
        <div className="hidden md:flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#A75D5D]">Products</h2>
          <div className="flex items-center gap-4">
            <p className="text-lg  font-semibold text-[#9d4a54]">Sort By:</p>
            <select
              value={sortType}
              onChange={(e) => {
                setSortType(e.target.value);
                applyFilter();
              }}
              className="py-2 px-4 rounded-lg text-[#A75D5D] border border-[#A75D5D]"
            >
              <option value="relevant">Relevant</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
              <option value="rating">Rating</option>
              <option value="bestseller">Bestseller</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {paginate().map((item, index) => (
            <ProductItem
              key={index}
              name={item.name}
              id={item._id}
              price={item.price}
              image={item.image}
              rating={item.averageRating || 0}
              totalReviews={item.totalReviews}
              bestseller={item.bestseller}
              category={item.category}
              subCategory={item.subCategory}
              description={item.description}
              inStock={item.inStock}
              sizes={item.sizes}
              stockQuantity={item.stockQuantity}
              
            />
          ))}
        </div>

        <div className="flex justify-center mt-6">
          {Array.from({ length: Math.ceil(filterProducts.length / productsPerPage) }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-3 py-2 mx-1 rounded-md ${
                currentPage === index + 1
                  ? 'bg-[#D3756B] text-white'
                  : 'bg-[#F3F3F5] text-[#A75D5D]'
              }`}
              aria-label={`Go to page ${index + 1}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
