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

// Authentication functions
export async function loginUser(email: string, password: string) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.error || 'Login failed');
  }

  return data;
}

export async function signupUser(name: string, email: string, password: string) {
  const res = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.error || 'Signup failed');
  }

  return data;
}

export async function verifyToken(token: string) {
  const res = await fetch('/api/auth/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  });

  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.error || 'Token verification failed');
  }

  return data;
} 

export async function createCheckout(userId: string, items: any[], options?: { appliedPromotion?: string, totalPrice?: number }) {
  const body: any = { userId, items };
  if (options?.appliedPromotion) body.appliedPromotion = options.appliedPromotion;
  if (options?.totalPrice) body.totalPrice = options.totalPrice;
  const res = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Checkout failed');
  return res.json();
} 

export async function getOrderHistory(userId: string) {
  const res = await fetch(`/api/orders?userId=${encodeURIComponent(userId)}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch order history');
  }
  return data.orders;
} 