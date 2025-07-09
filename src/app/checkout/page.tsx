"use client";
import { useAuthToken } from '@/hooks/useAuthToken';
import AuthPrompt from './AuthPrompt';
import { useCart } from '@/hooks/useCart';
import { useEffect, useState } from 'react';
import { fetchProduct, createCheckout } from '@/lib/request';

export default function CheckoutPage() {
  const { getToken, getUser } = useAuthToken();
  const token = getToken();
  const user = getUser();
  const { cartItems, clearCart } = useCart();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Fetch product info for all cart items
  useEffect(() => {
    async function loadProducts() {
      if (cartItems.length === 0) {
        setProducts([]);
        return;
      }
      setLoading(true);
      setError('');
      try {
        const prods = await Promise.all(
          cartItems.map(item => fetchProduct(item.id))
        );
        setProducts(prods);
      } catch (err) {
        setError('Failed to load product info.');
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [cartItems]);

  async function handleCheckout() {
    if (!user) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const items = cartItems.map(item => {
        const product = products.find((p) => p && p.id === item.id);
        return {
          id: item.id,
          quantity: item.quantity,
          size: item.size,
          unitPrice: product ? product.price : 0,
        };
      });
      const cart = await createCheckout(user.id, items);
      setSuccess('Checkout successful! Your order has been placed.');
      clearCart();
    } catch (err: any) {
      setError(err.message || 'Checkout failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-20 px-4">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>
      {!token ? (
        <AuthPrompt />
      ) : (
        <div>
          {loading && <div className="mb-4 text-blue-600">Loading...</div>}
          {error && <div className="mb-4 text-red-600">{error}</div>}
          {success && <div className="mb-4 text-green-600">{success}</div>}
          {cartItems.length === 0 ? (
            <div className="text-gray-500">Your cart is empty.</div>
          ) : (
            <>
              <ul className="mb-6 divide-y divide-gray-200">
                {cartItems.map((item, idx) => {
                  const product = products.find((p) => p && p.id === item.id);
                  return (
                    <li key={item.id + item.size} className="py-4 flex items-center gap-4">
                      {product && product.images && product.images[0] && (
                        <img src={product.images[0].url} alt={product.images[0].alt || product.name} className="w-16 h-16 object-cover rounded" />
                      )}
                      <div className="flex-1">
                        <div className="font-semibold">{product ? product.name : 'Product'}</div>
                        <div className="text-sm text-gray-500">Size: {item.size}</div>
                        <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                      </div>
                      <div className="font-semibold">${product ? (product.price * item.quantity).toFixed(2) : '0.00'}</div>
                    </li>
                  );
                })}
              </ul>
              <div className="flex justify-between items-center mb-6">
                <span className="font-semibold">Total:</span>
                <span className="text-lg font-bold">
                  ${cartItems.reduce((sum, item) => {
                    const product = products.find((p) => p && p.id === item.id);
                    return sum + (product ? product.price * item.quantity : 0);
                  }, 0).toFixed(2)}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded font-semibold disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
} 