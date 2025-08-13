import * as SecureStore from 'expo-secure-store';
import { AUTH_TOKEN_KEY } from '~/src/lib/constants/token';
import { logger } from '../../logger';
// get token from async storage
export const getToken = async () => {
  return await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
};

// set token in async storage
export const setToken = async (token: string) => {
  logger.log({ message: 'Saving token to storage' });
  return await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
};

// remove token from async storage
export const removeToken = async () => {
  return await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
};
