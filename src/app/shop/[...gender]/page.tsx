import SidebarFilters, { Filters } from '../../components/SidebarFilters';
import ProductGrid from '../../components/ProductGrid';
import { Product } from '../../../types/api';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { headers } from 'next/headers';
import FilterSidebarWrapper from '../../components/FilterSidebarWrapper';

interface Props {
  params: { gender?: string[] };
  searchParams: { [key: string]: string | string[] | undefined };
}

const GENDERS = ['female', 'male', 'unisex'];

function buildQuery(gender: string | undefined, filters: Filters) {
  const params = new URLSearchParams();
  if (gender && gender !== 'all') params.set('gender', gender.toUpperCase());
  if (filters.category) params.set('category', filters.category);
  if (filters.size) params.set('size', filters.size);
  if (filters.maxPrice) params.set('maxPrice', String(filters.maxPrice));
  return params.toString() ? `/api/products?${params}` : '/api/products';
}

async function fetchProducts(gender: string | undefined, filters: Filters): Promise<Product[]> {
  const url = buildQuery(gender, filters);
  const host = headers().get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const absoluteUrl = url.startsWith('http') ? url : `${protocol}://${host}${url}`;
  const res = await fetch(absoluteUrl, { cache: 'no-store' });
  const data = await res.json();
  return data.success ? data.data : [];
}

function getFiltersFromSearchParams(searchParams: Props['searchParams']): Filters {
  return {
    category: typeof searchParams.category === 'string' ? searchParams.category : undefined,
    maxPrice: typeof searchParams.maxPrice === 'string' ? Number(searchParams.maxPrice) : undefined,
    size: typeof searchParams.size === 'string' ? searchParams.size : undefined,
  };
}

export default async function ShopGenderPage({ params, searchParams }: Props) {
  // params.gender is an array or undefined
  const genderParam = params.gender && params.gender.length > 0 ? params.gender[0] : undefined;
  // If no gender param (i.e., /shop), treat as 'all'.
  if (genderParam && !GENDERS.includes(genderParam) && genderParam !== 'all') notFound();
  const filters = getFiltersFromSearchParams(searchParams);
  const products = await fetchProducts(genderParam === 'all' ? undefined : genderParam, filters);

  return (
    <div className="max-w-7xl mx-auto px-2 md:px-6 py-8 flex flex-col md:flex-row gap-6 mt-20">
      {/* Sidebar (left on desktop, collapsible on mobile) */}
      <div className="md:w-64 md:shrink-0">
        <Suspense fallback={<div className='p-4'>Loading filters...</div>}>
          <FilterSidebarWrapper />
        </Suspense>
      </div>
      {/* Product grid */}
      <div className="flex-1">
        {products.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-gray-600">No products found.</div>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </div>
  );
} 