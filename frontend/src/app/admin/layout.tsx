'use client';

import { useAppSelector } from '../../redux/hooks';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.replace('/login');
    }
  }, [user, router]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/admin" className="text-xl font-bold text-gray-900">
              Admin Dashboard
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/admin/products" className="text-gray-700 hover:text-gray-900">
                Products
              </Link>
              <Link href="/admin/categories" className="text-gray-700 hover:text-gray-900">
                Categories
              </Link>
              <Link href="/admin/orders" className="text-gray-700 hover:text-gray-900">
                Orders
              </Link>
              <Link href="/admin/users" className="text-gray-700 hover:text-gray-900">
                Users
              </Link>
              <Link href="/admin/analytics" className="text-gray-700 hover:text-gray-900">
                Analytics
              </Link>
              <Link href="/" className="text-gray-700 hover:text-gray-900">
                Back to Store
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}