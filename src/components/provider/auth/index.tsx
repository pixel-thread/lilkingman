import React, { useCallback, useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useOAuth, useAuth } from '@clerk/clerk-expo';

import { AUTH_ENDPOINT } from '~/src/lib/constants/endpoints/auth';
import { AuthContext } from '~/src/lib/context/auth';
import { AuthContextI } from '~/src/types/context';
import { UserI } from '~/src/types/user';
import http from '~/src/utils/http';
import {
  getToken as getTokenFromStorage,
  removeToken,
  setToken as saveTokenToStorage,
} from '~/src/utils/storage/token';
import {
  getUser as getUserFromStorage,
  removeUser,
  setUser as saveUserToStorage,
} from '~/src/utils/storage/user';
import { logger } from '~/src/utils/logger';
import { router } from 'expo-router';
import * as Linking from 'expo-linking';

type Props = { children: React.ReactNode };

export const AuthContextProvider = ({ children }: Props) => {
  const [user, setUser] = useState<UserI | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [hasLocalUser, setHasLocalUser] = useState(false);
  const queryClient = useQueryClient();

  const { startOAuthFlow } = useOAuth({
    strategy: 'oauth_google',
    redirectUrl: Linking.createURL('/', { scheme: 'lilkingman' }),
  });

  const { getToken: getClerkToken, signOut: clerkSignOut } = useAuth();

  const {
    mutate: refetchUser, // fire-and-forget
    mutateAsync: refetchUserAsync, // promise version
    isPending: isUserPending,
  } = useMutation({
    mutationKey: ['user'],
    mutationFn: () =>
      http.get<UserI>(AUTH_ENDPOINT.GET_ME, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    onSuccess: async (data) => {
      if (data.success && data.data) {
        setUser(data.data);
        logger.log({ message: 'Saved user to storage' });
        await saveUserToStorage(data.data);
        return data.data;
      }
      await logout();
      return;
    },
    onError: () => {
      if (!hasLocalUser) clearAuth();
    },
  });

  const googleLogin = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();

      if (!createdSessionId || !setActive) {
        return;
      }

      await setActive({ session: createdSessionId });

      const clerkJwt = await getClerkToken({ template: 'jwt' });

      if (!clerkJwt) throw new Error('Failed to fetch Clerk JWT');

      await saveTokenToStorage(clerkJwt);
      setToken(clerkJwt);

      await refetchUserAsync();
    } finally {
      setIsInitializing(false);
    }
  }, [getClerkToken, refetchUserAsync, startOAuthFlow]);

  const logout = useCallback(async () => {
    try {
      await clerkSignOut();
      router.push('/auth');
    } finally {
      clearAuth();
      queryClient.clear();
    }
  }, [clerkSignOut, token, queryClient]);

  const clearAuth = async () => {
    setUser(null);
    setToken(null);
    setHasLocalUser(false);
    await removeUser();
  };

  useEffect(() => {
    (async () => {
      try {
        logger.info({ message: 'Hydrating auth' });
        const storedToken = await getTokenFromStorage();
        const storedUser = await getUserFromStorage();

        if (storedToken) setToken(storedToken);
        if (storedUser) {
          logger.info({ message: 'Hydrating user from storage' });
          setUser(JSON.parse(storedUser));
          setHasLocalUser(true);
        }
      } catch (e) {
        console.log('[Auth] Failed to hydrate:', e);
      } finally {
        setIsInitializing(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!isInitializing && token) {
      refetchUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, isInitializing]);

  /* ───────────────────────────────
     Context value
  ─────────────────────────────── */
  const contextValue: AuthContextI = {
    user: user,
    refresh: refetchUser, // callers can pull fresh user manually
    isAuthLoading: isInitializing || (!hasLocalUser && isUserPending),
    googleLogin,
    logout,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
