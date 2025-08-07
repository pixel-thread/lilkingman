import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useAuthContext } from '~/src/hooks/auth/useAuthContext';
import { EventContext } from '~/src/lib/context/event';
import { EventContextI, EventI } from '~/src/types/context/event';
import http from '~/src/utils/http';

type Props = { children: React.ReactNode };

export const EventContextProvider = ({ children }: Props) => {
  const { user } = useAuthContext();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['latest-event'],
    queryFn: () => http.get<EventI>('/event/latest'),
    enabled: !!user,
    select: (data) => data.data,
  });

  const value = {
    event: data || null,
    isEventLoading: isLoading,
    refresh: refetch,
  } satisfies EventContextI;

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
};
