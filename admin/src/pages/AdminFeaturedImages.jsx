import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Upload, X, GripVertical, Trash2, ImagePlus } from "lucide-react";

const AdminFeaturedImages = () => {
  const [images, setImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendUrl}/api/featured/list`);
      if (res.data.success) {
        setImages(res.data.images);
      }
    } catch (error) {
      toast.error("Failed to fetch images");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const removeSelectedFile = (indexToRemove) => {
    setSelectedFiles(selectedFiles.filter((_, index) => index !== indexToRemove));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return toast.error("Please select images");
    setLoading(true);

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("images", file));

    try {
      const res = await axios.post(`${backendUrl}/api/featured/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success(`${selectedFiles.length} image${selectedFiles.length > 1 ? 's' : ''} uploaded successfully`);
        fetchImages();
        setSelectedFiles([]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${backendUrl}/api/featured/delete/${id}`);
      setImages(images.filter((img) => img._id !== id));
      toast.success("Image deleted successfully");
    } catch (error) {
      toast.error("Failed to delete image");
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    setIsDragging(false);

    const reorderedImages = [...images];
    const [movedImage] = reorderedImages.splice(result.source.index, 1);
    reorderedImages.splice(result.destination.index, 0, movedImage);

    setImages(reorderedImages);

    try {
      await axios.put(`${backendUrl}/api/featured/update-image`, {
        orderedImages: reorderedImages.map((img, index) => ({ id: img._id, order: index })),
      });
      toast.success("Image order updated successfully");
    } catch (error) {
      toast.error("Failed to update order");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Manage Featured Images</h2>
      
      {/* Upload Section */}
      <div className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Upload New Images</h3>
        
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md cursor-pointer transition-colors">
            <ImagePlus size={18} />
            Select Images
            <input 
              type="file" 
              multiple 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*"
            />
          </label>
          
          <button
            onClick={handleUpload}
            disabled={loading || selectedFiles.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Upload size={18} />
            {loading ? "Uploading..." : "Upload Selected"}
          </button>
        </div>
        
        {/* Preview Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Selected Images ({selectedFiles.length})</p>
            <div className="flex gap-3 flex-wrap">
              {selectedFiles.map((file, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-md border border-gray-300"
                  />
                  <button
                    onClick={() => removeSelectedFile(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove"
                  >
                    <X size={14} />
                  </button>
                  <p className="text-xs text-gray-500 mt-1 truncate max-w-24">{file.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Gallery Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center justify-between">
          <span>Featured Images ({images.length})</span>
          {isDragging && <span className="text-sm text-blue-500">Drag to reorder</span>}
        </h3>
        
        {loading && images.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Loading images...</div>
        ) : images.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No featured images yet</div>
        ) : (
          <DragDropContext 
            onDragEnd={handleDragEnd} 
            onDragStart={() => setIsDragging(true)}
          >
            <Droppable droppableId="featured-images">
              {(provided) => (
                <ul 
                  {...provided.droppableProps} 
                  ref={provided.innerRef} 
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  {images.map((img, index) => (
                    <Draggable key={img._id} draggableId={img._id} index={index}>
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="flex items-center bg-gray-50 rounded-lg border border-gray-200 overflow-hidden"
                        >
                          <div 
                            {...provided.dragHandleProps}
                            className="flex items-center justify-center p-3 bg-gray-100 cursor-grab active:cursor-grabbing"
                          >
                            <GripVertical size={18} className="text-gray-500" />
                          </div>
                          
                          <div className="flex items-center justify-between flex-1 p-3">
                            <div className="flex items-center gap-4">
                              <img src={img.url} alt="Featured" className="w-16 h-16 object-cover rounded-md border" />
                              <div className="text-sm text-gray-600 truncate max-w-xs">
                                {img.url.split('/').pop()}
                              </div>
                            </div>
                            
                            <button
                              onClick={() => handleDelete(img._id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                              title="Delete image"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
    </div>
  );
};

export default AdminFeaturedImages;