import { useMutation } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { AUTH_ENDPOINT } from '~/src/lib/constants/endpoints/auth';
import { AuthContext } from '~/src/lib/context/auth';
import { AuthContextI } from '~/src/types/context';
import { UserI } from '~/src/types/user';
import http from '~/src/utils/http';
import { getToken, removeToken, setToken as saveToken } from '~/src/utils/storage/token';
import { getUser, removeUser, setUser as saveUser } from '~/src/utils/storage/user';

type Props = { children: React.ReactNode };

export const AuthContextProvider = ({ children }: Props) => {
  const [user, setUser] = React.useState<UserI | null>(null);
  const [token, setToken] = React.useState<string | null>(null);
  const [isInitializing, setIsInitializing] = React.useState(true);
  const [hasLocalUser, setHasLocalUser] = React.useState(false); // Track if we have local user

  const { mutate: fetchUser, isPending } = useMutation({
    mutationKey: ['user'],
    mutationFn: () => http.get<UserI>(AUTH_ENDPOINT.GET_ME),
    onSuccess: (data) => {
      if (data.success) {
        // Update user with fresh data from backend
        setUser(data.data);
        // Update local storage with fresh user data
        if (data.data) {
          saveUser(data.data);
        }
        return data;
      }
      clearAuth();
      return null;
    },
    onError: () => {
      // Only clear auth if we don't have a local user
      // This prevents logout when network is temporarily unavailable
      if (!hasLocalUser) {
        clearAuth();
      }
    },
  });

  const clearAuth = () => {
    setUser(null);
    setToken(null);
    setHasLocalUser(false);
    removeUser();
    removeToken();
  };

  // Load token + local user instantly
  const initAuthFromStorage = async () => {
    try {
      const storedToken = await getToken();
      const storedUser = await getUser();

      if (storedToken) {
        setToken(storedToken);
      }

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setHasLocalUser(true); // Mark that we have a local user
      }
    } catch (error) {
      console.log('Error loading auth from storage:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  // On mount: load from storage immediately
  useEffect(() => {
    initAuthFromStorage();
  }, []);

  // After token is set and initialization is complete, validate with server
  useEffect(() => {
    if (!isInitializing && token && hasLocalUser) {
      // Only fetch from server if we have both token and local user
      fetchUser();
    } else if (!isInitializing && token && !hasLocalUser) {
      // If we have token but no local user, still try to fetch
      fetchUser();
    }
  }, [token, isInitializing, hasLocalUser]);

  const value: AuthContextI = {
    user,
    refresh: fetchUser,
    // User is considered "loading" only if we're initializing OR
    // (we don't have a local user AND we're fetching from server)
    isAuthLoading: isInitializing || (!hasLocalUser && isPending),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
