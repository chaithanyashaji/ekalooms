import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'react-quill/dist/quill.snow.css'; // Import the Quill CSS
import ReactQuill from 'react-quill';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const Add = ({ token }) => {
  const [images, setImages] = useState([null, null, null, null]);
  const [imagePreviews, setImagePreviews] = useState([null, null, null, null]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Saree");
  const [subCategory, setSubCategory] = useState("");
  const [bestseller, setBestseller] = useState(false);
  const [inStock, setInStock] = useState(true);
  const [sizes, setSizes] = useState([]);

  const categories = {
    Saree: [
      "Mul Mul", "Linen","Chanderi-silk","Maheshwari-silk","Soft khadi cotton", "Kota Doria", "Chanderi", "Maheshwari", 
      "Madurai Sungudi / Velthari", "Soft Khadi", "Georgette", "Organza",
    ],
    "Stitched Suits": [
     "Cotton","Rayon","Muslin", "Mul Mul", "Linen", "Kota Doria", "Chanderi", "Maheshwari", 
      "Madurai Sungudi / Velthari", "Soft Khadi", "Georgette", "Organza",
    ],
    "Unstitched Suits": [
      "Cotton","Rayon","Muslin","Mul Mul", "Linen", "Kota Doria", "Chanderi", "Maheshwari", 
      "Madurai Sungudi / Velthari", "Soft Khadi", "Georgette", "Organza",
    ],
    "Home Decor": ["Bedsheets", "Cushion Covers", "Curtains", "Table Linen"],
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('subCategory', subCategory);
      formData.append('bestseller', bestseller);
      formData.append('inStock', inStock);
      formData.append('sizes', JSON.stringify(sizes));

      images.forEach((image, index) => {
        if (image) {
          formData.append(`image${index + 1}`, image);
        }
      });

      const response = await axios.post(`${backendUrl}/api/product/add`, formData, {
        headers: { Authorization: `Bearer ${token}` },
    });
    
      
      if (response.data.success) {
        toast.success(response.data.message);
        // Reset form fields
        setName("");
        setDescription("");
        setPrice("");
        setCategory("Saree");
        setSubCategory(categories["Saree"][0]);
        setBestseller(false);
        setInStock(true);
        setSizes([]);
        setImages([null, null, null, null]);
      } else {
        toast.error(response.data.message);
      }
      
    } catch (error) {
      toast.error("An error occurred while adding the product");
    }
  };

  const handleImageChange = (index, file) => {
    const updatedImages = [...images];
    const updatedPreviews = [...imagePreviews];

    if (updatedPreviews[index]) {
      URL.revokeObjectURL(updatedPreviews[index]);
    }

    if (file) {
      updatedImages[index] = file;
      updatedPreviews[index] = URL.createObjectURL(file);
    } else {
      updatedImages[index] = null;
      updatedPreviews[index] = null;
    }

    setImages(updatedImages);
    setImagePreviews(updatedPreviews);
  };

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => {
        if (preview) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [imagePreviews]);

  const renderImageUpload = (image, preview, index) => (
    <div key={index} className="relative flex-shrink-0">
      <label htmlFor={`image${index}`} className="cursor-pointer block">
        {!image ? (
          <div className="flex items-center justify-center w-40 h-40 sm:w-20 sm:h-20 border-2 border-dashed border-gray-300 rounded-md bg-gray-50">
            <i className="fas fa-upload text-gray-500 text-lg sm:text-xl"></i>
          </div>
        ) : (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-40 h-40 sm:w-20 sm:h-20 object-cover rounded-md"
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleImageChange(index, null);
              }}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full  w-4 h-4 sm:w-6 sm:h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
            >
              ×
            </button>
          </div>
        )}
        <input
          onChange={(e) => handleImageChange(index, e.target.files[0])}
          type="file"
          id={`image${index}`}
          className="hidden"
          accept="image/*"
        />
      </label>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow container mx-auto px-3 sm:px-4 py-4 sm:py-6 ">
        <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-4 pb-20">
          {/* Image Upload Section */}
          <div className="w-full">
            <p className="mb-2 font-semibold">Upload Images</p>
            <div className="flex flex-nowrap gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide">
              <div className="flex flex-nowrap gap-3 sm:gap-4 min-w-min">
                {images.map((image, index) =>
                  renderImageUpload(image, imagePreviews[index], index)
                )}
              </div>
            </div>
          </div>

          {/* Product Name */}
          <div className='w-full'>
            <p className='mb-2 font-semibold'>Product Name</p>
            <input 
              onChange={(e) => setName(e.target.value)} 
              value={name} 
              type="text" 
              className="w-full max-w-[500px] px-3 py-2 border rounded" 
              placeholder="Enter product name" 
              required 
            />
          </div>

          {/* Product Description */}
          <div className="w-full">
            <p className="mb-2 font-semibold">Product Description</p>
            <ReactQuill
              value={description}
              onChange={setDescription}
              className="w-full max-w-[500px] border rounded"
              placeholder="Write product description"
            />
          </div>

          {/* Category, Subcategory, Price */}
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-[500px]'>
            <div>
              <p className='mb-2 font-semibold'>Product Category</p>
              <select
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSubCategory(categories[e.target.value][0]);
                }}
                value={category}
                className='w-full px-3 py-2 border rounded'
              >
                {Object.keys(categories).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <p className='mb-2 font-semibold'>Sub Category</p>
              <select
                onChange={(e) => setSubCategory(e.target.value)}
                value={subCategory}
                className='w-full px-3 py-2 border rounded'
              >
                {categories[category]?.map((subCat) => (
                  <option key={subCat} value={subCat}>{subCat}</option>
                ))}
              </select>
            </div>

            <div>
              <p className='mb-2 font-semibold'>Product Price</p>
              <input 
                onChange={(e) => setPrice(e.target.value)} 
                value={price} 
                className='w-full px-3 py-2 border rounded' 
                type='number' 
                placeholder='Rs' 
                required
              />
            </div>
          </div>

          {/* Sizes */}
          <div className="w-full max-w-[500px]">
            <p className='mb-2 font-semibold'>Product Sizes</p>
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
              {["S", "Free Size", "M", "L", "XL", "XXL", "King", "Queen", "Single", "No Size"].map((size) => (
                <div
                  key={size}
                  onClick={() => setSizes((prev) =>
                    prev.includes(size) ? prev.filter(item => item !== size) : [...prev, size]
                  )}
                  className={`cursor-pointer px-4 py-2 rounded-md text-center border ${
                    sizes.includes(size) ? 'bg-pink-100 text-black' : 'bg-gray-200 text-gray-600'
                  } hover:bg-pink-200 transition duration-200`}
                >
                  {size}
                </div>
              ))}
            </div>
          </div>

          {/* Bestseller Checkbox */}
          <div className='flex items-center gap-2 mt-2'>
            <input 
              onChange={() => setBestseller(prev => !prev)} 
              checked={bestseller} 
              type='checkbox' 
              id='bestseller' 
              className='h-4 w-4'
            />
            <label className='cursor-pointer' htmlFor="bestseller">Add to bestseller</label>
          </div>

          {/* In Stock Checkbox */}
          <div className='flex items-center gap-2 mt-2'>
            <input 
              onChange={() => setInStock(prev => !prev)} 
              checked={inStock} 
              type='checkbox' 
              id='inStock' 
              className='h-4 w-4'
            />
            <label className='cursor-pointer' htmlFor="inStock">In Stock</label>
          </div>

          {/* Submit Button */}
          <button 
            type='submit' 
            className=' w-full max-w-[200px] py-3 mt-4 bg-[#D3756B] border border-[#A75D5D] text-white rounded hover:bg-gray-800 transition duration-300'
          >
            ADD PRODUCT
          </button>
        </form>
      </div>
    </div>
  );
};

export default Add;
