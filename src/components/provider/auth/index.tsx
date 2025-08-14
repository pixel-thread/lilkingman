import React, { useCallback, useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth, useSSO } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { AppState } from 'react-native';

import { AUTH_ENDPOINT } from '~/src/lib/constants/endpoints/auth';
import { AuthContext } from '~/src/lib/context/auth';
import { AuthContextI } from '~/src/types/context';
import { UserI } from '~/src/types/user';
import http from '~/src/utils/http';
import {
  getToken as getTokenFromStorage,
  setToken as saveTokenToStorage,
  removeToken,
} from '~/src/utils/storage/token';
import { logger } from '~/src/utils/logger';

type Props = { children: React.ReactNode };

export const AuthContextProvider = ({ children }: Props) => {
  const [user, setUser] = useState<UserI | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [lastUserFetch, setLastUserFetch] = useState<number | null>(null);

  const queryClient = useQueryClient();

  // Clerk hooks
  const { startSSOFlow } = useSSO();
  const { getToken: getClerkToken, signOut: clerkSignOut, isSignedIn } = useAuth();

  // Staleness check so we don't spam backend
  const isUserDataStale = useCallback(() => {
    if (!lastUserFetch) return true;
    return Date.now() - lastUserFetch > 15 * 60 * 1000; // 15 minutes
  }, [lastUserFetch]);

  // Fetch user from backend
  const {
    mutate: fetchUser,
    mutateAsync: fetchUserAsync,
    isPending: isUserLoading,
  } = useMutation({
    mutationKey: ['user'],
    mutationFn: async () => {
      const freshToken = await getClerkToken({ template: 'jwt' });
      if (freshToken && freshToken !== token) {
        setToken(freshToken);
        await saveTokenToStorage(freshToken);
      }
      return http.get<UserI>(AUTH_ENDPOINT.GET_ME, {
        headers: { Authorization: `Bearer ${freshToken || token}` },
      });
    },
    onSuccess: (data) => {
      if (data.success && data.data) {
        setUser(data.data);
        setLastUserFetch(Date.now());
      } else {
        logger.warn({ message: 'User fetch failed - logging out' });
        secureLogout();
      }
    },
    onError: (error) => {
      logger.error({ message: 'User fetch error', error });
      secureLogout();
    },
  });

  // Google login
  const googleLogin = useCallback(async () => {
    try {
      if (isSignedIn && user) {
        logger.info({ message: 'Already signed in — skipping login' });
        return;
      }

      logger.info({ message: 'Starting Google OAuth login' });
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl: Linking.createURL('/', { scheme: 'lilkingman' }),
      });

      if (!createdSessionId || !setActive) return;

      await setActive({ session: createdSessionId });

      const clerkJwt = await getClerkToken({ template: 'jwt' });
      if (!clerkJwt) throw new Error('No JWT from Clerk after login');

      await saveTokenToStorage(clerkJwt);
      setToken(clerkJwt);

      await fetchUserAsync();
    } catch (err) {
      logger.error({ message: 'Google login failed', error: err });
      secureLogout();
    }
  }, [isSignedIn, user, startSSOFlow, getClerkToken, fetchUserAsync]);

  // Logout
  const secureLogout = useCallback(async () => {
    try {
      await clerkSignOut();
    } catch (err) {
      logger.error({ message: 'Clerk signOut error', error: err });
    } finally {
      setUser(null);
      setToken(null);
      setLastUserFetch(null);
      await removeToken();
      queryClient.clear();
      router.replace('/auth');
    }
  }, [clerkSignOut, queryClient]);

  // Hydrate token on app start
  useEffect(() => {
    (async () => {
      try {
        logger.info({ message: 'Hydrating auth...' });
        const storedToken = await getTokenFromStorage();
        if (storedToken && isSignedIn) {
          const freshToken = await getClerkToken({ template: 'jwt' });
          if (freshToken) {
            setToken(freshToken);
            if (freshToken !== storedToken) {
              await saveTokenToStorage(freshToken);
            }
            await fetchUserAsync();
          } else {
            await removeToken();
          }
        } else {
          await removeToken();
        }
      } catch (err) {
        logger.error({ message: 'Auth hydration error', error: err });
        await removeToken();
      } finally {
        setIsInitializing(false);
      }
    })();
  }, [isSignedIn]);

  // Refresh user when app comes to foreground
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active' && token && isUserDataStale()) {
        fetchUser();
      }
    });
    return () => sub.remove();
  }, [token, fetchUser, isUserDataStale]);

  const contextValue: AuthContextI = {
    user,
    refresh: fetchUser,
    isAuthLoading: isInitializing || isUserLoading,
    googleLogin,
    logout: secureLogout,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
