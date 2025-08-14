import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-expo';
import { usePathname, useRouter } from 'expo-router';
import { useAuthContext } from '~/src/hooks/auth/useAuthContext';
import { logger } from '~/src/utils/logger';

export const Redirect = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthLoading } = useAuthContext();
  const { isLoaded, isSignedIn } = useAuth();
  const pathName = usePathname();
  const router = useRouter();

  // Determine if user is authenticated (either Clerk's or context user)
  const isAuthenticated = !!user && isSignedIn;

  useEffect(() => {
    logger.log({
      message: 'Redirect check',
      isAuthenticated,
      userExists: !!user,
      isAuthLoading,
      isLoaded,
      isSignedIn,
      currentPath: pathName,
    });

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
