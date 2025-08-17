import React, { useEffect, useState } from 'react';
import { Loader } from './Loader';
import { useAuthContext } from '~/src/hooks/auth/useAuthContext';
import { usePathname } from 'expo-router';

type Props = {
  children: React.ReactNode;
};
export const Loading = ({ children }: Props) => {
  const { isAuthLoading, user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const pathName = usePathname();
  // const { isSignedIn } = useAuth();
  // Watch isFetching to trigger delay
  useEffect(() => {
    if (!isAuthLoading && isLoading) {
      setIsLoading(false);
    }
  }, [isAuthLoading, isLoading]);

  if (isLoading) {
    return <Loader />;
  }

  if (pathName === '/auth' && !!user) {
    return <Loader />;
  }

  return <>{children}</>;
};
