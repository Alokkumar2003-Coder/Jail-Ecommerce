'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch } from '../../../redux/hooks';
import { checkAuth } from '../../../redux/authSlice';

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = searchParams.get('token');

    const run = async () => {
      if (!token) {
        router.replace('/login');
        return;
      }
      localStorage.setItem('token', token);
      try {
        await dispatch(checkAuth()).unwrap();
        router.replace('/');
      } catch {
        localStorage.removeItem('token');
        router.replace('/login');
      }
    };

    run();
  }, [dispatch, router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Signing you in...</p>
    </div>
  );
}