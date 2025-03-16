import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import { Upload, Trash2, ImagePlus } from "lucide-react";

const categories = ["Saree", "Readymades", "Home Decor", "Dress materials"];

const AdminCategoryImages = () => {
  const [categoryImages, setCategoryImages] = useState({}); // Stores images for categories
  const [selectedFiles, setSelectedFiles] = useState({}); // Stores selected files
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategoryImages();
  }, []);

  // Fetch existing category images
  const fetchCategoryImages = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/category/list`);
      if (res.data.success) {
        setCategoryImages(res.data.images);
      }
    } catch (error) {
      toast.error("Failed to fetch category images");
    }
  };

  // Handle file selection for a category
  const handleFileChange = (e, category) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFiles((prev) => ({ ...prev, [category]: file }));
    }
  };

  // Upload image for a category
  const handleUpload = async (category) => {
    if (!selectedFiles[category]) return toast.error("Please select an image");

    setLoading(true);
    const formData = new FormData();
    formData.append("image", selectedFiles[category]);
    formData.append("category", category);

    try {
      const res = await axios.post(`${backendUrl}/api/category/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success(`Image uploaded for ${category}`);
        fetchCategoryImages();
        setSelectedFiles((prev) => ({ ...prev, [category]: null }));
      }
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // Delete image for a category
  const handleDelete = async (category) => {
    try {
      await axios.delete(`${backendUrl}/api/category/delete/${category}`);
      toast.success("Image deleted successfully");
      fetchCategoryImages();
    } catch (error) {
      toast.error("Failed to delete image");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Manage Category Images</h2>

      <div className="space-y-6">
        {categories.map((category) => (
          <div key={category} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-4">
              {categoryImages[category] ? (
                <img src={categoryImages[category]} alt={category} className="w-20 h-20 object-cover rounded-md border" />
              ) : (
                <div className="w-20 h-20 flex items-center justify-center bg-gray-200 rounded-md border">
                  <ImagePlus size={24} className="text-gray-500" />
                </div>
              )}

              <div>
                <p className="font-semibold text-gray-700">{category}</p>
                {selectedFiles[category] && <p className="text-xs text-gray-500">{selectedFiles[category].name}</p>}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Upload Button */}
              <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md cursor-pointer transition-colors">
                <ImagePlus size={18} />
                Select
                <input type="file" onChange={(e) => handleFileChange(e, category)} className="hidden" accept="image/*" />
              </label>

              {/* Upload Image */}
              <button
                onClick={() => handleUpload(category)}
                disabled={loading || !selectedFiles[category]}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md disabled:opacity-50 transition-colors"
              >
                <Upload size={18} />
              </button>

              {/* Delete Image */}
              {categoryImages[category] && (
                <button
                  onClick={() => handleDelete(category)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                  title="Delete image"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCategoryImages;
