'use client';

import { useState, useEffect, useCallback } from 'react';

interface CartItem {
  id: string;
  quantity: number;
  size: string;
}

const CART_STORAGE_KEY = 'qrs_cart';

// Singleton cart manager
class CartManager {
  private static instance: CartManager;
  private listeners: Set<(items: CartItem[]) => void> = new Set();
  private items: CartItem[] = [];
  private initialized = false;

  private constructor() {
    // Don't load from storage during SSR
    if (typeof window !== 'undefined') {
      this.loadFromStorage();
      this.initialized = true;
    }
  }

  static getInstance(): CartManager {
    if (!CartManager.instance) {
      CartManager.instance = new CartManager();
    }
    return CartManager.instance;
  }

  private loadFromStorage(): void {
    try {
      if (typeof window !== 'undefined') {
        const stored = sessionStorage.getItem(CART_STORAGE_KEY);
        if (stored) {
          this.items = JSON.parse(stored);
        }
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      this.items = [];
    }
  }

  private saveToStorage(): void {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.items));
      }
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener([...this.items]));
  }

  subscribe(listener: (items: CartItem[]) => void): () => void {
    this.listeners.add(listener);
    
    // Only call listener immediately if we're in the browser and initialized
    if (typeof window !== 'undefined' && this.initialized) {
      listener([...this.items]);
    } else {
      // During SSR, call with empty array to prevent hydration mismatch
      listener([]);
    }
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  addItem(id: string, quantity: number = 1, size: string): void {
    const existingItemIndex = this.items.findIndex(
      item => item.id === id && item.size === size
    );

    if (existingItemIndex >= 0) {
      // Update existing item quantity
      this.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      this.items.push({ id, quantity, size });
    }

    this.saveToStorage();
    this.notifyListeners();
  }

  updateItemQuantity(id: string, quantity: number, size: string): void {
    const itemIndex = this.items.findIndex(
      item => item.id === id && item.size === size
    );

    if (itemIndex >= 0) {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        this.items.splice(itemIndex, 1);
      } else {
        // Update quantity
        this.items[itemIndex].quantity = quantity;
      }

      this.saveToStorage();
      this.notifyListeners();
    }
  }

  removeItem(id: string, size: string): void {
    this.items = this.items.filter(item => !(item.id === id && item.size === size));
    this.saveToStorage();
    this.notifyListeners();
  }

  clearCart(): void {
    this.items = [];
    this.saveToStorage();
    this.notifyListeners();
  }

  getItemQuantity(id: string, size: string): number {
    const item = this.items.find(item => item.id === id && item.size === size);
    return item?.quantity || 0;
  }

  getTotalItems(): number {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  getItems(): CartItem[] {
    return [...this.items];
  }

  getItemByProductId(id: string): CartItem[] {
    return this.items.filter(item => item.id === id);
  }
}

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartLoaded, setCartLoaded] = useState(false);
  const cartManager = CartManager.getInstance();

  useEffect(() => {
    // Subscribe to cart changes
    const unsubscribe = cartManager.subscribe((items) => {
      setCartItems(items);
      setCartLoaded(true);
    });
    
    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  const addItem = useCallback((id: string, quantity: number = 1, size: string) => {
    cartManager.addItem(id, quantity, size);
  }, []);

  const updateItemQuantity = useCallback((id: string, quantity: number, size: string) => {
    cartManager.updateItemQuantity(id, quantity, size);
  }, []);

  const removeItem = useCallback((id: string, size: string) => {
    cartManager.removeItem(id, size);
  }, []);

  const clearCart = useCallback(() => {
    cartManager.clearCart();
  }, []);

  const getItemQuantity = useCallback((id: string, size: string): number => {
    return cartManager.getItemQuantity(id, size);
  }, []);

  const getTotalItems = useCallback((): number => {
    return cartManager.getTotalItems();
  }, []);

  const getItemByProductId = useCallback((id: string): CartItem[] => {
    return cartManager.getItemByProductId(id);
  }, []);

  return {
    cartItems,
    cartLoaded,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart,
    getItemQuantity,
    getTotalItems,
    getItemByProductId,
  };
} 