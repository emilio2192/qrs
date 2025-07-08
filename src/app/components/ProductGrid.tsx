"use client";
import { Product } from '../../types/api';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products?: Product[] | null;
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="h-32 flex items-center justify-center text-gray-600">
        No products found.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 items-stretch" role="grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
} 