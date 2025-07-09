'use client';
import { ReactNode, useRef } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { cartSlice, AppStore } from '../lib/store';

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
  return <Provider store={storeRef.current}>{children}</Provider>;
} 