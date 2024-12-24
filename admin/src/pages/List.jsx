import React, { useState, useEffect } from 'react';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaTrash, FaEdit } from 'react-icons/fa';
import EditProduct from '../components/EditProduct'; // Import EditProduct component

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [editProduct, setEditProduct] = useState(null); // State for the product being edited

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list');
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/product/remove',
        { id },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
        setConfirmDelete(null);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-xl font-semibold mb-4">All Products List</h2>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <div className="grid grid-cols-[0.5fr_2fr_1fr_1fr_1fr_1fr] items-center py-2 px-4 border-b bg-gray-100 font-semibold text-sm ">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Sizes</b>
          <b>Price</b>
          <b className="text-center">Actions</b>
        </div>

        {list.map((item) => (
          <div
            key={item._id}
            className="grid grid-cols-[0.5fr_2fr_1fr_1fr_1fr_1fr] items-center py-2 px-4 border-b text-sm hover:bg-gray-50 transition "
          >
            <img
              className="w-12 h-12 object-cover rounded"
              src={item.image[0]}
              alt={item.name}
            />
            <p className="font-medium">{item.name}</p>
            <p>{item.category}</p>
            <p className="text-xs">{item.sizes.join(', ')}</p>
            <p className="font-semibold">{currency}{item.price}</p>
            <div className="flex justify-center items-center space-x-3">
              <FaEdit
                className="text-blue-500 cursor-pointer hover:text-blue-600"
                onClick={() => setEditProduct(item)} // Open EditProduct with selected product
              />
              <FaTrash
                className="text-red-400 cursor-pointer hover:text-red-500"
                onClick={() => setConfirmDelete(item._id)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4 pb-20">
        {list.map((item) => (
          <div
            key={item._id}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center mb-3">
              <img
                className="w-16 h-16 object-cover rounded mr-4"
                src={item.image[0]}
                alt={item.name}
              />
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-600">{item.category}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-500">Sizes</p>
                <p className="font-medium">{item.sizes.join(', ')}</p>
              </div>
              <div>
                <p className="text-gray-500">Price</p>
                <p className="font-semibold">{currency}{item.price}</p>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-3">
              <FaEdit
                className="text-blue-500 cursor-pointer hover:text-blue-600"
                onClick={() => setEditProduct(item)} // Open EditProduct with selected product
              />
              <FaTrash
                className="text-red-400 cursor-pointer hover:text-red-500"
                onClick={() => setConfirmDelete(item._id)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center">
            <p className="mb-4 text-lg">Are you sure you want to delete this product?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => removeProduct(confirmDelete)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editProduct && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div
      className="bg-white rounded-lg shadow-xl w-full max-w-lg h-full max-h-[90vh] overflow-y-auto p-6"
    >
      <EditProduct
        product={editProduct}
        token={token}
        onClose={() => setEditProduct(null)} // Close the modal
        onUpdate={fetchList} // Refresh the product list
      />
    </div>
  </div>
)}
    </div>
  );
};

export default List;
