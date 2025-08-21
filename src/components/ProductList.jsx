import React from "react";
import { useSelector } from "react-redux";
import {
  selectVisibleProducts,
  selectStatus,
  selectError,
} from "../features/products/productsSlice";
import ProductCard from "./ProductCard";

function ProductList({ onEdit }) {
  const products = useSelector(selectVisibleProducts);
  const status = useSelector(selectStatus);
  const error = useSelector(selectError);

  if (status === "loading") {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-lg text-gray-600">Loading products...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <div className="text-red-600 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Error Loading Products
          </h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="text-center py-16">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No Products Found
          </h3>
          <p className="text-gray-500">
            {status === "succeeded"
              ? "Try adjusting your search or filter criteria."
              : "Products will appear here once loaded."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Results Summary */}
      <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-2 xs:gap-4">
        <div className="text-sm text-gray-600">
          Showing <span className="font-semibold">{products.length}</span>{" "}
          product{products.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onEdit={onEdit} />
        ))}
      </div>
    </div>
  );
}

export default ProductList;
