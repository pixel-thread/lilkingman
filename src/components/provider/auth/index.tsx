import { useMutation } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { AuthContext } from '~/src/lib/context/auth';
import { AuthContextI } from '~/src/types/context';
import { UserI } from '~/src/types/user';
import http from '~/src/utils/http';
import { logger } from '~/src/utils/logger';
import { getToken, removeToken } from '~/src/utils/storage/token';
import { getUser, removeUser } from '~/src/utils/storage/user';

type Props = {
  children: React.ReactNode;
};
export const AuthContextProvider = ({ children }: Props) => {
  const [user, setUser] = React.useState<UserI | null>(null);
  const [token, setToken] = React.useState<string | null>(null);
  const { mutate, isPending } = useMutation({
    mutationKey: ['user'],
    mutationFn: () => http.get<UserI>('/auth'),
    onSuccess: (data) => {
      if (data.success) {
        setUser(data.data);
        return data.data;
      }
      setUser(null);
      removeUser();
      setToken(null);
      removeToken();
      return data;
    },
  });

  const getTokenAndUserFromStorage = async () => {
    const token = await getToken();
    if (token) {
      setToken(token);
      const user = await getUser();
      if (user) {
        setUser(JSON.parse(user));
      }
    }
    return;
  };

  useEffect(() => {
    getTokenAndUserFromStorage();
  }, []);

  useEffect(() => {
    if (token !== '') {
      mutate();
    }
  }, [token]);

  const value: AuthContextI = {
    user: user,
    refresh: () => mutate(),
    isAuthLoading: isPending,
  } satisfies AuthContextI;
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
