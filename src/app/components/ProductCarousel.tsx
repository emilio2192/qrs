'use client';

import { useEffect, useState, useRef } from 'react';
import { Product } from '../../types/api';
import ProductCard from './ProductCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useTranslations } from 'next-intl';
import { fetchProducts as fetchProductsApi } from '../../lib/request';

interface ProductCarouselProps {
  apiUrl?: string;
}

export default function ProductCarousel({ apiUrl = '/api/products?sort=newest' }: ProductCarouselProps) {
  const t = useTranslations();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Parse params from apiUrl if present
        let params: Record<string, string> = {};
        if (apiUrl && apiUrl.includes('?')) {
          const search = apiUrl.split('?')[1];
          params = Object.fromEntries(new URLSearchParams(search));
        }
        const products = await fetchProductsApi(params);
        setProducts(products);
      } catch (err) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiUrl]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const scrollAmount = clientWidth * 0.8;
    scrollRef.current.scrollTo({
      left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="my-8">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Scroll left"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Scroll right"
          >
            <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
          </button>
        </div>
      </div>
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="h-64 flex items-center justify-center text-red-600">{t('common.error')}</div>
      ) : products.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-600">{t('common.noProducts')}</div>
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-2 pb-4"
          style={{ scrollBehavior: 'smooth' }}
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
} 