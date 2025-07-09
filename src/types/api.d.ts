// API Response interfaces
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ProductResponse extends ApiResponse<Product[]> {}
export interface BannerResponse extends ApiResponse<Banner[]> {}

// Product interfaces
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
  images?: ProductImage[];
  sizes?: ProductSize[];
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

// Authentication interfaces
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  user: User;
  token: string;
}

export interface TokenVerificationRequest {
  token: string;
}

export interface TokenVerificationResponse {
  valid: boolean;
  user?: User;
  token?: string;
  expiresAt?: string;
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

// Checkout API interfaces
export interface CheckoutRequest {
  items: CheckoutItem[];
  appliedPromotion?: string;
  totalPrice?: number;
}

export interface CheckoutItem {
  id: string;
  quantity: number;
  size: string;
  unitPrice: number;
}

export interface CheckoutResponse {
  cart: Cart;
}

// Order History API interfaces
export interface OrderHistoryResponse {
  orders: Cart[];
} 