"use client";
import { useState, useEffect } from 'react';
import { useAuthToken } from '@/hooks/useAuthToken';
import AuthPrompt from '../checkout/AuthPrompt';
import UserInfo from '../components/UserInfo';
import OrderHistory from '../components/OrderHistory';
import { getOrderHistory } from '@/lib/request';

export default function ProfilePage() {
  const { getToken, removeToken, getUser } = useAuthToken();
  const token = getToken();
  const user = getUser(); // Call once per render
  const userId = user?.id;
  const [tab, setTab] = useState<'profile' | 'orders'>('profile');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleLogout() {
    removeToken();
    window.location.reload();
  }

  useEffect(() => {
    async function fetchOrders() {
      if (tab === 'orders' && userId) {
        setLoading(true);
        setError('');
        try {
          const data = await getOrderHistory(userId);
          setOrders(data);
        } catch (err: any) {
          setError(err.message || 'Failed to load order history.');
        } finally {
          setLoading(false);
        }
      }
    }
    fetchOrders();
  }, [tab, userId]); // Only depend on tab and userId

  if (!token) {
    return (
      <div className="max-w-md mx-auto py-20 px-4">
        <h1 className="text-2xl font-bold mb-8">Profile</h1>
        <AuthPrompt />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-20 px-4">
      <h1 className="text-2xl font-bold mb-8">Profile</h1>
      <div className="flex gap-4 mb-8">
        <button
          className={`px-4 py-2 rounded-t font-semibold ${tab === 'profile' ? 'bg-black text-white' : 'bg-gray-200 text-black'}`}
          onClick={() => setTab('profile')}
        >
          Profile Info
        </button>
        <button
          className={`px-4 py-2 rounded-t font-semibold ${tab === 'orders' ? 'bg-black text-white' : 'bg-gray-200 text-black'}`}
          onClick={() => setTab('orders')}
        >
          Order History
        </button>
        <button
          className="ml-auto px-4 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <div className="bg-white border rounded p-6 shadow min-h-[200px]">
        {tab === 'profile' ? (
          <UserInfo />
        ) : (
          <>
            {loading && <div className="text-blue-600 mb-4">Loading order history...</div>}
            {error && <div className="text-red-600 mb-4">{error}</div>}
            {!loading && !error && <OrderHistory orders={orders} />}
          </>
        )}
      </div>
    </div>
  );
} 