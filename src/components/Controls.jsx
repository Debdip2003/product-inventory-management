import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCategories,
  selectFilters,
  setCategory,
  setQuery,
  setSortBy,
  setSortDir,
} from "../features/products/productsSlice";

function Controls({ onAdd }) {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const filters = useSelector(selectFilters);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Search and Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Search Input */}
        <div className="sm:col-span-2 lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🔍 Search Products
          </label>
          <input
            type="text"
            value={filters.query}
            onChange={(e) => dispatch(setQuery(e.target.value))}
            placeholder="Search by name or category..."
            className="input-field"
          />
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📂 Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => dispatch(setCategory(e.target.value))}
            className="select-field"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Controls */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🔄 Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => dispatch(setSortBy(e.target.value))}
              className="select-field"
            >
              <option value="name">Name</option>
              <option value="price">Price</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📊 Order
            </label>
            <select
              value={filters.sortDir}
              onChange={(e) => dispatch(setSortDir(e.target.value))}
              className="select-field"
            >
              <option value="asc">↑ Asc</option>
              <option value="desc">↓ Desc</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-end gap-2 xs:gap-4">
        <button onClick={onAdd} className="btn-primary flex items-center gap-2">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add New Product
        </button>
      </div>
    </div>
  );
}

export default Controls;
