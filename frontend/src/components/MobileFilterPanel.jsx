import React, { useState } from 'react';
import { X, Filter, ChevronDown, ChevronUp } from 'lucide-react';

function MobileFilterPanel({
  showFilter,
  setShowFilter,
  categorySubCategoryMap = {},
  category = [],
  subCategory = [],
  toggleCategory,
  toggleSubCategory,
  applyFilter,
  sortType,
  setSortType,
}) {
  const [expandedCategories, setExpandedCategories] = useState({});

  const toggleCategoryExpand = (cat) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  };

  const handleApplyFilter = () => {
    applyFilter();
    setShowFilter(false);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] bg-white transform transition-transform duration-300 ${
        showFilter ? 'translate-x-0' : 'translate-x-full'
      } flex flex-col`}
    >
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 border-b p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2">
          <Filter className="w-6 h-6 text-[#9d4a54]" />
          <h2 className="text-xl font-bold text-[#9d4a54]">Filters</h2>
        </div>
        <button
          onClick={() => setShowFilter(false)}
          className="p-2 rounded-md hover:bg-gray-200"
        >
          <X className="w-6 h-6 text-[#9d4a54]" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {/* Sort By Section */}
        <div className="mb-6 mt-4">
          <h3 className="text-lg font-semibold mb-4 text-[#A75D5D]">Sort By</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'relevant', label: 'Relevant' },
              { value: 'low-high', label: 'Price: Low to High' },
              { value: 'high-low', label: 'Price: High to Low' },
              { value: 'rating', label: 'Rating' },
              { value: 'bestseller', label: 'Bestseller' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setSortType(option.value)}
                className={`py-2 px-3 border rounded-lg text-[#9d4a54] ${
                  sortType === option.value
                    ? 'bg-gradient-to-r from-[#D3756B] to-[#FFC3A1] text-white border-[#A75D5D]'
                    : 'bg-white hover:bg-gray-100 text-[#9d4a54] border-[#D3756B]'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-[#A75D5D]">Categories</h3>
          {Object.keys(categorySubCategoryMap).map((cat) => (
            <div key={cat} className="mb-4">
              <div
                className="flex justify-between items-center py-2 px-3 rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer"
              >
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={category.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="w-4 h-4 accent-[#D3756B]"
                  />
                  <span className="text-[#9d4a54] font-medium">{cat}</span>
                </label>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCategoryExpand(cat);
                  }}
                  className="p-1"
                >
                  {expandedCategories[cat] ? <ChevronUp /> : <ChevronDown />}
                </button>
              </div>

              {expandedCategories[cat] && Array.isArray(categorySubCategoryMap[cat]) && (
  <div className="pl-6 mt-2 space-y-2">
    {categorySubCategoryMap[cat].map((sub) => (
      <label key={sub} className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={subCategory.includes(sub)}
          onChange={() => {
            if (category.includes(cat)) {
              toggleSubCategory(sub);
            } else {
              // Ensure parent category is selected before allowing subcategory toggle
              toggleCategory(cat);
              toggleSubCategory(sub);
            }
          }}
          className="w-4 h-4 accent-[#D3756B]"
        />
        <span className="text-[#9d4a54]">{sub}</span>
      </label>
    ))}
  </div>
)}

            </div>
          ))}
        </div>
      </div>

      {/* Apply Filters Button */}
      <div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg">
        <button
          onClick={handleApplyFilter}
          className="w-full py-3 border border-[#A75D5D] rounded-lg text-lg text-white bg-gradient-to-r from-[#D3756B] to-[#F0997D] active:bg-gradient-to-r active:from-[#A75D5D] active:to-[#D3756B] hover:opacity-90 transition-all"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}

export default MobileFilterPanel;