'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { logout } from '../redux/authSlice';
import {
  FiMenu, FiSearch, FiUser, FiShoppingCart, FiX, FiHeart, FiSettings, FiPackage,
} from 'react-icons/fi';
import { usePathname } from 'next/navigation';
import OrderTracking from './OrderTracking';
import api from '../utils/axios';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showOrderTracking, setShowOrderTracking] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.cart);
  const { productIds } = useAppSelector((state) => state.wishlist);
  const pathname = usePathname();

  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([]);

  useEffect(() => {
    api.get('/categories')
      .then(res => setCategories(res.data || []))
      .catch(() => setCategories([]));
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { href: '/clothing', label: 'Clothing' },
    { href: '/travel', label: 'Travel' },
    { href: '/bag', label: 'Bag' },
    { href: '/purse', label: 'Purse' },
    { href: '/men', label: 'Men' },
    { href: '/women', label: 'Women' },
  ];

  return (
    <nav className="bg-white relative z-50 px-4" role="navigation">
      {/* Mobile Navbar */}
      <div className="flex justify-between items-center px-4 py-4 md:hidden">
        <div className="flex items-center space-x-4">
          <button onClick={toggleMobileMenu} aria-label="Open menu">
            <FiMenu size={22} className="text-black" />
          </button>
        </div>

        <Link href="/" className="text-2xl font-bold tracking-widest text-black">JAIL</Link>

        <div className="flex items-center space-x-4">
          
          <Link href="/orders" aria-label="My Orders">
                    <FiPackage size={18} />
                  </Link>
          <Link href={user ? '/profile' : '/login'} aria-label="User profile">
            <FiUser size={22} className="text-black" />
          </Link>
          <Link href="/cart" className="relative" aria-label="Cart">
            <FiShoppingCart size={22} className="text-black" />
            {items.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {items.length}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Menu Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={toggleMobileMenu}></div>

          <div className="absolute top-0 left-0 w-64 h-full bg-white shadow-xl">
            <div className="flex justify-end p-4">
              <button onClick={toggleMobileMenu} aria-label="Close menu">
                <FiX size={28} className="text-black" />
              </button>
            </div>

            <div className="flex flex-col space-y-6 p-4 text-md text-black">
              <Link href="/products" onClick={toggleMobileMenu}>Products</Link>
              <Link href="/blog" onClick={toggleMobileMenu}>Blog</Link>
              <Link href="/cart" onClick={toggleMobileMenu}>Cart</Link>
              <button
                onClick={() => {
                  setShowOrderTracking(true);
                  toggleMobileMenu();
                }}
                className="text-left flex items-center gap-2"
              >
                <FiPackage size={20} /> Track Order
              </button>

             {/* Categories Section - mobile */}
             <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Categories</h3>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.id}`}
                    onClick={toggleMobileMenu}
                    className={`block py-2 pl-4 ${pathname === `/categories/${cat.id}` ? 'text-blue-500 font-bold' : 'text-gray-700'}`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>

              <Link href="/about" onClick={toggleMobileMenu}>About Us</Link>

              {user ? (
                <>
                  <Link href="/wishlist" onClick={toggleMobileMenu} className="flex items-center gap-2">
                    <FiHeart size={20} /> Wishlist
                  </Link>
                  <Link href="/orders" onClick={toggleMobileMenu} className="flex items-center gap-2">
                    <FiPackage size={20} /> My Orders
                  </Link>
                  <Link href="/profile" onClick={toggleMobileMenu} className="flex items-center gap-2">
                    <FiUser size={20} /> Account
                  </Link>
                  {user?.role === 'admin' && (
                    <Link href="/admin" onClick={toggleMobileMenu} className="flex items-center gap-2">
                      <FiSettings size={20} /> Admin
                    </Link>
                  )}
                </>
              ) : (
                <Link href="/login" onClick={toggleMobileMenu}>Login</Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Navbar */}
      <div className="hidden md:block w-full border-b border-gray-200">
        <div className="bg-white ">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-4xl relative top-4 font-bold text-gray-900">JAIL</Link>

            <div className="flex items-center gap-6 text-md ">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.id}`}
                  className={`hover:text-gray-900 transition-colors duration-200 ${pathname === `/categories/${cat.id}` ? 'text-blue-500 ' : ''}`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4 text-black">
              <Link href="/about" className="text-sm font-medium hover:text-gray-900">About Us</Link>

              <Link href="/wishlist" className="relative" aria-label="Wishlist">
                <FiHeart size={18} />
                {productIds.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {productIds.length}
                  </span>
                )}
              </Link>

              

              <Link href="/cart" className="relative" aria-label="Cart">
                <FiShoppingCart size={18} />
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </Link>

              {user ? (
                <>
                  <Link href="/orders" aria-label="My Orders">
                    <FiPackage size={18} />
                  </Link>
                  <Link href="/profile" aria-label="Account">
                    <FiUser size={18} />
                  </Link>
                  {user?.role === 'admin' && (
                    <Link href="/admin" aria-label="Admin Dashboard">
                      <FiSettings size={18} />
                    </Link>
                  )}
                </>
              ) : (
                <Link href="/login" aria-label="Login">
                  <FiUser size={18} />
                </Link>
              )}
            </div>
          </div>

          <div className="flex justify-center py-2">
            <p className="text-sm text-gray-500">Get discount on sling bags</p>
          </div>
        </div>
      </div>

      {/* Order Tracking Modal */}
      {/* {showOrderTracking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <OrderTracking onClose={() => setShowOrderTracking(false)} />
        </div>
      )} */}
    </nav>
  );
}