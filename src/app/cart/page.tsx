"use client";
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchProduct } from '../../lib/request';
import { Product } from '../../types/api';

export default function CartPage() {
  const { cartItems, cartLoaded, updateItemQuantity, removeItem, clearCart } = useCart();
  
  const [products, setProducts] = useState<Record<string, Product>>({});
  const router = useRouter();

  // Redirect to home if cart is loaded and empty
  useEffect(() => {
    if (cartLoaded && cartItems.length === 0) {
      router.replace('/');
    }
  }, [cartLoaded, cartItems, router]);

  // Fetch product details for all items in the cart
  useEffect(() => {
    async function fetchAllProducts() {
      const uniqueIds = Array.from(new Set(cartItems.map(item => item.id)));
      const productMap: Record<string, Product> = {};
      await Promise.all(
        uniqueIds.map(async (id) => {
          const product = await fetchProduct(id);
          if (product) productMap[id] = product;
        })
      );
      setProducts(productMap);
    }
    if (cartItems.length > 0) fetchAllProducts();
    else setProducts({});
  }, [cartItems]);

  // Calculate total
  const total = cartItems.reduce((sum, item) => {
    const product = products[item.id];
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  // No need to render empty cart message, redirect will handle it

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 mt-20">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      <div className="divide-y divide-gray-200">
        {cartItems.map((item) => {
          const product = products[item.id];
          if (!product) return null;
          return (
            <div key={`${item.id}-${item.size}`} className="flex items-center justify-between py-4 gap-4">
              <div className="flex-1">
                <div className="font-medium">{product.name}</div>
                <div className="text-sm text-gray-500">Size: {item.size}</div>
                <div className="text-sm text-gray-500">Price: ${product.price.toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="px-2 py-1 rounded border border-gray-300 bg-white text-lg font-bold hover:bg-gray-100"
                  onClick={() => updateItemQuantity(item.id, Math.max(1, item.quantity - 1), item.size)}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  className="px-2 py-1 rounded border border-gray-300 bg-white text-lg font-bold hover:bg-gray-100"
                  onClick={() => updateItemQuantity(item.id, item.quantity + 1, item.size)}
                >
                  +
                </button>
              </div>
              <div className="w-24 text-right">${(product.price * item.quantity).toLocaleString()}</div>
              <button
                className="ml-2 text-red-500 hover:underline text-sm"
                onClick={() => removeItem(item.id, item.size)}
                aria-label="Remove item"
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between items-center mt-8 border-t pt-6">
        <div className="text-lg font-bold">Total:</div>
        <div className="text-xl font-bold">${total.toLocaleString()}</div>
      </div>
      <Link href="/checkout">
        <button className="w-full mt-6 bg-black text-white py-3 rounded font-semibold text-lg hover:bg-gray-900 transition">Go to Checkout</button>
      </Link>
      <button className="w-full mt-2 text-gray-500 hover:underline text-sm" onClick={clearCart}>Clear Cart</button>
    </div>
  );
} 