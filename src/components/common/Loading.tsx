// src/components/Loading.tsx
import { useIsFetching } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { Loader } from './Loader';

export const Loading = ({ children }: { children: React.ReactNode }) => {
  const isFetching = useIsFetching({ queryKey: ['user'] });
  const [isLoading, setIsLoading] = useState(true);

  // Watch isFetching to trigger delay
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isFetching === 0) {
      timeout = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } else {
      setIsLoading(true);
    }

    return () => clearTimeout(timeout);
  }, [isFetching]);

  if (isLoading) {
    return <Loader />;
  }

  return <>{children}</>;
};
