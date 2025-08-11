import { useMutation } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { AUTH_ENDPOINT } from '~/src/lib/constants/endpoints/auth';
import { AuthContext } from '~/src/lib/context/auth';
import { AuthContextI } from '~/src/types/context';
import { UserI } from '~/src/types/user';
import http from '~/src/utils/http';
import { getToken, removeToken } from '~/src/utils/storage/token';
import { getUser, removeUser } from '~/src/utils/storage/user';

type Props = { children: React.ReactNode };

export const AuthContextProvider = ({ children }: Props) => {
  const [user, setUser] = React.useState<UserI | null>(null);
  const [token, setToken] = React.useState<string | null>(null);
  const [isInitializing, setIsInitializing] = React.useState(true); // to handle first load

  const { mutate: fetchUser, isPending } = useMutation({
    mutationKey: ['user'],
    mutationFn: () => http.get<UserI>(AUTH_ENDPOINT.GET_ME),
    onSuccess: (data) => {
      if (data.success) {
        setUser(data.data);
        return data;
      }
      clearAuth();
      return null;
    },
    onError: () => {
      clearAuth();
    },
  });

  const clearAuth = () => {
    setUser(null);
    setToken(null);
    removeUser();
    removeToken();
  };

  // Load token + local user instantly
  const initAuthFromStorage = async () => {
    const storedToken = await getToken();
    const storedUser = await getUser();

    if (storedToken) {
      setToken(storedToken);
    }
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsInitializing(false);
  };

  // On mount: load from storage immediately
  useEffect(() => {
    initAuthFromStorage();
  }, []);

  // After token is set, validate with server
  useEffect(() => {
    if (!isInitializing && token) {
      fetchUser();
    }
  }, [token, isInitializing]);

  const value: AuthContextI = {
    user,
    refresh: fetchUser,
    isAuthLoading: isPending || isInitializing,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
