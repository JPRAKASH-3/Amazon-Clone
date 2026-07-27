'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import type { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import Image from 'next/image';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/products').then((res) => {
      setProducts(res.data);
      setLoading(false);
    }).catch(() => {
      setProducts([
        { id: '1', title: 'Wireless Bluetooth Headphones', price: 29.99, description: 'Premium sound quality', category: 'Electronics', image: 'https://via.placeholder.com/300', rating: { rate: 4.5, count: 120 } },
        { id: '2', title: 'Mechanical Gaming Keyboard', price: 59.99, description: 'RGB backlit keys', category: 'Electronics', image: 'https://via.placeholder.com/300', rating: { rate: 4.2, count: 85 } },
        { id: '3', title: 'Ergonomic Office Chair', price: 199.99, description: 'Lumbar support', category: 'Furniture', image: 'https://via.placeholder.com/300', rating: { rate: 4.7, count: 200 } },
        { id: '4', title: 'Stainless Steel Water Bottle', price: 14.99, description: 'Double wall insulated', category: 'Kitchen', image: 'https://via.placeholder.com/300', rating: { rate: 4.3, count: 310 } },
        { id: '5', title: 'Running Shoes Pro', price: 89.99, description: 'Lightweight and comfortable', category: 'Sports', image: 'https://via.placeholder.com/300', rating: { rate: 4.6, count: 150 } },
        { id: '6', title: 'LED Desk Lamp', price: 34.99, description: 'Adjustable brightness', category: 'Home', image: 'https://via.placeholder.com/300', rating: { rate: 4.1, count: 90 } },
        { id: '7', title: 'Portable Power Bank', price: 24.99, description: '20000mAh fast charging', category: 'Electronics', image: 'https://via.placeholder.com/300', rating: { rate: 4.4, count: 220 } },
        { id: '8', title: 'Yoga Mat Premium', price: 39.99, description: 'Non-slip surface', category: 'Sports', image: 'https://via.placeholder.com/300', rating: { rate: 4.8, count: 175 } },
      ]);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <div className="relative h-80 bg-gradient-to-r from-amazon-dark to-amazon-light flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl font-bold mb-4">Shop the Latest Deals</h1>
          <p className="text-gray-300 mb-6">Discover amazing products at unbeatable prices</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                <div className="h-48 bg-gray-200 rounded mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
