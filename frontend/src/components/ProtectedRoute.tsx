'use client';

import { useEffect } from 'react';
import { useAppSelector } from '../redux/hooks';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export default function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
  const { user, loading } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        console.log('User not authenticated, redirecting to login');
        router.push('/login');
      } else if (!requireAuth && user) {
        console.log('User already authenticated, redirecting to home');
        router.push('/');
      }
    }
  }, [user, loading, requireAuth, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return null; // Don't render anything while redirecting
  }

  if (!requireAuth && user) {
    return null; // Don't render anything while redirecting
  }

  return <>{children}</>;
}