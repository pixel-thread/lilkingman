import { router, usePathname } from 'expo-router';
import { useEffect, useState } from 'react';
import { useAuthContext } from '~/src/hooks/auth/useAuthContext';
import { logger } from '~/src/utils/logger';

export const Redirect = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthContext();
  const pathName = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (user) {
      logger.log({ message: 'Redirect useEffect 1', isAuthenticated, user: !!user });
      setIsAuthenticated(true);
    } else {
      logger.log({ message: 'Redirect useEffect 1.1', isAuthenticated, user: !!user });
      setIsAuthenticated(false);
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated && pathName !== '/auth') {
      logger.log({ message: 'Redirect useEffect 2', isAuthenticated, user: !!user });
      router.push('/auth');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && pathName === '/auth') {
      logger.log({ message: 'Redirect useEffect 3', isAuthenticated, user: !!user });
      router.push('/');
    }
  }, [isAuthenticated]);

  return <>{children}</>;
};
