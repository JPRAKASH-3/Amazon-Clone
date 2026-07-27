'use client';
import { useState } from 'react';
import { useCartStore, useAuthStore } from '@/store';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const [address, setAddress] = useState({ street: '', city: '', zip: '', country: '' });
  const [loading, setLoading] = useState(false);

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error('Please sign in first'); router.push('/auth/login'); return; }
    setLoading(true);
    try {
      await api.post('/api/orders', {
        items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
        address: `${address.street}, ${address.city}, ${address.zip}, ${address.country}`,
        total: total(),
      });
      clearCart();
      toast.success('Order placed!');
      router.push('/orders');
    } catch {
      toast.error('Order failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Shipping Address</h1>
        <form onSubmit={handleOrder} className="space-y-4">
          <input type="text" placeholder="Street Address" required value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-amazon-yellow focus:outline-none" />
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="City" required value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-amazon-yellow focus:outline-none" />
            <input type="text" placeholder="ZIP Code" required value={address.zip}
              onChange={(e) => setAddress({ ...address, zip: e.target.value })}
              className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-amazon-yellow focus:outline-none" />
          </div>
          <input type="text" placeholder="Country" required value={address.country}
            onChange={(e) => setAddress({ ...address, country: e.target.value })}
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-amazon-yellow focus:outline-none" />
          <button type="submit" disabled={loading}
            className="w-full bg-amazon-yellow text-amazon-dark py-3 rounded-lg font-semibold hover:bg-yellow-500 transition disabled:opacity-50">
            {loading ? 'Placing Order...' : `Place Order - $${total().toFixed(2)}`}
          </button>
        </form>
      </div>
      <div className="bg-white p-8 rounded-lg shadow h-fit">
        <h2 className="text-xl font-bold mb-4">Order Items</h2>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center border-b pb-4">
              <div>
                <p className="font-medium line-clamp-1">{item.title}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div className="border-t mt-4 pt-4">
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-red-600">${total().toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
