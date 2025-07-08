"use client";
import { useState, useMemo, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import debounce from 'lodash.debounce';

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
  const t = useTranslations();
  const [open, setOpen] = useState(false);

  // Local state for slider value
  const [localMaxPrice, setLocalMaxPrice] = useState(filters.maxPrice || 200);

  // Sync local state if filters.maxPrice changes externally
  useEffect(() => {
    setLocalMaxPrice(filters.maxPrice || 200);
  }, [filters.maxPrice]);

  // Debounced onChange for price
  const debouncedPriceChange = useMemo(
    () => debounce((value: number) => {
      onChange({ ...filters, maxPrice: value });
    }, 300),
    [onChange, filters]
  );

  useEffect(() => {
    return () => {
      debouncedPriceChange.cancel();
    };
  }, [debouncedPriceChange]);

  // Handle filter changes
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, category: e.target.value });
  };
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setLocalMaxPrice(value); // update UI immediately
    debouncedPriceChange(value); // debounce the filter logic
  };
  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, size: e.target.value });
  };

  return (
    <aside>
      {/* Mobile: Collapse button */}
      <div className="md:hidden flex justify-between items-center mb-2">
        <span className="font-semibold text-lg">{t('common.filters')}</span>
        <button
          type="button"
          className="px-3 py-1 border rounded text-sm"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          {open ? t('common.hide') : t('common.show')}
        </button>
      </div>
      {/* Filters content */}
      <div
        className={`bg-white rounded-lg shadow-sm p-4 md:block ${open ? '' : 'hidden'} md:!block`}
      >
        <div className="font-semibold text-lg mb-4 hidden md:block">{t('common.filters')}</div>
        {/* Category filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">{t('product.category')}</label>
          <select className="w-full border rounded px-2 py-1" value={filters.category || ''} onChange={handleCategoryChange}>
            <option value="">{t('common.all')}</option>
            <option value="T-Shirts">T-Shirts</option>
            <option value="Jeans">Jeans</option>
            <option value="Dresses">Dresses</option>
          </select>
        </div>
        {/* Size filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">{t('product.size')}</label>
          <select className="w-full border rounded px-2 py-1" value={filters.size || ''} onChange={handleSizeChange}>
            <option value="">{t('common.all')}</option>
            {SIZES.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
        {/* Price filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">{t('product.maxPrice')}</label>
          <input type="range" min="0" max="200" value={localMaxPrice} onChange={handlePriceChange} className="w-full" />
          <div className="text-xs text-gray-600 mt-1">{t('product.upTo', { price: localMaxPrice })}</div>
        </div>
        {/* Add more filters as needed */}
      </div>
    </aside>
  );
} 