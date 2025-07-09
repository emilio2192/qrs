'use client';
import { ReactNode, useRef, useEffect } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { cartSlice, AppStore, setCart } from '../lib/store';
import Cookies from 'js-cookie';

const CART_COOKIE_KEY = 'qrs_cart';

export default function ReduxProvider({ children }: { children: ReactNode }) {
  // Only create the store once per client
  const storeRef = useRef<AppStore | undefined>(undefined);
  if (!storeRef.current) {
    storeRef.current = configureStore({
      reducer: {
        cart: cartSlice.reducer,
      },
    });
  }

  // Hydrate cart from cookies on client-side mount
  useEffect(() => {
    try {
      const cartData = Cookies.get(CART_COOKIE_KEY);
      if (cartData) {
        const items = JSON.parse(cartData);
        storeRef.current?.dispatch(setCart(items));
      }
    } catch (error) {
      console.error('Error loading cart from cookies:', error);
    }
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
} 