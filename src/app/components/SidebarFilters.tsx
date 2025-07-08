"use client";
import { useState } from 'react';

export interface Filters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
}

interface SidebarFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function SidebarFilters({ filters, onChange }: SidebarFiltersProps) {
  const [open, setOpen] = useState(false);

  // Handle filter changes
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, category: e.target.value });
  };
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, maxPrice: Number(e.target.value) });
  };
  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, size: e.target.value });
  };

  return (
    <aside>
      {/* Mobile: Collapse button */}
      <div className="md:hidden flex justify-between items-center mb-2">
        <span className="font-semibold text-lg">Filters</span>
        <button
          className="px-3 py-1 border rounded text-sm"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          {open ? 'Hide' : 'Show'}
        </button>
      </div>
      {/* Filters content */}
      <div
        className={`bg-white rounded-lg shadow-sm p-4 md:block ${open ? '' : 'hidden'} md:!block`}
      >
        <div className="font-semibold text-lg mb-4 hidden md:block">Filters</div>
        {/* Category filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Category</label>
          <select className="w-full border rounded px-2 py-1" value={filters.category || ''} onChange={handleCategoryChange}>
            <option value="">All</option>
            <option value="T-Shirts">T-Shirts</option>
            <option value="Jeans">Jeans</option>
            <option value="Dresses">Dresses</option>
          </select>
        </div>
        {/* Size filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Size</label>
          <select className="w-full border rounded px-2 py-1" value={filters.size || ''} onChange={handleSizeChange}>
            <option value="">All</option>
            {SIZES.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
        {/* Price filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Max Price</label>
          <input type="range" min="0" max="200" value={filters.maxPrice || 200} onChange={handlePriceChange} className="w-full" />
          <div className="text-xs text-gray-600 mt-1">Up to ${filters.maxPrice || 200}</div>
        </div>
        {/* Add more filters as needed */}
      </div>
    </aside>
  );
} 