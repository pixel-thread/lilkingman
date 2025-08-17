import { useEffect } from 'react';
import { usePathname, useRouter } from 'expo-router';
import { useAuthContext } from '~/src/hooks/auth/useAuthContext';

export const Redirect = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthLoading } = useAuthContext();
  const pathName = usePathname();
  const router = useRouter();

  // Determine if user is authenticated (either Clerk's or context user)
  const isAuthenticated = !!user;

  useEffect(() => {
    // Wait for both auth state to load and not be in loading phase
    if (isAuthLoading) return;

    // Redirect unauthenticated users away from protected routes
    if (!isAuthenticated && pathName !== '/auth') {
      router.replace('/auth');
      return;
    }

    // Redirect authenticated users away from the auth page
    if (isAuthenticated && pathName === '/auth') {
      router.replace('/');
      return;
    }
  }, [isAuthenticated, isAuthLoading, pathName, router, user]);

  return <>{children}</>;
};
