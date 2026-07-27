'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import type { Product } from '@/types';
import { useCartStore } from '@/store';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { FiStar, FiStarHalf, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();

  useEffect(() => {
    api.get(`/api/products/${id}`).then((res) => setProduct(res.data)).catch(() => {
      setProduct({
        id: id as string, title: 'Wireless Bluetooth Headphones', price: 29.99,
        description: 'Premium wireless headphones with noise cancellation. Features include 30-hour battery life, comfortable over-ear design, and crystal-clear audio quality. Compatible with all Bluetooth devices.',
        category: 'Electronics', image: 'https://via.placeholder.com/500',
        rating: { rate: 4.5, count: 120 }
      });
    });
  }, [id]);

  if (!product) return <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse"><div className="h-96 bg-gray-200 rounded" /></div>;

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(`Added ${quantity} item(s) to cart!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-lg shadow-md">
        <div className="relative h-96">
          <Image src={product.image} alt={product.title} fill className="object-contain" />
        </div>
        <div>
          <h1 className="text-2xl font-bold mb-4">{product.title}</h1>
          <div className="flex items-center gap-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <FiStar key={i} className={i < Math.floor(product.rating.rate) ? 'text-amazon-yellow fill-amazon-yellow' : 'text-gray-300'} />
            ))}
            <span className="text-sm text-gray-500">{product.rating.count} ratings</span>
          </div>
          <hr className="my-4" />
          <p className="text-3xl font-bold text-red-600 mb-4">${product.price.toFixed(2)}</p>
          <p className="text-gray-600 mb-6">{product.description}</p>
          <div className="flex items-center gap-4 mb-6">
            <label className="font-semibold">Quantity:</label>
            <select value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="border rounded px-3 py-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-4 mb-6">
            <button onClick={handleAddToCart} className="flex-1 bg-amazon-yellow text-amazon-dark py-3 rounded-lg font-semibold hover:bg-yellow-500 transition">
              Add to Cart
            </button>
            <button onClick={handleAddToCart} className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition">
              Buy Now
            </button>
          </div>
          <div className="border-t pt-4 space-y-3 text-sm text-gray-600">
            <div className="flex items-center gap-2"><FiTruck /> Free delivery on orders over $25</div>
            <div className="flex items-center gap-2"><FiShield /> 2-year warranty included</div>
            <div className="flex items-center gap-2"><FiRefreshCw /> 30-day return policy</div>
          </div>
        </div>
      </div>
    </div>
  );
}
