'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { checkAuth } from '../redux/authSlice';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { token, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Check authentication status on app load if token exists
    if (token && !loading) {
      dispatch(checkAuth());
    }
  }, [dispatch, token, loading]);

  return <>{children}</>;
}
