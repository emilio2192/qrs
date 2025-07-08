'use client';

import { useTranslations } from 'next-intl';
import BannerCarousel from './components/BannerCarousel';
import ProductCarousel from './components/ProductCarousel';

export default function Home() {
  const t = useTranslations();
  return (
    <div className="min-h-screen">
      {/* Banner Carousel - now self-contained */}
      <BannerCarousel />

      {/* New Arrivals Product Carousel */}
      
      
      {/* Additional content can go here */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
         {t('product.newArrivals')}
        </h2>
        <ProductCarousel title="New Arrivals" />
      </div>
    </div>
  );
}
