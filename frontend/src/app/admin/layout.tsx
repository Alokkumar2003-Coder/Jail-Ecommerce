'use client';

import { useAppSelector } from '../../redux/hooks';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import clsx from 'clsx'; // Optional for cleaner className

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.replace('/login');
    }
  }, [user, router]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  const navLinks = [
    // { href: '/admin', label: 'Admin' },
    { href: '/admin/products', label: 'Products' },
    { href: '/admin/categories', label: 'Categories' },
    { href: '/admin/orders', label: 'Orders' },
    { href: '/admin/users', label: 'Users' },
    { href: '/admin/analytics', label: 'Analytics' },
    { href: '/', label: 'Back to Store' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <nav className=" text-white shadow-lg p-6">
        <div className="px-4 flex flex-col">
          {/* <div className='w-full'>
            <Link href="/admin" className="bg-blue-500 rounded-md p-2 w-full">Admin Panel</Link>
          </div> */}
          <div className="flex flex-col justify-between items-center h-16 gap-4">
            <div className="flex flex-col items-center space-y-6 mt-6">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={clsx(
                    'px-4 py-2 rounded text-black transition-colors w-full text-center ',
                    pathname === href
                      ? 'bg-gray-800 text-white  font-semibold'
                      : 'hover:text-gray-300'
                  )}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
