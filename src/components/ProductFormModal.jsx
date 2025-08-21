import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addProduct, updateProduct } from "../features/products/productsSlice";

function ProductFormModal({ open, onClose, initial }) {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [category, setCategory] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initial) {
      setTitle(initial.title || "");
      setPrice(initial.price ?? 0);
      setStock(initial.stock ?? 0);
      setCategory(initial.category || "");
      setThumbnail(initial.thumbnail || "");
    } else {
      setTitle("");
      setPrice(0);
      setStock(0);
      setCategory("");
      setThumbnail("");
    }
  }, [initial, open]);

  if (!open) return null;

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      title,
      price: Number(price),
      stock: Number(stock),
      category,
      thumbnail,
    };

    try {
      if (initial?.id != null) {
        await dispatch(
          updateProduct({ id: initial.id, changes: payload })
        ).unwrap();
      } else {
        await dispatch(addProduct(payload)).unwrap();
      }
      onClose();
    } catch (err) {
      alert(err.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full h-full sm:h-auto max-w-full sm:max-w-lg md:max-w-2xl glass-effect rounded-none sm:rounded-2xl shadow-2xl flex flex-col justify-center mx-0 sm:mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/20">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {initial ? "✏️ Edit Product" : "➕ Add New Product"}
            </h2>
            <p className="text-gray-600 mt-1">
              {initial
                ? "Update product information"
                : "Create a new product entry"}
            </p>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto max-h-[80vh]"
        >
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📝 Product Name *
            </label>
            <input
              className="input-field"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter product name..."
              required
            />
          </div>

          {/* Price and Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                💰 Price *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="input-field"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📦 Stock Quantity *
              </label>
              <input
                type="number"
                min="0"
                className="input-field"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="0"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📂 Category
            </label>
            <input
              className="input-field"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., Electronics, Clothing, Books..."
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🖼️ Image URL
            </label>
            <input
              className="input-field"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
            {thumbnail && (
              <div className="mt-2 flex justify-center sm:justify-start">
                <img
                  src={thumbnail}
                  alt="Preview"
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md sm:rounded-lg border"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {initial ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {initial ? "Update Product" : "Create Product"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductFormModal;
