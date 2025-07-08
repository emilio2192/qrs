export async function fetchProducts(params?: Record<string, string | number | undefined>) {
  let url = '/api/products';
  if (params && Object.keys(params).length > 0) {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') search.set(key, String(value));
    });
    url += `?${search.toString()}`;
  }
  const res = await fetch(url, { cache: 'no-store' });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to fetch products');
  return data.data;
}

export async function fetchProduct(id: string) {
  const products = await fetchProducts({ id });
  return products && products.length > 0 ? products[0] : null;
}

export async function fetchBanners() {
  const res = await fetch('/api/banners', { cache: 'no-store' });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to fetch banners');
  return data.data;
} 