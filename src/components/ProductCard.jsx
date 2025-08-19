import React from "react";
import { useDispatch } from "react-redux";
import { deleteProduct } from "../features/products/productsSlice";

function ProductCard({ product, onEdit }) {
  const dispatch = useDispatch();
  const inStock = Number(product.stock) > 0;

  return (
    <div className="card-hover bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
      {/* Product Image */}
      <div className="relative mb-4">
        <img
          src={
            product.thumbnail ||
            "https://via.placeholder.com/300x200?text=No+Image"
          }
          alt={product.title}
          className="w-full h-48 object-cover rounded-lg shadow-md"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
          }}
        />
        <div className="absolute top-2 right-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              inStock
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 leading-tight">
          {product.title}
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">📂</span>
            <span className="text-sm text-gray-600 capitalize">
              {product.category}
            </span>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </div>
            <div className="text-sm text-gray-500">
              Stock: {product.stock} units
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            className="btn-warning flex-1 flex items-center justify-center gap-2"
            onClick={() => onEdit(product)}
          >
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit
          </button>
          <button
            className="btn-danger flex-1 flex items-center justify-center gap-2"
            onClick={() => {
              if (
                window.confirm("Are you sure you want to delete this product?")
              ) {
                dispatch(deleteProduct(product.id));
              }
            }}
          >
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
