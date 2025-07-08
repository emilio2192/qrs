"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Product } from '../../types/api';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const images = product.images && product.images.length > 0
    ? product.images.map(img => img.url)
    : ['/placeholder.png'];

  const [imgIndex, setImgIndex] = useState(0);

  const isLastImage = imgIndex === images.length - 1;
  const isPlaceholder = images[imgIndex] === '/placeholder.png';

  const handleError = () => {
    if (imgIndex < images.length - 1) {
      setImgIndex(imgIndex + 1);
    } else {
      setImgIndex(images.length - 1);
    }
  };

  return (
    <Link href={`/product/${product.id}`} className="block group focus:outline-none h-full w-full">
      <div className="rounded-xl bg-white shadow-sm overflow-hidden w-full h-full flex flex-col group-hover:shadow-md transition-shadow cursor-pointer">
        <div className="relative w-full h-56 bg-gray-100 flex-shrink-0">
          <Image
            src={images[imgIndex]}
            alt={product.name}
            fill
            className="object-cover"
            sizes="192px"
            onError={handleError}
          />
          {isLastImage && isPlaceholder && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-80">
              <span className="text-gray-500 font-semibold text-sm">Not available</span>
            </div>
          )}
        </div>
        <div className="p-3 flex-1 flex flex-col justify-end">
          <div className="text-sm font-medium text-gray-900 truncate group-hover:underline">{product.name}</div>
          <div className="text-sm text-gray-700 mt-1">${Number(product.price).toLocaleString()}</div>
        </div>
      </div>
    </Link>
  );
} 