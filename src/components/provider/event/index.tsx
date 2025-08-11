import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { useAuthContext } from '~/src/hooks/auth/useAuthContext';
import { EVENTS_ENDPOINT } from '~/src/lib/constants/endpoints/event';
import { EventContext } from '~/src/lib/context/event';
import { EventContextI, EventI } from '~/src/types/context/event';
import http from '~/src/utils/http';

type Props = { children: React.ReactNode };

export const EventContextProvider = ({ children }: Props) => {
  const { user } = useAuthContext();
  const [isInitialized, setIsInitialized] = React.useState(true);
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['latest-event', user],
    queryFn: () => http.get<EventI>(EVENTS_ENDPOINT.GET_LATEST_EVENT),
    select: (data) => data.data,
    enabled: !!user ? true : false,
  });

  useEffect(() => {
    if (isInitialized && user) {
      setIsInitialized(false);
      refetch();
    }
  }, [user?.id, isInitialized]);

  const value = {
    event: data || null,
    isEventLoading: isFetching || isLoading,
    refresh: refetch,
  } satisfies EventContextI;

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
};
