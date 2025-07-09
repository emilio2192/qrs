"use client";
import { useAuthToken } from '@/hooks/useAuthToken';
import AuthPrompt from './AuthPrompt';
import { useEffect, useState } from 'react';
import { fetchProduct, createCheckout } from '@/lib/request';
import { calculatePromotion, CartItem as PromoCartItem } from '@/lib/services/promo';
import { Product } from '@/types/api';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import { AppState, clearCart } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { getToken, getUser } = useAuthToken();
  const [isClient, setIsClient] = useState(false);
  const cartItems = useSelector((state: AppState) => state.cart.items);
  const dispatch = useDispatch();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Prevent hydration mismatch by only rendering after client-side mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Only get auth data after client-side mount
  const token = isClient ? getToken() : null;
  const user = isClient ? getUser() : null;

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
          cartItems.map(item => fetchProduct(item.productId))
        );
        setProducts(prods);
      } catch {
        setError('Failed to load product info.');
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [cartItems]);

  // Calculate promotion results for both options
  const promoCartItems: PromoCartItem[] = cartItems.map(item => {
    const product = products.find((p) => p && p.id === item.productId);
    return {
      id: item.productId,
      price: product ? product.price : 0,
      quantity: item.quantity,
      size: item.size,
    };
  });

  const isVIP = user?.userType === 'VIP';

  // Calculate both promotions to determine which is better
  const promoResult3x2 = calculatePromotion(promoCartItems, isVIP, false);
  const promoResultVIP = calculatePromotion(promoCartItems, isVIP, true);

  // Set initial checkbox state based on which promo is better
  const getInitialVipDiscount = () => {
    if (!isVIP) return false;
    // If VIP 15% is better or equal, check by default
    return promoResultVIP.bestTotal <= promoResult3x2.bestTotal;
  };

  const [applyVipDiscount, setApplyVipDiscount] = useState(getInitialVipDiscount());

  // Update checkbox state if cart or products change
  useEffect(() => {
    setApplyVipDiscount(getInitialVipDiscount());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems, products, isVIP]);

  const shouldApplyVipDiscount = isVIP && applyVipDiscount;
  
  // Calculate promotion results - this will re-run when applyVipDiscount changes
  const promotionResult = calculatePromotion(promoCartItems, isVIP, shouldApplyVipDiscount);
  
  // Debug logging
  console.log('Promotion calculation:', {
    isVIP,
    applyVipDiscount,
    shouldApplyVipDiscount,
    cartItemsCount: cartItems.length,
    promotionResult
  });

  async function handleCheckout() {
    if (!user) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const items = cartItems.map(item => {
        const product = products.find((p) => p && p.id === item.productId);
        return {
          id: item.productId,
          quantity: item.quantity,
          size: item.size,
          unitPrice: product ? product.price : 0,
        };
      });
      await createCheckout(user.id, items, {
        appliedPromotion: promotionResult.appliedPromotion,
        totalPrice: promotionResult.bestTotal,
      });
      setSuccess('Checkout successful! Your order has been placed.');
      dispatch(clearCart());
      // Redirect to profile page after successful checkout
      setTimeout(() => {
        router.push('/profile');
      }, 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Checkout failed.');
    } finally {
      setLoading(false);
    }
  }

  // Show loading state during hydration
  if (!isClient) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-8"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
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
                {cartItems.map((item) => {
                  const product = products.find((p) => p && p.id === item.productId);
                  return (
                    <li key={item.productId + item.size} className="py-4 flex items-center gap-4">
                      {product && product.images && product.images[0] && (
                        <Image
                          src={product.images[0].url}
                          alt={product.images[0].alt || product.name}
                          width={64}
                          height={64}
                          className="rounded-md"
                        />
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
              {/* VIP Discount Section */}
              {isVIP && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="vip-discount"
                        checked={applyVipDiscount}
                        onChange={(e) => setApplyVipDiscount(e.target.checked)}
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="vip-discount" className="text-sm font-medium text-gray-700">
                        Apply VIP 15% Discount
                      </label>
                    </div>
                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">VIP ONLY</span>
                  </div>
                  <p className="text-xs text-blue-700">
                    💎 VIP members can choose to apply 15% off at any time. For 3+ items, the best discount is recommended, but you can always toggle between available options.
                  </p>
                </div>
              )}

              {/* Promotion Results */}
              {promotionResult.appliedPromotion !== 'NONE' && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
                  <div className="text-sm text-green-800">
                    <span className="font-semibold">🎉 Promotion Applied:</span> {promotionResult.breakdown}
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="mb-6 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">
                    ${cartItems.reduce((sum, item) => {
                      const product = products.find((p) => p && p.id === item.productId);
                      return sum + (product ? product.price * item.quantity : 0);
                    }, 0).toFixed(2)}
                  </span>
                </div>
                
                {promotionResult.appliedPromotion !== 'NONE' && (
                  <div className="flex justify-between items-center text-green-600">
                    <span>Discount:</span>
                    <span className="font-medium">
                      -${(cartItems.reduce((sum, item) => {
                        const product = products.find((p) => p && p.id === item.productId);
                        return sum + (product ? product.price * item.quantity : 0);
                      }, 0) - promotionResult.bestTotal).toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center border-t pt-2">
                  <span className="font-semibold text-lg">Total:</span>
                  <span className="text-xl font-bold">
                    ${promotionResult.bestTotal.toFixed(2)}
                  </span>
                </div>
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