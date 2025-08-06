import { useMutation, useQuery } from '@tanstack/react-query';
import React from 'react';
import { AuthContext } from '~/src/lib/context/auth';
import { AuthContextI } from '~/src/types/context';
import { UserI } from '~/src/types/user';
import http from '~/src/utils/http';

type Props = {
  children: React.ReactNode;
};
export const AuthContextProvider = ({ children }: Props) => {
  const [user, setUser] = React.useState<UserI | null>(null);

  const { mutate, isPending } = useMutation({
    mutationKey: ['user'],
    mutationFn: () => http.post<UserI>('/auth'),
    onSuccess: (data) => {
      if (data.success) {
        setUser(data.data);
        return data.data;
      }
      return data;
    },
  });

  const value: AuthContextI = {
    user,
    refresh: () => mutate(),
    isAuthLoading: isPending,
  } satisfies AuthContextI;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
