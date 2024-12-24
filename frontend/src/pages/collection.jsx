import React, { useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/shopcontext';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import MobileFilterPanel from '../components/MobileFilterPanel';

const Collection = () => {
  const { products, search, showSearch,pagination } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relevant');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;

  const location = useLocation();
  const params = useParams();
  const queryParams = new URLSearchParams(location.search);
  const selectedCategory = params.categorySlug || queryParams.get('category');

  const categorySubCategoryMap = {
    Saree: [
      'Mul Mul',
      'Linen',
      'Kota Doria',
      'Chanderi',
      'Maheshwari',
      'Madurai Sungudi / Velthari',
      'Soft Khadi',
      'Georgette',
      'Organza',
    ],
    'Stitched Suits': [
      'Mul Mul',
      'Linen',
      'Kota Doria',
      'Chanderi',
      'Maheshwari',
      'Madurai Sungudi / Velthari',
      'Soft Khadi',
      'Georgette',
      'Organza',
    ],
    'Unstitched Suits': [
      'Mul Mul',
      'Linen',
      'Kota Doria',
      'Chanderi',
      'Maheshwari',
      'Madurai Sungudi / Velthari',
      'Soft Khadi',
      'Georgette',
      'Organza',
    ],
    'Home Decor': ['Bedsheets', 'Cushion Covers', 'Curtains', 'Table Linen'],
  };

  useEffect(() => {
    if (selectedCategory) {
      setCategory([selectedCategory]);
    }
  }, [selectedCategory]);

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products]);

  const applyFilter = () => {
    let filtered = products.slice();
  
    if (showSearch && search) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (category.length > 0) {
      filtered = filtered.filter((item) => category.includes(item.category));
    }
    if (subCategory.length > 0) {
      filtered = filtered.filter((item) => subCategory.includes(item.subCategory));
    }
  
    // Apply sorting
    if (sortType === 'low-high') {
      filtered = filtered.sort((a, b) => a.price - b.price);
    } else if (sortType === 'high-low') {
      filtered = filtered.sort((a, b) => b.price - a.price);
    } else if (sortType === 'rating') {
      filtered = filtered.sort((a, b) => b.averageRating - a.averageRating);
    } else if (sortType === 'bestseller') {
      filtered = filtered.sort((a, b) => (b.bestseller ? 1 : -1));
    }
  
    setFilterProducts(filtered);
  };
  
  

  const paginate = () => {
    const startIndex = (currentPage - 1) * productsPerPage;
    return filterProducts.slice(startIndex, startIndex + productsPerPage);
  };

  const handlePageChange = (page) => {
    getProductsData(page, 20); // Fetch data for the selected page
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
        toggleCategory={(e) => setCategory(e.target.value)}
        toggleSubCategory={(e) => setSubCategory(e.target.value)}
        applyFilter={applyFilter}
        sortType={sortType}
        setSortType={setSortType}
      />

<div className="hidden sm:block w-1/4">
  <div className="border p-6 rounded-lg shadow-lg bg-none">
    <h2 className="text-xl font-bold text-[#A75D5D] mb-4">Filters</h2>

    {/* Category Section */}
    <div className="mb-6">
      <p className="text-lg font-medium text-[#D3756B] mb-3">Category</p>
      <div className="flex flex-col gap-2">
        {Object.keys(categorySubCategoryMap).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory([cat])}
            className={`block w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 ${
              category.includes(cat)
                ? 'bg-[#F0997D] text-white font-semibold shadow-md opacity-70'
                : 'bg-white hover:bg-[#F0997D] hover:text-white text-[#A75D5D] border border-[#D3756B]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>

    {/* Sub-Category Section */}
    <div className="mb-6">
      <p className="text-lg font-medium text-[#D3756B] mb-3">Sub-Category</p>
      {category.length > 0 ? (
        <div className="flex flex-col gap-2">
          {categorySubCategoryMap[category[0]].map((subCat) => (
            <button
              key={subCat}
              onClick={() => setSubCategory([subCat])}
              className={`block w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 ${
                subCategory.includes(subCat)
                  ? 'bg-[#F0997D] text-white font-semibold shadow-md opacity-70'
                  : 'bg-white hover:bg-[#F0997D] hover:text-white text-[#A75D5D] border border-[#D3756B]'
              }`}
            >
              {subCat}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-[#A75D5D] italic">Select a category first</p>
      )}
    </div>

    {/* Apply Filter Button */}
    <div className="text-center">
      <button
        onClick={applyFilter}
        className="px-6 py-3 w-full bg-[#D3756B] text-white font-semibold rounded-lg shadow hover:bg-[#A75D5D] transition-all duration-200"
      >
        Apply Filters
      </button>
    </div>
  </div>
</div>


<div className="flex flex-col min-h-screen">
<div className="hidden md:flex justify-between items-center mb-4">
  <h2 className="text-2xl font-bold text-[#A75D5D]">Products</h2>
  <div className="flex items-center gap-4">
    <p className="text-lg font-semibold text-[#9d4a54]">Sort By:</p>
    <select
      value={sortType}
      onChange={(e) => {
        setSortType(e.target.value); // Update sort type
        applyFilter(); // Apply filters and sorting
      }}
      className="py-2 px-4  rounded-lg text-[#A75D5D] border border-[#A75D5D]"
    >
      <option value="relevant">Relevant</option>
      <option value="low-high">Price: Low to High</option>
      <option value="high-low">Price: High to Low</option>
      <option value="rating">Rating</option>
     <option value="bestseller">BestSeller</option>
    </select>
  </div>
</div>

  {/* Page Content */}
  <div className="flex-1">
    {/* Replace this comment with the rest of your page content, e.g., product grid */}
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
          subCategory={item.subCategory}
          description={item.description}
          inStock={item.inStock}
        />
      ))}
    </div>
  </div>

  {/* Pagination Section */}
  <div className="flex justify-center mt-6">
      {Array.from({ length: pagination.totalPages }, (_, index) => (
        <button
          key={index}
          onClick={() => handlePageChange(index + 1)}
          className={`px-3 py-2 mx-1 rounded-md ${
            pagination.currentPage === index + 1
              ? 'bg-[#D3756B] text-white'
              : 'bg-[#F3F3F5] text-[#A75D5D]'
          }`}
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
