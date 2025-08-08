'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { checkAuth } from '../redux/authSlice';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { token, loading, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Check authentication status on app load if token exists
    if (token && !loading && !user) {
      console.log('Checking authentication...');
      dispatch(checkAuth());
    }
  }, [dispatch, token, loading, user]);

  return <>{children}</>;
}