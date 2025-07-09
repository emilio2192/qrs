'use client';
import { useState } from 'react';

type Product = {
  id: string;
  name: string;
  price: number;
  // ...other fields
};

type OrderItem = {
  productId: string;
  quantity: number;
  size: string;
  unitPrice: number;
  product: Product;
};

type Order = {
  id: string;
  createdAt: string;
  items: OrderItem[];
  appliedPromotion?: string | null;
  totalPrice?: number;
};

type OrderHistoryProps = {
  orders: Order[];
};

export default function OrderHistory({ orders }: OrderHistoryProps) {
  const [openOrderId, setOpenOrderId] = useState<string | null>(null);

  if (!orders || orders.length === 0) {
    return <div className="text-gray-500 text-center py-8">No orders found.</div>;
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const originalTotal = order.items.reduce((sum, item) => sum + Number(item.unitPrice) * item.quantity, 0);
        const finalTotal = order.totalPrice != null ? Number(order.totalPrice) : originalTotal;
        const discount = originalTotal - finalTotal;
        const isOpen = openOrderId === order.id;
        return (
          <div key={order.id} className="border rounded shadow-sm bg-white">
            <button
              className="w-full flex justify-between items-center px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-black"
              onClick={() => setOpenOrderId(isOpen ? null : order.id)}
              aria-expanded={isOpen}
            >
              <span className="font-semibold text-black">#Order {order.id}</span>
              <span className="text-gray-500 text-sm">{new Date(order.createdAt).toLocaleString()}</span>
              <span className="font-bold text-green-700">${finalTotal.toFixed(2)}</span>
              <span className="ml-2 text-xs text-gray-400">{isOpen ? '▲' : '▼'}</span>
            </button>
            {isOpen && (
              <div className="px-4 pb-4">
                {order.appliedPromotion && (
                  <div className="mb-2 text-sm text-blue-700">
                    <span className="font-semibold">Promotion:</span> {order.appliedPromotion.replace('_', ' ')}
                  </div>
                )}
                <table className="w-full text-sm mt-2 border-separate border-spacing-0">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left py-2 px-2 font-semibold text-gray-700">Product</th>
                      <th className="text-center py-2 px-2 font-semibold text-gray-700">Size</th>
                      <th className="text-right py-2 px-2 font-semibold text-gray-700">Unit Price</th>
                      <th className="text-center py-2 px-2 font-semibold text-gray-700">Qty</th>
                      <th className="text-right py-2 px-2 font-semibold text-gray-700">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, idx) => (
                      <tr
                        key={item.productId + item.size}
                        className={
                          `border-b last:border-0 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors`
                        }
                      >
                        <td className="py-2 px-2 text-left align-middle">{item.product?.name || 'Product'}</td>
                        <td className="py-2 px-2 text-center align-middle">{item.size}</td>
                        <td className="py-2 px-2 text-right align-middle">${Number(item.unitPrice).toFixed(2)}</td>
                        <td className="py-2 px-2 text-center align-middle">{item.quantity}</td>
                        <td className="py-2 px-2 text-right align-middle">${(Number(item.unitPrice) * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex flex-col items-end mt-4 space-y-1">
                  <div className="text-gray-600">Original Total: <span className="font-medium">${originalTotal.toFixed(2)}</span></div>
                  <div className="text-green-700">Discount: <span className="font-medium">-${discount.toFixed(2)}</span></div>
                  <div className="text-lg font-bold">Final Total: ${finalTotal.toFixed(2)}</div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
} 