import React, { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';
import 'react-quill/dist/quill.snow.css'; // Import the Quill CSS
import ReactQuill from 'react-quill';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const EditProduct = ({ product, token, onClose, onUpdate }) => {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);

  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.price || "");
  const [category, setCategory] = useState(product?.category || "Saree");
  const [subCategory, setSubCategory] = useState(product?.subCategory || "");
  const [bestseller, setBestseller] = useState(product?.bestseller || false);
  const [inStock, setInStock] = useState(product?.inStock || true);
  const [sizes, setSizes] = useState(product?.sizes || []);
  const [colors, setColors] = useState(product?.colors || []);
  const [stockQuantity, setStockQuantity] = useState(product?.stockQuantity || ""); // New state for stock quantity


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
      formData.append('productId', product._id);
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('subCategory', subCategory);
      formData.append('bestseller', bestseller);
      formData.append('inStock', inStock); // Append inStock to form data
      formData.append('sizes', JSON.stringify(sizes.filter(size => size.quantity !== null)));
      formData.append('stockQuantity', stockQuantity);
      formData.append('colors', JSON.stringify(colors.filter((color) => color.quantity !== null && color.quantity > 0)));


      if (image1) formData.append("image1", image1);
      if (image2) formData.append("image2", image2);
      if (image3) formData.append("image3", image3);
      if (image4) formData.append("image4", image4);

      const response = await axios.post(
        backendUrl + "/api/product/update",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Use 'Bearer' prefix for the token
          },
        }
      );
      
      if (response.data.success) {
        toast.success(response.data.message);
        onUpdate(); // Notify parent to refresh the product list
        onClose(); // Close the modal or form
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("An error occurred while updating the product");
    }
  };

  const updateColorQuantity = (color, quantity) => {
    setColors((prevColors) => {
      const existingColor = prevColors.find((item) => item.color === color);
      if (existingColor) {
        return prevColors.map((item) =>
          item.color === color ? { ...item, quantity: quantity === "" ? null : parseInt(quantity, 10) } : item
        );
      }
      return prevColors;
    });
  };

  const addNewColor = () => {
    setColors([...colors, { color: "", quantity: 0 }]);
  };
  
  const removeColor = (index) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const updateSizeQuantity = (size, quantity) => {
    setSizes((prevSizes) => {
      const existingSize = prevSizes.find((item) => item.size === size);
      if (existingSize) {
        return prevSizes.map((item) =>
          item.size === size ? { ...item, quantity: parseInt(quantity, 10) || 0 } : item
        );
      }
      // If the size doesn't exist, add it
      return [...prevSizes, { size, quantity: parseInt(quantity, 10) || 0 }];
    });
  };

  const renderImageUpload = (image, setImage, id, existingImage) => (
    <label htmlFor={id} className="cursor-pointer">
      {!image && existingImage ? (
        <img
          src={existingImage}
          alt="Existing Preview"
          className="w-20 h-20 object-cover rounded-md"
        />
      ) : !image ? (
        <div className="flex items-center justify-center w-20 h-20 border-2 border-dashed border-gray-300 rounded-md">
          <i className="fas fa-upload text-gray-500 text-xl"></i>
        </div>
      ) : (
        <img
          src={URL.createObjectURL(image)}
          alt="Uploaded Preview"
          className="w-20 h-20 object-cover rounded-md"
        />
      )}
      <input
        onChange={(e) => setImage(e.target.files[0])}
        type="file"
        id={id}
        hidden
      />
    </label>
  );

  return (
    <div className="min-h-screen flex flex-col pb-24">
       
      <div className="flex-grow container mx-auto px-4 py-6 overflow-y-auto">
      <div className="absolute top-4 right-4">
        <button
          onClick={onClose}
          className="text-red-500 hover:text-gray-800 p-2 rounded-full bg-gray-200 hover:bg-gray-300"
        >
          <i className="fas fa-times text-lg"></i>
        </button>
      </div>
        <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-4">
          {/* Image Upload Section */}
          <div className="w-full">
            <p className="mb-2 font-semibold">Update Images</p>
            <div className="flex gap-2 overflow-x-auto pb-2 flex-nowrap">
              {renderImageUpload(image1, setImage1, "image1", product.image[0])}
              {renderImageUpload(image2, setImage2, "image2", product.image[1])}
              {renderImageUpload(image3, setImage3, "image3", product.image[2])}
              {renderImageUpload(image4, setImage4, "image4", product.image[3])}
            </div>
          </div>

          {/* Product Name */}
          <div className="w-full">
            <p className="mb-2 font-semibold">Product Name</p>
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-[500px]">
            <div>
              <p className="mb-2 font-semibold">Product Category</p>
              <select
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSubCategory(categories[e.target.value][0]);
                }}
                value={category}
                className="w-full px-3 py-2 border rounded"
              >
                {Object.keys(categories).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <p className="mb-2 font-semibold">Sub Category</p>
              <select
                onChange={(e) => setSubCategory(e.target.value)}
                value={subCategory}
                className="w-full px-3 py-2 border rounded"
              >
                {categories[category]?.map((subCat) => (
                  <option key={subCat} value={subCat}>{subCat}</option>
                ))}
              </select>
            </div>

            <div>
              <p className="mb-2 font-semibold">Product Price</p>
              <input
                onChange={(e) => setPrice(e.target.value)}
                value={price}
                className="w-full px-3 py-2 border rounded"
                type="number"
                placeholder="Rs"
                required
              />
            </div>
          </div>

          {/* Colors */}
<div className="w-full max-w-[500px]">
  <p className="mb-2 font-semibold">Product Colors and Quantities</p>
  {colors.map((item, index) => (
    <div key={index} className="flex items-center gap-4 mb-2">
      <input
        type="text"
        placeholder="Color"
        value={item.color || ''}
        onChange={(e) => {
          const updatedColors = [...colors];
          updatedColors[index].color = e.target.value;
          setColors(updatedColors);
        }}
        className="w-1/3 px-3 py-2 border rounded"
      />
      <input
        type="number"
        placeholder="Quantity"
        min="0"
        value={item.quantity || ''}
        onChange={(e) => updateColorQuantity(item.color, e.target.value)}
        className="w-1/3 px-3 py-2 border rounded"
      />
      <button
        type="button"
        onClick={() => removeColor(index)}
        className="text-red-500 hover:text-red-700"
      >
        Remove
      </button>
    </div>
  ))}
  <button
    type="button"
    onClick={addNewColor}
    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
  >
    Add Color
  </button>
</div>


          {/* Sizes */}
          <div className="w-full max-w-[500px]">
            <p className="mb-2 font-semibold">Product Sizes and Quantities</p>
            {['S', 'M', 'L', 'XL', 'XXL', 'King', 'Queen', 'Single', 'Free-Size'].map((size) => (
              <div key={size} className="flex items-center gap-4 mb-2">
                <label className="w-1/3 font-medium">{size}</label>
                <input
                  type="number"
                  placeholder="Quantity"
                  min="0"
                  value={sizes.find((item) => item.size === size)?.quantity || ''}
                  onChange={(e) => updateSizeQuantity(size, e.target.value)}
                  className="w-2/3 px-3 py-2 border rounded"
                />
              </div>
            ))}
          </div>
          {/* Bestseller Checkbox */}
          <div className="flex items-center gap-2 mt-2">
            <input
              onChange={() => setBestseller(prev => !prev)}
              checked={bestseller}
              type="checkbox"
              id="bestseller"
              className="h-4 w-4"
            />
            <label className="cursor-pointer" htmlFor="bestseller">Add to bestseller</label>
          </div>
          {/* Stock Quantity */}
<div className="w-full max-w-[500px]">
  <p className="mb-2 font-semibold">Stock Quantity</p>
  <input
    onChange={(e) => setStockQuantity(e.target.value)}
    value={stockQuantity}
    className="w-full px-3 py-2 border rounded"
    type="number"
    placeholder="Enter stock quantity"
    min="0"
   
  />
</div>


          {/* In Stock Checkbox */}
          <div className="flex items-center gap-2 mt-2">
            <input
              onChange={() => setInStock(prev => !prev)}
              checked={inStock}
              type="checkbox"
              id="inStock"
              className="h-4 w-4"
            />
            <label className="cursor-pointer" htmlFor="inStock">In Stock</label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full max-w-[200px] py-3 mt-4 bg-[#D3756B] border border-[#A75D5D] text-white rounded hover:bg-gray-800 transition duration-300"
          >
            UPDATE PRODUCT
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
