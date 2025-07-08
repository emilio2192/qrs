// Banner API interfaces
export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  buttonText?: string;
  buttonLink?: string;
  order: number;
}

export interface BannerResponse {
  success: boolean;
  data?: Banner[];
  error?: string;
}

// Product API interfaces
export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  categoryId: string;
  gender: 'MALE' | 'FEMALE' | 'UNISEX';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category?: ProductCategory;
  images?: ProductImage[];
  sizes?: ProductSize[];
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  alt?: string;
  isPrimary: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductSize {
  id: string;
  productId: string;
  size: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductResponse {
  success: boolean;
  data: Product[];
  error?: string;
}

// User API interfaces
export interface User {
  id: string;
  email: string;
  userType: 'COMMON' | 'VIP';
  name?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserResponse {
  success: boolean;
  data?: User;
  error?: string;
}

// Cart API interfaces
export interface Cart {
  id: string;
  userId: string;
  totalPrice: number;
  appliedPromotion?: string;
  status: 'ACTIVE' | 'ABANDONED' | 'COMPLETED';
  abandonedAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user?: User;
  items?: CartItem[];
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  size: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  product?: Product;
}

export interface CartResponse {
  success: boolean;
  data?: Cart;
  error?: string;
}

// Generic API response interface
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
} 