'use client';

import { useState, useEffect } from 'react';

interface Category {
  id: number;
  name: string;
}

interface FilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  sortBy: string;
  onSortChange: (sortBy: string) => void;
  priceRange: { min: number; max: number };
  onPriceRangeChange: (range: { min: number; max: number }) => void;
  maxPrice: number;
  onClearFilters: () => void;
}

export default function ProductFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  priceRange,
  onPriceRangeChange,
  maxPrice,
  onClearFilters,
}: FilterProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 flex items-center justify-between"
        >
          <span>Filters</span>
          <svg
            className={`w-5 h-5 transition-transform ${isMobileOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Filter Sidebar */}
      <div className={`
        ${isMobileOpen ? 'block' : 'hidden'} 
        lg:block 
        bg-white border border-gray-200 rounded-lg p-6 mb-6 lg:mb-0
      `}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Filters</h3>
          <button
            onClick={onClearFilters}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear All
          </button>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Category</h4>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="category"
                value=""
                checked={selectedCategory === ''}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="mr-2"
              />
              <span className="text-sm">All Categories</span>
            </label>
            {categories.map((category) => (
              <label key={category.id} className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value={category.id.toString()}
                  checked={selectedCategory === category.id.toString()}
                  onChange={(e) => onCategoryChange(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm">{category.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Sort By */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Sort By</h4>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Default</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A to Z</option>
            <option value="name_desc">Name: Z to A</option>
            <option value="rating_desc">Rating: High to Low</option>
            <option value="newest">Newest First</option>
          </select>
        </div>

        {/* Price Range Filter */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <div className="flex-1">
                <label className="block text-xs text-gray-600 mb-1">Min</label>
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) => onPriceRangeChange({
                    ...priceRange,
                    min: parseFloat(e.target.value) || 0
                  })}
                  className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                  placeholder="0"
                  min="0"
                  max={priceRange.max}
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-600 mb-1">Max</label>
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => onPriceRangeChange({
                    ...priceRange,
                    max: parseFloat(e.target.value) || maxPrice
                  })}
                  className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                  placeholder={maxPrice.toString()}
                  min={priceRange.min}
                  max={maxPrice}
                />
              </div>
            </div>
            
            {/* Price Range Slider */}
            <div className="px-2">
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  value={priceRange.min}
                  onChange={(e) => onPriceRangeChange({
                    ...priceRange,
                    min: parseFloat(e.target.value)
                  })}
                  className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(priceRange.min / maxPrice) * 100}%, #e5e7eb ${(priceRange.min / maxPrice) * 100}%, #e5e7eb 100%)`
                  }}
                />
                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  value={priceRange.max}
                  onChange={(e) => onPriceRangeChange({
                    ...priceRange,
                    max: parseFloat(e.target.value)
                  })}
                  className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #e5e7eb 0%, #e5e7eb ${(priceRange.max / maxPrice) * 100}%, #3b82f6 ${(priceRange.max / maxPrice) * 100}%, #3b82f6 100%)`
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>${priceRange.min}</span>
                <span>${priceRange.max}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Active Filters Summary */}
        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-900 mb-2">Active Filters</h4>
          <div className="space-y-1 text-sm text-gray-600">
            {selectedCategory && (
              <div className="flex items-center justify-between">
                <span>Category: {categories.find(c => c.id.toString() === selectedCategory)?.name || 'Unknown'}</span>
                <button
                  onClick={() => onCategoryChange('')}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            )}
            {sortBy && (
              <div className="flex items-center justify-between">
                <span>Sort: {sortBy.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                <button
                  onClick={() => onSortChange('')}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            )}
            {(priceRange.min > 0 || priceRange.max < maxPrice) && (
              <div className="flex items-center justify-between">
                <span>Price: ${priceRange.min} - ${priceRange.max}</span>
                <button
                  onClick={() => onPriceRangeChange({ min: 0, max: maxPrice })}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}