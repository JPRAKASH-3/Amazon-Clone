'use client';
import { useCartStore } from '@/store';
import Image from 'next/image';
import Link from 'next/link';
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-8">Add items to get started</p>
        <Link href="/" className="bg-amazon-yellow text-amazon-dark px-8 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
        <hr className="mb-4" />
        {items.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-lg shadow flex gap-4">
            <div className="relative w-32 h-32 flex-shrink-0">
              <Image src={item.image} alt={item.title} fill className="object-contain" />
            </div>
            <div className="flex-1">
              <Link href={`/product/${item.id}`} className="font-semibold hover:text-amazon-orange transition line-clamp-2">
                {item.title}
              </Link>
              <p className="text-lg font-bold text-red-600 mt-2">${item.price.toFixed(2)}</p>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center border rounded">
                  <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="px-3 py-1 hover:bg-gray-100">
                    <FiMinus />
                  </button>
                  <span className="px-4 py-1 font-semibold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 hover:bg-gray-100">
                    <FiPlus />
                  </button>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 flex items-center gap-1">
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        <button onClick={clearCart} className="text-red-500 hover:text-red-700 text-sm mt-4">
          Clear Cart
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow h-fit sticky top-20">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span>Items ({items.reduce((s, i) => s + i.quantity, 0)}):</span><span>${total().toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Shipping:</span><span className="text-green-600">Free</span></div>
          <hr />
          <div className="flex justify-between text-lg font-bold"><span>Total:</span><span className="text-red-600">${total().toFixed(2)}</span></div>
        </div>
        <Link href="/checkout" className="block w-full mt-6 bg-amazon-yellow text-amazon-dark py-3 rounded-lg font-semibold text-center hover:bg-yellow-500 transition">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
