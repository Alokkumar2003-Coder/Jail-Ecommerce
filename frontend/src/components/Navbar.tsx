'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { logout } from '../redux/authSlice';
import { FiMenu, FiSearch, FiUser, FiShoppingCart, FiX, FiHeart, FiSettings } from 'react-icons/fi';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.cart);
  const { productIds } = useAppSelector((state) => state.wishlist);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    setIsMobileMenuOpen(false); 
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white font-serif relative z-50">
      {/* Mobile Navbar */}
      <div className="flex justify-between items-center px-4 py-4 md:hidden">
        <div className="flex items-center space-x-4">
          <button onClick={toggleMobileMenu}>
            <FiMenu size={22} className="text-black" />
          </button>
          <Link href="/search">
            <FiSearch size={22} className="text-black" />
          </Link>
        </div>

        {/* Center: Logo */}
        <Link href="/" className="flex items-center">
          <div className="px-2 py-1 rounded-full">
            <span className="text-2xl text-center font-bold tracking-widest text-black">JAIL</span>
          </div>
        </Link>

        {/* Profile and Cart */}
        <div className="flex items-center space-x-4">
          <Link href={user ? "/account" : "/login"}>
            <FiUser size={22} className="text-black" />
          </Link>
          <Link href="/cart" className="relative">
            <FiShoppingCart size={22} className="text-black" />
            {items.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {items.length}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Menu  */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg- bg-opacity-50" onClick={toggleMobileMenu}></div>
          

          <div className="absolute top-0 left-0 w-64 h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="flex justify-end p-4">
              <button onClick={toggleMobileMenu}>
                <FiX size={28} className="text-black" />
              </button>
            </div>

          <div className="flex items-center space-x-4">
            <Link href="/products" className="text-gray-700 hover:text-gray-900">
              Products
            </Link>
            
            <Link href="/blog" className="text-gray-700 hover:text-gray-900">
              Blog
            </Link>
            
            <Link href="/cart" className="text-gray-700 hover:text-gray-900 relative">
              Cart
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Link>

            
            <div className="flex flex-col space-y-8 mt-4 p-4 text-xl font-semibold text-black">
              <Link href="/clothing" onClick={toggleMobileMenu} className="hover:text-gray-900 transition-colors duration-200">Clothing</Link>
              <Link href="/travel" onClick={toggleMobileMenu} className="hover:text-gray-900 transition-colors duration-200">Travel</Link>
              <Link href="/bag" onClick={toggleMobileMenu} className="hover:text-gray-900 transition-colors duration-200">Bag</Link>
              <Link href="/purse" onClick={toggleMobileMenu} className="hover:text-gray-900 transition-colors duration-200">Purse</Link>
              <Link href="/men" onClick={toggleMobileMenu} className="hover:text-gray-900 transition-colors duration-200">Men</Link>
              <Link href="/women" onClick={toggleMobileMenu} className="hover:text-gray-900 transition-colors duration-200">Women</Link>
              <Link href="/about" onClick={toggleMobileMenu} className="hover:text-gray-900 transition-colors duration-200">About Us</Link>
              
              {user ? (
                <>
                  <Link href="/wishlist" onClick={toggleMobileMenu} className="hover:text-gray-900 transition-colors duration-200 flex items-center space-x-2">
                    <FiHeart size={22} /><span>Wishlist</span>
                  </Link>
                  <Link href="/account" onClick={toggleMobileMenu} className="hover:text-gray-900 transition-colors duration-200 flex items-center space-x-2">
                    <FiUser size={22} /><span>Account</span>
                  </Link>
                  {user.role === 'admin' && (
                    <Link href="/admin" onClick={toggleMobileMenu} className="hover:text-gray-900 transition-colors duration-200 flex items-center space-x-2">
                      <FiSettings size={22} /><span>Admin</span>
                    </Link>
                  )}
                  <button onClick={handleLogout} className="hover:text-gray-900 transition-colors duration-200 text-left">Logout</button>
                </>
              ) : (
                <Link href="/login" onClick={toggleMobileMenu} className="hover:text-gray-900 transition-colors duration-200">Login</Link>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Desktop Navbar */}
      <div className="hidden md:block">
        <div className="bg-white mx-auto px-12 lg:px-24">
          <div className="flex justify-between items-center h-15">
            <div className="flex items-center mt-8">
              <Link href="/" className="flex items-center -mx-8">
                <span className="text-4xl font-bold text-gray-900">JAIL</span>
              </Link>
            </div>
            <div className="hidden lg:flex items-center space-x-4 text-lg font-semibold text-black">
              <Link href="/clothing" className="hover:text-gray-900 transition-colors duration-200">Clothing</Link>
              <Link href="/travel" className="hover:text-gray-900 transition-colors duration-200">Travel</Link>
              <Link href="/bag" className="hover:text-gray-900 transition-colors duration-200">Bag</Link>
              <Link href="/purse" className="hover:text-gray-900 transition-colors duration-200">Purse</Link>
              <Link href="/men" className="hover:text-gray-900 transition-colors duration-200">Men</Link>
              <Link href="/women" className="hover:text-gray-900 transition-colors duration-200">Women</Link>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <Link href="/about" className="-mx-14 mt-8 text-lg font-bold text-black hover:text-gray-900 transition-colors duration-200">
                About Us
              </Link>
              <div className="flex items-center space-x-6 text-black mt-6 -mx-15">
                {user ? (
                  <div className="flex items-center space-x-6">
                    {user.role === 'admin' && (
                      <Link href="/admin">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 hover:text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                    )}
                    <Link href="/account">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 hover:text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </Link>
                    <button onClick={handleLogout}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 hover:text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <Link href="/login">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 hover:text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </Link>
                )}
                <Link href="/search">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 hover:text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </Link>

                <Link href="/wishlist" className="relative">
                  <svg xmlns="" className="h-6 w-6 hover:text-gray-900" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {productIds.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {productIds.length}
                    </span>
                  )}

                <Link href="/profile" className="text-gray-700 hover:text-gray-900">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-gray-900"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-gray-700 hover:text-gray-900">
                  Login

                </Link>
                <Link href="/cart" className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 hover:text-gray-900" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {items.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {items.length}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center py-2">
            <p className="text-sm text-gray-500">Get discount on sling bags</p>
          </div>
          <hr className="w-full border-t border-gray-200" />
        </div>
      </div>
    </nav>
  );
}
