'use client';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types';
import { useCartStore } from '@/store';
import toast from 'react-hot-toast';
import { FiStar } from 'react-icons/fi';
import { FaStarHalfAlt } from 'react-icons/fa';

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    addItem(product);
    toast.success('Added to cart!');
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<FiStar key={i} className="text-amazon-yellow fill-amazon-yellow" />);
      } else if (i - 0.5 <= rating) {
        stars.push(<FaStarHalfAlt key={i} className="text-amazon-yellow fill-amazon-yellow" />);
      } else {
        stars.push(<FiStar key={i} className="text-gray-400" />);
      }
    }
    return stars;
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-4 flex flex-col">
      <Link href={`/product/${product.id}`}>
        <div className="relative h-48 mb-4">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain"
          />
        </div>
      </Link>
      <Link href={`/product/${product.id}`}>
        <h3 className="text-sm font-medium hover:text-amazon-orange transition line-clamp-2 mb-2">
          {product.title}
        </h3>
      </Link>
      <div className="flex items-center gap-1 mb-2">
        {renderStars(product.rating.rate)}
        <span className="text-xs text-gray-500">({product.rating.count})</span>
      </div>
      <p className="text-lg font-bold mb-4">${product.price.toFixed(2)}</p>
      <button
        onClick={handleAddToCart}
        className="mt-auto w-full bg-amazon-yellow text-amazon-dark py-2 rounded-lg font-semibold hover:bg-yellow-500 transition"
      >
        Add to Cart
      </button>
    </div>
  );
}
