import React, { useState,useEffect } from 'react';
import { X, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { useLocation } from 'react-router-dom';



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

  const location = useLocation();

  useEffect(() => {
    // Close filter when path changes
    setShowFilter(false);
  }, [location.pathname]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-white transform transition-transform duration-300 ${
        showFilter ? 'translate-x-0' : 'translate-x-full'
      } flex flex-col`}
    >
      {/* Header - Simplified with minimal styling */}
      <div className="sticky top-0 bg-white z-10 border-b border-gray-200 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-[#65000B]" />
          <h2 className="text-lg font-medium text-[#65000B]">Filters</h2>
        </div>
        <button
          onClick={() => setShowFilter(false)}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <X className="w-5 h-5 text-[#65000B]" />
        </button>
      </div>

      {/* Body - Cleaner spacing, reduced decorative elements */}
      <div className="flex-1 overflow-y-auto p-4 pb-20 bg-white">
        {/* Sort By Section - Simplified design */}
        <div className="mb-6">
          <h3 className="text-base font-medium mb-3 text-[#65000B]">Sort By</h3>
          <div className="grid grid-cols-2 gap-2">
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
                className={`py-2 px-3 border rounded-md text-sm ${
                  sortType === option.value
                    ? 'bg-[#65000B] text-white border-[#65000B]'
                    : 'bg-white text-gray-800 border-gray-300 hover:border-[#65000B] hover:text-[#65000B]'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Section - More minimal approach */}
        <div className="mb-6">
          <h3 className="text-base font-medium mb-3 text-[#65000B]">Categories</h3>
          {Object.keys(categorySubCategoryMap).map((cat) => (
            <div key={cat} className="mb-3">
              <div className="flex justify-between items-center py-2 cursor-pointer border-b border-gray-100">
                <label className="flex items-center gap-2 flex-1">
                  <input
                    type="checkbox"
                    checked={category.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="w-4 h-4 accent-[#65000B]"
                  />
                  <span className="text-gray-800 font-medium">{cat}</span>
                </label>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCategoryExpand(cat);
                  }}
                  className="p-1 text-gray-500"
                >
                  {expandedCategories[cat] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              {expandedCategories[cat] && Array.isArray(categorySubCategoryMap[cat]) && (
                <div className="pl-6 mt-2 space-y-2">
                  {categorySubCategoryMap[cat].map((sub) => (
                    <label key={sub} className="flex items-center gap-2 cursor-pointer py-1">
                      <input
                        type="checkbox"
                        checked={subCategory.includes(sub)}
                        onChange={() => {
                          if (category.includes(cat)) {
                            toggleSubCategory(sub);
                          } else {
                            toggleCategory(cat);
                            toggleSubCategory(sub);
                          }
                        }}
                        className="w-4 h-4 accent-[#65000B]"
                      />
                      <span className="text-gray-600 text-sm">{sub}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Apply Filters Button - Clean, minimal design */}
      <div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
        <button
          onClick={handleApplyFilter}
          className="w-full py-3 rounded-md text-white bg-[#65000B] hover:bg-[#8B0010] transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}

export default MobileFilterPanel;