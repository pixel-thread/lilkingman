import React, { useCallback, useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth, useSSO } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';
import { AppState, Platform, ToastAndroid } from 'react-native';

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
import {
  removeUser as removeUserFromStorage,
  getUser as getUserFromStorage,
  setUser as saveUserToStorage,
} from '~/src/utils/storage/user';

type Props = { children: React.ReactNode };

export const AuthContextProvider = ({ children }: Props) => {
  const [user, setUser] = useState<UserI | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [lastUserFetch, setLastUserFetch] = useState<number | null>(null);

  const queryClient = useQueryClient();

  // Clerk hooks
  const { startSSOFlow } = useSSO();
  const { getToken: getClerkToken, signOut: clerkSignOut, isSignedIn, isLoaded } = useAuth();

  // Prevent spamming backend — 15 min cache
  const isUserDataStale = useCallback(() => {
    if (!lastUserFetch) return true;
    return Date.now() - lastUserFetch > 15 * 60 * 1000; // 15 min
  }, [lastUserFetch]);

  /** Fetch current user from backend */
  const {
    mutate: fetchUser,
    mutateAsync: fetchUserAsync,
    isPending: isUserLoading,
  } = useMutation({
    mutationKey: ['user'],
    mutationFn: async () => {
      const freshToken = await getClerkToken({ template: 'jwt' });
      if (freshToken) {
        setToken(freshToken);
        await saveTokenToStorage(freshToken);
      }
      logger.info({ message: 'Fetching user' });
      return http.get<UserI>(AUTH_ENDPOINT.GET_ME);
    },

    onSuccess: async (data) => {
      if (data.success && data.data) {
        logger.info({ message: 'User fetch success' });
        setUser(data.data);
        await saveUserToStorage(data.data);
        setLastUserFetch(Date.now());
      } else {
        logger.warn({ message: 'User fetch failed — logging out' });
        if (Platform.OS !== 'ios') {
          ToastAndroid.show('Please Check your internet connection', ToastAndroid.SHORT);
        }
      }
    },
    onError: (error) => {
      logger.error({ message: 'User fetch error', error });
      if (Platform.OS !== 'ios') {
        ToastAndroid.show('There was an error while fetching your details', ToastAndroid.SHORT);
      }
      secureLogout();
    },
  });

  /** Google OAuth login */
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
    } catch (err: any) {
      if (err.clerkError && err.errors?.[0].code === 'session_exists') {
        logger.info({ message: 'User already signed in; bypassing login flow' });
        // Optionally, you can fetch user info here or just ignore
        await fetchUserAsync();
      } else {
        logger.error({ message: 'Google login failed', error: err });
        secureLogout();
      }
    }
  }, [isSignedIn, user, startSSOFlow, getClerkToken, fetchUserAsync]);

  /** Logout & cleanup */
  const secureLogout = useCallback(async () => {
    try {
      await clerkSignOut();
    } catch (err) {
      logger.error({ message: 'Clerk signOut error', error: err });
    } finally {
      setUser(null);
      await removeUserFromStorage();
      setToken(null);
      setLastUserFetch(null);
      queryClient.clear();
    }
  }, [clerkSignOut, queryClient]);

  /** Hydrate on app start */
  useEffect(() => {
    (async () => {
      try {
        logger.info({ message: 'Hydrating auth...' });

        const storedToken = await getTokenFromStorage();
        const storedUser = await getUserFromStorage();

        if (storedUser) {
          logger.info({ message: 'Loaded stored user' });
          setUser(storedUser);
        }

        // Case 1: Signed in
        if (isSignedIn) {
          const freshToken = await getClerkToken({ template: 'jwt' });

          if (freshToken) {
            if (freshToken !== storedToken) {
              await saveTokenToStorage(freshToken);
            }
            setToken(freshToken);

            // Fetch user if not already loaded
            if (!user) {
              await fetchUserAsync();
            }
          } else {
            logger.warn({ message: 'No fresh token — clearing auth' });
            await removeToken();
          }
        }
        // Case 2: Not signed in — clear state
        else {
          logger.info({ message: 'Not signed in — clearing stored token' });
          await removeToken();
        }
      } catch (err) {
        logger.error({ message: 'Auth hydration error', error: err });
        await removeToken();
      } finally {
        setIsInitializing(false);
      }
    })();
  }, [isLoaded, isSignedIn]); // Wait for Clerk to finish before running
  /** Foreground refresh */
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active' && token && isUserDataStale()) {
        fetchUser();
      }
    });
    return () => sub.remove();
  }, [token, fetchUser, isUserDataStale, user, isSignedIn]);

  const contextValue: AuthContextI = {
    user,
    refresh: fetchUser,
    isAuthLoading: isInitializing || isUserLoading,
    googleLogin,
    logout: secureLogout,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
