// components/AuthGuard.tsx
import React, { useEffect, ReactNode, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

interface AuthGuardProps {
  children: ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps): JSX.Element | null => {
  const { user } = useAuth();
  const router = useRouter();
  const [isLayoutMounted, setIsLayoutMounted] = useState(false);

  useEffect(() => {
    setIsLayoutMounted(true); // Mark layout as mounted after first render
  }, []);

  useEffect(() => {
    if (isLayoutMounted && !user) {
      router.replace('/login'); // Redirect only after layout is mounted
    }
  }, [user, isLayoutMounted, router]);

  if (!user) {
    return null; // Optionally render a loading spinner
  }

  return <>{children}</>;
};
