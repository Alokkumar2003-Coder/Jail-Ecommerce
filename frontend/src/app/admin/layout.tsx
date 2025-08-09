'use client';

import { useAppSelector } from '../../redux/hooks';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { Menu, X } from 'lucide-react'; // Icons for mobile toggle

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.replace('/login');
    }
  }, [user, router]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  const navLinks = [
    { href: '/admin/carousel', label: 'Carousel' },
    { href: '/admin/products', label: 'Products' },
    { href: '/admin/categories', label: 'Categories' },
    { href: '/admin/orders', label: 'Orders' },
    { href: '/admin/users', label: 'Users' },
    { href: '/admin/analytics', label: 'Analytics' },
    { href: '/admin/blogs', label: 'Blog' },
    { href: '/admin/news', label: 'News' },
    { href: '/', label: 'Back to Store' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center p-4 bg-gray-800 text-white">
        <h1 className="text-lg font-semibold">Admin Panel</h1>
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <nav
  className={clsx(
    'bg-white shadow-lg p-6 md:block',
    'md:w-60 w-64', // same width mobile & desktop
    'fixed md:static top-0 left-0 h-full z-50', // full height on mobile
    'transform transition-transform duration-200 ease-in-out',
    menuOpen ? 'translate-x-0' : '-translate-x-full' // hide left when closed
  )}
>
        <div className="flex flex-col items-center space-y-6 mt-6">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)} // close menu on mobile after click
              className={clsx(
                'px-4 py-2 rounded text-black transition-colors w-full text-center',
                pathname === href
                  ? 'bg-gray-800 text-white font-semibold'
                  : 'hover:bg-gray-100'
              )}
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Overlay for mobile */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <main className="w-full p-4">{children}</main>
    </div>
  );
}
