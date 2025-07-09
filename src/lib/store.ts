import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '../types/api';
import Cookies from 'js-cookie';
import type { AnyAction } from 'redux';

export interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const CART_COOKIE_KEY = 'qrs_cart';

const saveCartToCookies = (items: CartItem[]) => {
  if (typeof window !== 'undefined') {
    Cookies.set(CART_COOKIE_KEY, JSON.stringify(items), { expires: 7 });
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart(state: CartState, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
      saveCartToCookies(state.items);
    },
    addItem(state: CartState, action: PayloadAction<CartItem>) {
      const existing = state.items.find(
        (item: CartItem) => item.productId === action.payload.productId && item.size === action.payload.size
      );
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      saveCartToCookies(state.items);
    },
    updateItemQuantity(state: CartState, action: PayloadAction<{ productId: string; size: string; quantity: number }>) {
      const item = state.items.find(
        (i: CartItem) => i.productId === action.payload.productId && i.size === action.payload.size
      );
      if (item) {
        item.quantity = action.payload.quantity;
        if (item.quantity <= 0) {
          state.items = state.items.filter(
            (i: CartItem) => !(i.productId === action.payload.productId && i.size === action.payload.size)
          );
        }
      }
      saveCartToCookies(state.items);
    },
    removeItem(state: CartState, action: PayloadAction<{ productId: string; size: string }>) {
      state.items = state.items.filter(
        (i: CartItem) => !(i.productId === action.payload.productId && i.size === action.payload.size)
      );
      saveCartToCookies(state.items);
    },
    clearCart(state: CartState) {
      state.items = [];
      saveCartToCookies(state.items);
    },
  },
  extraReducers: (builder) => {
    builder.addCase('HYDRATE', (state: CartState, action: AnyAction) => {
      if (action.payload && action.payload.cart) {
        state.items = action.payload.cart.items;
      }
    });
  },
});

export const { setCart, addItem, updateItemQuantity, removeItem, clearCart } = cartSlice.actions;

export { cartSlice };

const makeStore = () =>
  configureStore({
    reducer: {
      cart: cartSlice.reducer,
    },
  });

export { makeStore };

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch']; 