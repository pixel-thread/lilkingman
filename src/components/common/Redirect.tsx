import { router, usePathname } from 'expo-router';
import { useEffect } from 'react';
import { useAuthContext } from '~/src/hooks/auth/useAuthContext';

export const Redirect = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthContext();
  const pathName = usePathname();
  const isAuthenticated = !!user;

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && pathName === '/auth') {
      router.replace('/');
    }
  }, [isAuthenticated]);

  return <>{children}</>;
};
