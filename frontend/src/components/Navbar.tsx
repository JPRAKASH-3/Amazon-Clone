'use client';
import Link from 'next/link';
import { useCartStore, useAuthStore } from '@/store';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX } from 'react-icons/fi';

export default function Navbar() {
  const { count } = useCartStore();
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.push(`/search?q=${encodeURIComponent(search)}`);
  };

  return (
    <nav className="bg-amazon-dark text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-4">
        <Link href="/" className="text-2xl font-bold text-white hover:text-amazon-orange transition">
          amazon<span className="text-amazon-orange">.clone</span>
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden md:flex">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="flex-1 px-4 py-2 text-black rounded-l-md focus:outline-none"
          />
          <button type="submit" className="bg-amazon-yellow px-4 rounded-r-md hover:bg-yellow-500 transition">
            <FiSearch className="text-amazon-dark text-xl" />
          </button>
        </form>

        <div className="hidden md:flex items-center gap-6 text-sm">
          {user ? (
            <>
              <span className="text-gray-300">Hello, {user.name}</span>
              <button onClick={() => logout()} className="hover:text-amazon-orange transition">
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/auth/login" className="hover:text-amazon-orange transition">
              Sign In
            </Link>
          )}
          <Link href="/orders" className="hover:text-amazon-orange transition">
            Orders
          </Link>
          <Link href="/cart" className="flex items-center gap-1 hover:text-amazon-orange transition relative">
            <FiShoppingCart className="text-xl" />
            <span className="absolute -top-2 -right-2 bg-amazon-orange text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {count()}
            </span>
          </Link>
        </div>

        <button className="md:hidden text-xl" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-amazon-light px-4 py-4 flex flex-col gap-4">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="flex-1 px-4 py-2 text-black rounded-l-md"
            />
            <button type="submit" className="bg-amazon-yellow px-4 rounded-r-md">
              <FiSearch className="text-amazon-dark" />
            </button>
          </form>
          {user ? (
            <>
              <span>Hello, {user.name}</span>
              <button onClick={() => { logout(); setMenuOpen(false); }}>Sign Out</button>
            </>
          ) : (
            <Link href="/auth/login" onClick={() => setMenuOpen(false)}>Sign In</Link>
          )}
          <Link href="/cart" onClick={() => setMenuOpen(false)}>Cart ({count()})</Link>
        </div>
      )}
    </nav>
  );
}
